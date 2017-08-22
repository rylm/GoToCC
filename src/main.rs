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

const TX_GOTO_FULL_SCHOLARSHIP_ID: u16 = 0;

// Identifier for wallet creation transaction type
const TX_CREATE_WALLET_ID: u16 = 1;

const TX_SET_UP_TASK_ID: u16 = 2;
const TX_VOTE_FOR_TASK_ID: u16 = 3;

const TX_LOOK_WHAT_I_DID_ID: u16 = 4;

const TASK_INITIATOR_ADMIN_ID: u16 = 1;
const TASK_INITIATOR_ID: u16 = 2;
const TASK_SIGNER_ID: u16 = 3;

// Starting balance of a newly created wallet
const INIT_BALANCE: u64 = 100;



const ADMIN_PUBLIC_KEY: PublicKey = PublicKey::new([0x9c,
    0xd1,
    0x29,
    0x92,
    0x9c,
    0x2b,
    0x5a,
    0xfb,
    0x7f,
    0x7e,
    0x73,
    0x20,
    0xce,
    0x28,
    0x9e,
    0x26,
    0xae,
    0x90,
    0x20,
    0xe9,
    0xa0,
    0x3a,
    0x44,
    0xb8,
    0x80,
    0x95,
    0xb5,
    0x79,
    0x86,
    0x32,
    0xe6,
    0xb1]);//;


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

// impl TxFullScholarship {
//     fn blank() -> TxFullScholarship {
//         TxFullScholarship.raw {
//             0,
//             "",
//             [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
//             "",
//             0 
//         };
//     }
// }

message! {
    struct TxSetUpScholarship {
        const TYPE = SERVICE_ID;
        const ID = TX_SET_UP_TASK_ID;
        const SIZE = 16;

        field reward:      u64         [00 => 08]
        field task_info:   &str        [08 => 16]
    }
}

message! {
    struct TxLookWhatIDid {
        const TYPE = SERVICE_ID;
        const ID = TX_VOTE_FOR_TASK_ID;
        const SIZE = 72;

        field pub_key:     &PublicKey  [00 => 32]
        field signer_info: &str        [32 => 40]

        field msg_key:     &PublicKey  [40 => 72]
    }
}

message! {
    struct TxVoteForScholarship {
        const TYPE = SERVICE_ID;
        const ID = TX_VOTE_FOR_TASK_ID;
        const SIZE = 40;

        field vote_status: u64         [00 => 08]

        field msg_key:     &PublicKey  [08 => 40]
    }
}



// Wallet creation
message! {
    struct TxCreateWallet {
        const TYPE = SERVICE_ID;
        const ID = TX_CREATE_WALLET_ID;
        const SIZE = 40;

        field pub_key:     &PublicKey  [00 => 32]
        field name:        &str        [32 => 40]
    }
}

// Transaction behaviour
impl Transaction for TxVoteForScholarship {
    fn verify(&self) -> bool {
        //(self.verify_signature(self.pub_key()))
        (self.verify_signature(&ADMIN_PUBLIC_KEY))
    }

    fn execute(&self, view: &mut Fork) {
        let mut schema = CurrencySchema { view };

        if self.vote_id == 1 {
            let usr_wallet = schema.wallet(self.pub_key()); 
            let amount = self.amount();

            if let Some(mut usr_wallet) = usr_wallet {
                usr_wallet.increase(amount);

                schema.wallets().put(self.pub_key(), usr_wallet);
            }
        }
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


#[derive(Clone)]
struct CryptocurrencyApi {
    channel: ApiSender<NodeChannel>,
}

#[serde(untagged)]
#[derive(Clone, Serialize, Deserialize)]
enum TransactionRequest {
    CreateWallet(TxCreateWallet),
}

impl Into<Box<Transaction>> for TransactionRequest {
    fn into(self) -> Box<Transaction> {
        match self {
            TransactionRequest::CreateWallet(trans) => Box::new(trans),
            TransactionRequest::Transfer(trans) => Box::new(trans),
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
            //TODO
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

fn main() {
    exonum::helpers::init_logger().unwrap();
    
    let db = MemoryDB::new();
    
    let services: Vec<Box<Service>> = vec![
        Box::new(CurrencyService),
    ];

    let blockchain = Blockchain::new(Box::new(db), services);


    let (consensus_public_key, consensus_secret_key) =
    exonum::crypto::gen_keypair();
    let (service_public_key, service_secret_key) =
        exonum::crypto::gen_keypair();

    let validator_keys = ValidatorKeys {
    consensus_key: consensus_public_key,
    service_key: service_public_key,
    };

    let genesis = GenesisConfig::new(vec![validator_keys].into_iter());

    // external port
    let api_adress = "0.0.0.0:8000".parse().unwrap();
    let api_cfg = NodeApiConfig {
        public_api_address: Some(api_adress),
        enable_blockchain_explorer: true,
        ..Default::default()
    };

    let peer_adress = "0.0.0.0:2000".parse().unwrap();

    // Complete node configuration
    let node_cfg = NodeConfig {
        listen_address: peer_adress,
        peers: vec![],
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
    };ckchain

    let mut node = Node::new(blo, node_cfg); 
    node.run().unwrap();

}
