function TxCreateWalletJSON(keys, name) {
    "use strict";

    var TxCreateWalletT = Exonum.newType({
        size: 40,
        fields: {
            pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
            name: {type: Exonum.String, size: 8, from: 32, to: 40}
        }
    });

    var keyPair = keys;

    var data = {
        pub_key: keyPair.publicKey,
        name: name
    };

    var signature = Exonum.sign(keyPair.secretKey, data, TxCreateWalletT);

    var wallet = Exonum.newMessage({
        size: 40,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 1,
        signature: signature,
        fields: {
            pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
            name: {type: Exonum.String, size: 8, from: 32, to: 40}
        }
    });

    var signature2 = wallet.sign(keyPair.secretKey, data);

    return {
        "body": {
            "pub_key": data.pub_key,
            "name": data.name
        },
        "network_id": 0,
        "protocol_version": 0,
        "service_id": 1,
        "message_id": 1,
        "signature": signature2
    };

}

function setup(keys, reward, task_info) {
    "use strict";

    var keyPair = keys;

    if (keyPair.publicKey === "02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1") {
        var TxFullScholarshipT = Exonum.newType({
            size: 72,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
        });

        var dpk = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

        var data = {
            reward: reward,
            task_info: task_info,
            pub_key: dpk,
            signer_info: ' ',
            vote_status: 0,
            acquire_status: 0
        };

        var signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

        var fullScholarship = Exonum.newMessage({
            size: 72,
            network_id: 0,
            protocol_version: 0,
            service_id: 1,
            message_id: 0,
            signature: signature,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
        });

        var signature2 = fullScholarship.sign(keyPair.secretKey, data);

        return {
            "body": {
                "reward": reward + '',
                "task_info": task_info,
                "pub_key": dpk,
                "signer_info": ' ',
                "vote_status": 0 + '',
                "acquire_status": 0 + ''
            },
            "network_id": 0,
            "protocol_version": 0,
            "service_id": 1,
            "message_id": 0,
            "signature": signature2
        };

    }
}

function assign(keys, signer_info, block) {
    "use strict";

    var keyPair = keys;

    var TxFullScholarshipT = Exonum.newType({
            size: 72,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
    });

    var data = {
        reward: block.reward,
        task_info: block.task_info,
        pub_key: keyPair.publicKey,
        signer_info: signer_info,
        vote_status: 0,
        acquire_status: 0
    };

    var signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

    var fullScholarship = Exonum.newMessage({
        size: 72,
        network_id: 0,
        protocol_version: 0,
        service_id: 1,
        message_id: 0,
        signature: signature,
        fields: {
            reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
            task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
            pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
            signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
            vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
            acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
        }
    });

    var signature2 = fullScholarship.sign(keyPair.secretKey, data);

    return {
        "body": {
            "reward": block.reward + '',
            "task_info": block.task_info,
            "pub_key": keyPair.publicKey,
            "signer_info": signer_info,
            "vote_status": 0 + '',
            "acquire_status": 0 + ''
        },
        "network_id": 0,
        "protocol_version": 0,
        "service_id": 1,
        "message_id": 0,
        "signature": signature2
    };
}

function vote(keys, vote_status, block) {
    "use strict";

    var keyPair = keys;

    if (keyPair.publicKey === '02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1') {
        var TxFullScholarshipT = Exonum.newType({
            size: 72,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
        });

        var data = {
            reward: block.reward,
            task_info: block.task_info,
            pub_key: keyPair.publicKey,
            signer_info: block.signer_info,
            vote_status: vote_status,
            acquire_status: 0
        };

        var signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

        var fullScholarship = Exonum.newMessage({
            size: 72,
            network_id: 0,
            protocol_version: 0,
            service_id: 1,
            message_id: 0,
            signature: signature,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
        });

        var signature2 = fullScholarship.sign(keyPair.secretKey, data);

        return {
            "body": {
                "reward": block.reward + '',
                "task_info": block.task_info,
                "pub_key": keyPair.publicKey,
                "signer_info": block.signer_info,
                "vote_status": vote_status + '',
                "acquire_status": 0 + ''
            },
            "network_id": 0,
            "protocol_version": 0,
            "service_id": 1,
            "message_id": 0,
            "signature": signature2
        };

    }
}

function acquire(keys, acquire_status, block) {
    "use strict";

    var keyPair = keys;

    if (keyPair.publicKey === block.pub_key) {
        var TxFullScholarshipT = Exonum.newType({
            size: 72,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
        });

        var data = {
            reward: block.reward,
            task_info: block.task_info,
            pub_key: keyPair.publicKey,
            signer_info: block.signer_info,
            vote_status: vote_status,
            acquire_status: acquire_status
        };

        var signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

        var fullScholarship = Exonum.newMessage({
            size: 72,
            network_id: 0,
            protocol_version: 0,
            service_id: 1,
            message_id: 0,
            signature: signature,
            fields: {
                reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
                task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
                pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
                signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
                vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64},
                acquire_status: {type: Exonum.Int64, size: 8, from: 64, to: 72}
            }
        });

        var signature2 = fullScholarship.sign(keyPair.secretKey, data);

        return {
            "body": {
                "reward": block.reward + '',
                "task_info": block.task_info,
                "pub_key": keyPair.publicKey,
                "signer_info": block.signer_info,
                "vote_status": vote_status + '',
                "acquire_status": acquire_status + ''
            },
            "network_id": 0,
            "protocol_version": 0,
            "service_id": 1,
            "message_id": 0,
            "signature": signature2
        };

    }
}