#[macro_use] extern crate exonum;

use std::fs::File;
use std::io::prelude::*;

use exonum::crypto::HexValue;
use exonum::crypto::gen_keypair;

fn main () {

    let mut validator_pub_keys = File::create("validator_pub_keys").unwrap();

    for i in 1..4 {
        let (consensus_public_key, consensus_secret_key) =
        exonum::crypto::gen_keypair();
        let (service_public_key, service_secret_key) =
            exonum::crypto::gen_keypair();

        let mut key_dump = File::create(format!("keys{}", i)).unwrap();

        let pub_keys = [consensus_public_key, 
                        service_public_key];
        let priv_keys = [consensus_secret_key,
                         service_secret_key];

        for i in 0..2 {
            // key_dump.write_all_(format!("{}\n{}\n", pub_keys[i].to_hex(), priv_keys[i].to_hex()));
            write!(key_dump, "{}\n{}\n", pub_keys[i].to_hex(), priv_keys[i].to_hex());
            write!(validator_pub_keys, "{}\n", pub_keys[i].to_hex());
        }
    }
}
 