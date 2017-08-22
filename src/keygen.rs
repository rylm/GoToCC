#[macro_use] extern crate exonum;
use exonum::crypto::Signature;


fn main() {
    let name = "Alena Ilyina";
    let (public_key, secret_key) = crypto::gen_keypair();


    let signature = crypto::sign(&name, &secret_key);

    println!("{:?}", signature);
}
