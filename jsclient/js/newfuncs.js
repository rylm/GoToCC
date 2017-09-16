function TxCreateWalletJSON(keys, name) {
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
	}

	signature = Exonum.sign(keyPair.secretKey, data, TxCreateWalletT);

	wallet = Exonum.newMessage({
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

	signature2 = wallet.sign(keyPair.secretKey, data);

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
	}

}

function setup(keys, reward, task_info) {
	var keyPair = keys;

	if (keyPair.publicKey == "02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1") {
		var TxFullScholarshipT = Exonum.newType({
		    size: 64,
		    fields: {
		        reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
		        task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
		        pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
		        signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
		        vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64}
		    }
		});

		var dpk = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

		var data = {
			reward: reward,
			task_info: task_info,
			pub_key: dpk,
			signer_info: ' ',
			vote_status: 0
		};

		signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

		fullScholarship = Exonum.newMessage({
			size: 64,
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
		        vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64}
		    }
		});

		signature2 = fullScholarship.sign(keyPair.secretKey, data);

		return {
			"body": {
		    "reward": reward + '',
		    "task_info": task_info,
		    "pub_key": dpk,
		    "signer_info": ' ',
		    "vote_status": 0 + ''
		  	},
		  	"network_id": 0,
		  	"protocol_version": 0,
		  	"service_id": 1,
		  	"message_id": 0,
		  	"signature": signature2
		}

	}
}

function assign(keys, signer_info, block) {
	var TxFullScholarshipT = Exonum.newType({
		    size: 64,
		    fields: {
		        reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
		        task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
		        pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
		        signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
		        vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64}
		    }
		});

		var data = {
			reward: block.reward,
			task_info: block.task_info,
			pub_key: keyPair.publicKey,
			signer_info: signer_info,
			vote_status: 0
		};

		signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

		fullScholarship = Exonum.newMessage({
			size: 64,
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
		        vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64}
		    }
		});

		signature2 = fullScholarship.sign(keyPair.secretKey, data);

		return {
			"body": {
		    "reward": block.reward + '',
		    "task_info": block.task_info,
		    "pub_key": keyPair.publicKey,
		    "signer_info": signer_info,
		    "vote_status": 0 + ''
		  	},
		  	"network_id": 0,
		  	"protocol_version": 0,
		  	"service_id": 1,
		  	"message_id": 0,
		  	"signature": signature2
		}

}

function vote(keys, vote_status, block) {
	if (keyPair.publicKey == '02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1') {
		var TxFullScholarshipT = Exonum.newType({
		    size: 64,
		    fields: {
		        reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
		        task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
		        pub_key: {type: Exonum.PublicKey, size: 32, from: 16, to: 48},
		        signer_info: {type: Exonum.String, size: 8, from: 48, to: 56},
		        vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64}
		    }
		});

		var data = {
			reward: block.reward,
			task_info: block.task_info,
			pub_key: keyPair.publicKey,
			signer_info: block.signer_info,
			vote_status: vote_status
		};

		signature = Exonum.sign(keyPair.secretKey, data, TxFullScholarshipT);

		fullScholarship = Exonum.newMessage({
			size: 64,
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
		        vote_status: {type: Exonum.Int64, size: 8, from: 56, to: 64}
		    }
		});

		signature2 = fullScholarship.sign(keyPair.secretKey, data);

		return {
			"body": {
		    "reward": block.reward + '',
		    "task_info": block.task_info,
		    "pub_key": keyPair.publicKey,
		    "signer_info": block.signer_info,
		    "vote_status": vote_status + ''
		  	},
		  	"network_id": 0,
		  	"protocol_version": 0,
		  	"service_id": 1,
		  	"message_id": 0,
		  	"signature": signature2
		}

	}
}
