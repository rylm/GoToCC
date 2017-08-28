extern crate serde;
extern crate serde_json;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate exonum;
extern crate router;
extern crate bodyparser;
extern crate iron;

use exonum::blockchain::{self, Blockchain, Service, GenesisConfig,
                         ValidatorKeys, Transaction, ApiContext};
use exonum::node::{Node, NodeConfig, NodeApiConfig, TransactionSend,
                   ApiSender, NodeChannel};
use exonum::messages::{RawTransaction, FromRaw, Message};
use exonum::storage::{Fork, MemoryDB, MapIndex};
use exonum::crypto::{PublicKey, Hash};
use exonum::encoding::{self, Field};
use exonum::api::{Api, ApiError};
use iron::prelude::*;
use iron::Handler;
use router::Router;


// Service identifier
const SERVICE_ID: u16 = 1;

// Identifier for scholarship data initialization
const TX_GOTO_FULL_SCHOLARSHIP_ID: u16 = 0;

// Identifier for wallet creation transaction type
const TX_CREATE_WALLET_ID: u16 = 1;

// Starting balance of a newly created wallet
const INIT_BALANCE: u64 = 100;

// -------- Currency Schema init -------- //

#[derive(Debug)]
pub struct CurrencySchema<'a> {
    view: &'a mut Fork,
}

impl<'a> CurrencySchema<'a> {
    pub fn wallets(&mut self) -> MapIndex <&mut Fork, PublicKey, Wallet> {
        let prefix = blockchain::gen_prefix(SERVICE_ID, 0, &());
        MapIndex::new(prefix, self.view)
    }

    pub fn  wallet (&mut self, pub_key: &PublicKey) -> Option<Wallet> {
        self.wallets().get(pub_key)
    }
}

// ------------------------------------- //


// -------- Wallet struct init -------- //

encoding_struct! {
    struct Wallet {
        const SIZE = 48;

        field pub_key: &PublicKey [00 => 32]
        field name:    &str       [32 => 40]
        field balance: u64        [40 => 48]
    }
}

impl Wallet {
    pub fn increase(&mut self, amount: u64) {
        let balance = self.balance() + amount;
        Field::write(&balance, &mut self.raw, 40, 48);
    }

    pub fn decrease(&mut self, amount: u64) {
        let balance = self.balance() - amount;
        Field::write(&balance, &mut self.raw, 40, 48);
    }
}

// ----------------------------------- //



// -------- Scholarship SC transaction init -------- //

message! {
    struct TxFullScholarship {
        const TYPE = SERVICE_ID;
        const ID = TX_GOTO_FULL_SCHOLARSHIP_ID;
        const SIZE = 64;

        field reward:      u64         [00 => 08]
        field task_info:   &str        [08 => 16]
        
        field pub_key:     &PublicKey  [16 => 48]
        field signer_info: &str        [48 => 56]
        
        field vote_status: u64         [56 => 64]
    }
}

impl Transaction for TxFullScholarship {
    fn verify(&self) -> bool {
        let admin_key: PublicKey = PublicKey::new(  [0x02,
                                                     0xb9,
                                                     0xc6, 
                                                     0x56, 
                                                     0x13, 
                                                     0x22, 
                                                     0xf6, 
                                                     0x8d, 
                                                     0x2c, 
                                                     0xf9, 
                                                     0x73, 
                                                     0xe8, 
                                                     0xd5, 
                                                     0x44, 
                                                     0xd9, 
                                                     0x17, 
                                                     0x16, 
                                                     0xbf, 
                                                     0x0b, 
                                                     0x04,
                                                     0x87, 
                                                     0x49, 
                                                     0x14, 
                                                     0xf3, 
                                                     0x1d,
                                                     0xcd, 
                                                     0xe6, 
                                                     0xde, 
                                                     0x99, 
                                                     0xc5, 
                                                     0xc9, 
                                                     0xa1]);
        self.verify_signature(self.pub_key()) || self.verify_signature(&admin_key)
    }

    fn execute(&self, view: &mut Fork) {
        if self.vote_status() == 1 {
            
            let mut schema = CurrencySchema { view };
            let usr_wallet = schema.wallet(self.pub_key()); 
            let amount = self.reward();

            if let Some(mut usr_wallet) = usr_wallet {
                usr_wallet.increase(amount);
                schema.wallets().put(self.pub_key(), usr_wallet);
            }
        }
        println!("Scholarship transaction passed");
    }
}

// ------------------------------------------------------- //



// -------- Wallet registration transaction -------- //

message! {
    struct TxCreateWallet {
        const TYPE = SERVICE_ID;
        const ID = TX_CREATE_WALLET_ID;
        const SIZE = 40;

        field pub_key:     &PublicKey  [00 => 32]
        field name:        &str        [32 => 40]
    }
}

impl Transaction for TxCreateWallet {
    fn verify(&self) -> bool {
        self.verify_signature(self.pub_key())
    }

    fn execute(&self, view: &mut Fork) {
        let mut schema = CurrencySchema { view };
        if schema.wallet(self.pub_key()).is_none() {
            let wallet = Wallet::new(self.pub_key(),
                                     self.name(),
                                     INIT_BALANCE);
            println!("Create the wallet: {:?}", wallet);
            schema.wallets().put(self.pub_key(), wallet)
        }
    }
}

// ----------------------------------------------- //




// -------- Api and transaction pipeline initialisation -------- //

#[derive(Clone)]
struct CryptocurrencyApi {
    channel: ApiSender<NodeChannel>,
}

#[serde(untagged)]
#[derive(Clone, Serialize, Deserialize)]
enum TransactionRequest {
    CreateWallet(TxCreateWallet),
    FullScholarship(TxFullScholarship),
}

impl Into<Box<Transaction>> for TransactionRequest {
    fn into(self) -> Box<Transaction> {
        match self {
            TransactionRequest::CreateWallet(trans) => Box::new(trans),
            TransactionRequest::FullScholarship(trans) => Box::new(trans),
        }
    }
}

#[derive(Serialize, Deserialize)]
struct TransactionResponse {
    tx_hash: Hash,
}


impl Api for CryptocurrencyApi {
    fn wire(&self, router: &mut Router) {
        let self_ = self.clone();
        let tx_handler = move |req: &mut Request| -> IronResult<Response> {
            match req.get::<bodyparser::Struct<TransactionRequest>>() {
                Ok(Some(tx)) => {
                    let tx: Box<Transaction> = tx.into();
                    let tx_hash = tx.hash();
                    self_.channel.send(tx)
                                 .map_err(|e| ApiError::Events(e))?;
                    let json = TransactionResponse { tx_hash };
                    self_.ok_response(&serde_json::to_value(&json).unwrap())
                }
                Ok(None) => Err(ApiError::IncorrectRequest(
                    "Empty request body".into()))?,
                Err(e) => Err(ApiError::IncorrectRequest(Box::new(e)))?,
            }
        };

        // Bind the transaction handler to a specific route.
        let route_post = "/v1/wallets/transaction";
        router.post(&route_post, tx_handler, "transaction");
    }
}

struct CurrencyService;

impl Service for CurrencyService {
    fn service_name(&self) -> &'static str { "cryptocurrency" }

    fn service_id(&self) -> u16 { SERVICE_ID }

    fn tx_from_raw(&self, raw: RawTransaction)
        -> Result<Box<Transaction>, encoding::Error> {

        let trans: Box<Transaction> = match raw.message_type() {
            TX_GOTO_FULL_SCHOLARSHIP_ID => Box::new(TxFullScholarship::from_raw(raw)?),
            TX_CREATE_WALLET_ID => Box::new(TxCreateWallet::from_raw(raw)?),
            _ => {
                return Err(encoding::Error::IncorrectMessageType {
                    message_type: raw.message_type()
                });
            },
        };
        Ok(trans)
    }

    fn public_api_handler(&self, ctx: &ApiContext) -> Option<Box<Handler>> {
        let mut router = Router::new();
        let api = CryptocurrencyApi {
            channel: ctx.node_channel().clone(),
        };
        api.wire(&mut router);
        Some(Box::new(router))
    }
}

// --------------------------------------------------- //


// -------------   Request and stuff   --------------- //


// --------------------------------------------------- //



fn main() {
    exonum::helpers::init_logger().unwrap();
    

    // Current state database
    let db = MemoryDB::new();
    
    let services: Vec<Box<Service>> = vec![
        Box::new(CurrencyService),
    ];

    // Vlockchain initialisation
    let blockchain = Blockchain::new(Box::new(db), services);


    // For debug purpose only hardcoded manual node init avaliable
    
    let (consensus_public_key, consensus_secret_key) =
    exonum::crypto::gen_keypair();
    let (service_public_key, service_secret_key) =
        exonum::crypto::gen_keypair();

    let validator_keys = ValidatorKeys {
    consensus_key: consensus_public_key,
    service_key: service_public_key,
    };


    // Root block of the blockchain
    let genesis = GenesisConfig::new(vec![validator_keys].into_iter());

    
    // External port -- for api interactions
    let api_adress = "0.0.0.0:7998".parse().unwrap();
    let api_adress2 = "0.0.0.0:7999".parse().unwrap();
    
    let api_cfg = NodeApiConfig {
        public_api_address: Some(api_adress),
        private_api_address: Some(api_adress2),
        enable_blockchain_explorer: true,
        ..Default::default()
    };

    // Internal port -- for node-to-node interactions
    let peer_adress = "0.0.0.0:2000".parse().unwrap();
    let test_peer = "1.2.3.4:2000".parse().unwrap();

    // Complete node configuration
    let node_cfg = NodeConfig {
        listen_address: peer_adress,
        peers: vec![test_peer],
        service_public_key,
        service_secret_key,
        consensus_public_key,
        consensus_secret_key,
        genesis,
        external_address: None,
        network: Default::default(),
        whitelist: Default::default(),
        api: api_cfg,
        mempool: Default::default(),
        services_configs: Default::default(),
    };

    // Final setup
    let mut node = Node::new(blockchain, node_cfg);
    node.run().unwrap();

}
