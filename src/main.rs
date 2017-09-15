extern crate serde;
extern crate serde_json;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate exonum;
extern crate router;
extern crate bodyparser;
extern crate iron;

use std::any::Any;
use std::fs::File;
use std::io::{stdin,stdout,Write, BufReader, BufRead};

use exonum::blockchain::{self, Blockchain, Service, Schema, GenesisConfig, ConsensusConfig,
                         ValidatorKeys, Transaction, ApiContext};
use exonum::node::{Node, NodeConfig, NodeApiConfig, TransactionSend,
                   ApiSender, NodeChannel};
use exonum::messages::{RawTransaction, RawMessage, FromRaw, Message};
use exonum::storage::{Fork, MapIndex, LevelDB, LevelDBOptions};
use exonum::crypto::{PublicKey, SecretKey, Hash, HexValue};
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
        const SIZE = 72;

        field reward:      u64         [00 => 08]
        field task_info:   &str        [08 => 16]
        
        field pub_key:     &PublicKey  [16 => 48]
        field signer_info: &str        [48 => 56]
        
        field vote_status: u64         [56 => 64]
        field aquire_status: u64       [64 => 72]
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

    fn info (&self) -> serde_json::Value {
        serde_json::to_value(self).unwrap()
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

    fn info (&self) -> serde_json::Value {
        serde_json::to_value(self).unwrap()
    }
}

// ----------------------------------------------- //




// -------- Api and transaction pipeline initialisation -------- //

#[derive(Clone)]
struct CryptocurrencyApi {
    channel: ApiSender<NodeChannel>,
    blockchain: Blockchain,
}

impl CryptocurrencyApi {

    fn get_wallet(&self, pub_key: &PublicKey) -> Option<Wallet> {
        let mut view = self.blockchain.fork();
        let mut schema = CurrencySchema { view: &mut view };
        schema.wallet(pub_key)
    }

    fn get_cs_with_filter (&self, contract_filter: &Fn(&serde_json::Value)-> bool) -> Option<Vec<serde_json::Value>> {
        let view = self.blockchain.fork();
        let schema = Schema::new(view);

        let transactions = schema.transactions();

        let all_cs: Vec<RawMessage> = transactions.values().collect();

        // Unwrapping needed transactions -- TODO: change to map
        let mut unwrapped_contracts : Vec<serde_json::Value> = Vec::new();
        for tx in all_cs {
            let tx = self.blockchain.tx_from_raw(tx).unwrap();
            let info = tx.info();
            match info.as_object() {
                Some(obj) => {
                    if obj["message_id"] == TX_GOTO_FULL_SCHOLARSHIP_ID {
                        unwrapped_contracts.push(obj["body"].clone());
                    }
                },
                None => {},
            }
        }

        // Filtering 
        let filtered_contracts : Vec<serde_json::Value> = unwrapped_contracts.into_iter().filter(contract_filter).collect();

        if filtered_contracts.len() == 0 {
            return None;
        }

        return Some(filtered_contracts);
    }
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

        
        fn initialised (tx: &serde_json::Value) -> bool {
                let empty_key = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                if tx["pub_key"] == empty_key { true }
                else  { false }
        }

        fn not_voted (tx: &serde_json::Value) -> bool {
                if !initialised(tx) && tx["vote_status"] == "0" { true }
                else { false }
        }

        // Contracts, avaliable for assigning
        let self_ = self.clone();
        let open_contracts = move |_: &mut Request| -> IronResult<Response> {
            match self_.get_cs_with_filter(&initialised) {
                Some(contracts) => {
                    self_.ok_response(&serde_json::to_value(contracts).unwrap())
                }
                None => self_.not_found_response(&serde_json::to_value("No open contracts avaliable").unwrap())
            }
        };
           
        // Done contracts, avaliavle for voting
        let self_ = self.clone();
        let done_contracts = move |_: &mut Request| -> IronResult<Response> {
            match self_.get_cs_with_filter(&not_voted) {
                Some(contracts) => {
                    self_.ok_response(&serde_json::to_value(contracts).unwrap())
                }
                None => self_.not_found_response(&serde_json::to_value("No open contracts avaliable").unwrap())
            }
        };


        // Solutions, submitted by user 
        let self_ = self.clone();
        let submitted_contracts = move |req: &mut Request| -> IronResult<Response> {
            let path = req.url.path();
            let user_key = path.last().unwrap().clone();
            if let Some(contracts) = self_.get_cs_with_filter( 
                    &|tx: &serde_json::Value| {if tx["pub_key"] == user_key {true}
                                              else {false} }) {
                self_.ok_response(&serde_json::to_value(contracts).unwrap())
            } else {
                self_.not_found_response(&serde_json::to_value("No contracts submitted").unwrap())
            }
        };

        // Wallet info by wallet key
        let self_ = self.clone();
        let wallet_info = move |req: &mut Request| -> IronResult<Response> {
            let path = req.url.path();
            let wallet_key = path.last().unwrap();
            let public_key = PublicKey::from_hex(wallet_key).map_err(ApiError::FromHex)?;
            if let Some(wallet) = self_.get_wallet(&public_key) {
                self_.ok_response(&serde_json::to_value(wallet).unwrap())
            } else {
                self_.not_found_response(&serde_json::to_value("Wallet not found").unwrap())
            }
        };


        // Bind the transaction handler to a specific route.
        let route_post = "/v1/wallets/transaction";
        router.post(&route_post, tx_handler, "transaction");

        router.get("/v1/wallet/:pub_key", wallet_info, "wallet_info");

        router.get("v1/contracts/user/:pub_key", submitted_contracts, "contracts submitted by user");
        router.get("v1/contracts/open", open_contracts, "open contracts");
        router.get("v1/contracts/done", done_contracts, "done contracts");
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
            blockchain: ctx.blockchain().clone(),
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
    

    let database_options = LevelDBOptions {
        create_if_missing: true,
        error_if_exists: false,
        ..Default::default()
    };

    // Current state database
    //TODO: ERROR HANDLING
    let db = LevelDB::open("/Applications/database", database_options).unwrap();
    
    let services: Vec<Box<Service>> = vec![
        Box::new(CurrencyService),
    ];

    // Vlockchain initialisation
    let blockchain = Blockchain::new(Box::new(db), services);


    //---------------------------------------
   
    // File with the pack of personal node keys (Two pairs)
    println!("Enter node keyfile path:");
    let mut node_keys_path = String::new();
   
    stdin().read_line(&mut node_keys_path).expect("Error, mah dude");

    let n_k_p_len = node_keys_path.len();
    node_keys_path.truncate(n_k_p_len-1);

    //  File with keys of initial validator nodes

    //TODO: This is so fuckin dirty
    println!("Enter node validtor keys file path:");
    let mut validator_keys_path = String::new();
  
    stdin().read_line(&mut validator_keys_path).expect("Error, mah dude");
    
    let v_k_p_len = validator_keys_path.len();
    validator_keys_path = validator_keys_path;

    validator_keys_path.truncate(v_k_p_len-1);

    println!("\n..{}..\n", validator_keys_path);

    let n_k = File::open(node_keys_path).expect("No such file1, mah dude");
    let v_k = File::open(validator_keys_path).expect("No such file2, mah dude");


    let node_keys = BufReader::new(&n_k);
    let validator_keys = BufReader::new(&v_k);

    //TODO: add classy FP implementation
    let mut n_k_arr: Vec<String> = Vec::new();
    for line in node_keys.lines() {
        let l = line.unwrap();//.expect("Error, mah dude");
        n_k_arr.push(l);
    }

    //TODO: add classy FP implementation
    let mut v_k_arr: Vec<String> = Vec::new();
    for line in validator_keys.lines() {
        let l = line.unwrap();//.expect("Error, mah dude");
        v_k_arr.push(l);
    }

    let mut i = 0;
    let mut validator_keys: Vec<ValidatorKeys> = Vec::new();
    while i <= 0 {////////////
        let cons = PublicKey::from_hex(&v_k_arr[i]).expect("Error, mah dude");
        let serv =  PublicKey::from_hex(&v_k_arr[i+1]).expect("Error, mah dude");
        validator_keys.push(ValidatorKeys{consensus_key: cons, service_key: serv});
        i+=2;
    }


    //TODO : to dirty, my eyes hurt
    let consensus_public_key = PublicKey::from_hex(&n_k_arr[0]).expect("Error, mah dude");

    let consensus_secret_key = SecretKey::from_hex(&n_k_arr[1]).expect("Error, mah dude");

    let service_public_key = PublicKey::from_hex(&n_k_arr[2]).expect("Error, mah dude");

    let service_secret_key = SecretKey::from_hex(&n_k_arr[3]).expect("Error, mah dude");

    //--------------------------------------

    let consensus_config = ConsensusConfig {
        txs_block_limit: 1,
        ..Default::default()
    };

    // Root block of the blockchain
    let genesis = GenesisConfig::new_with_consensus(consensus_config, validator_keys.into_iter());

    
    // External port -- for api interactions
    let api_adress = "0.0.0.0:1488".parse().unwrap();
    let api_adress2 = "0.0.0.0:1489".parse().unwrap();
    
    let api_cfg = NodeApiConfig {
        public_api_address: Some(api_adress),
        private_api_address: Some(api_adress2),
        enable_blockchain_explorer: true,
        ..Default::default()
    };

    // Internal port -- for node-to-node interactions
    let peer_adress = "0.0.0.0:2069".parse().unwrap();
    let test_peer = "1.2.3.4:2069".parse().unwrap();

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