function setup(keys, reward, task_info) {
	var keyPair = keys;

	if (keyPair.publicKey == '9cd129929c2b5afb7f7e7320ce289e26ae9020e9a03a44b88095b5798632e6b1') {
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

		var dpk = ['0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF'];

		var data = {
			reward: reward,
			task_info: task_info,
			pub_key: dpk,
			signer_info: '', 
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
		    "reward": reward,
		    "task_info": task_info,
		    "pub_key": dpk,
		    "signer_info": '',
		    "vote_status": 0
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
		    "reward": block.reward,
		    "task_info": block.task_info,
		    "pub_key": keyPair.publicKey,
		    "signer_info": signer_info,
		    "vote_status": 0
		  	},
		  	"network_id": 0,
		  	"protocol_version": 0,
		  	"service_id": 1,
		  	"message_id": 0,
		  	"signature": signature2
		}

}

function vote(keys, block, vote_status) {
	if (keyPair.publicKey == '9cd129929c2b5afb7f7e7320ce289e26ae9020e9a03a44b88095b5798632e6b1') {
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
		    "reward": block.reward,
		    "task_info": block.task_info,
		    "pub_key": keyPair.publicKey,
		    "signer_info": block.signer_info,
		    "vote_status": vote_status
		  	},
		  	"network_id": 0,
		  	"protocol_version": 0,
		  	"service_id": 1,
		  	"message_id": 0,
		  	"signature": signature2
		}

	}
}

function testCreateScholarship(keys, reward, task_info) {
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
			reward: reward,
			task_info: task_info,
			pub_key: keys.publicKey,
			signer_info: '', 
			vote_status: 0
	};

	signature = Exonum.sign(keys.secretKey, data, TxFullScholarshipT);

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

	signature2 = fullScholarship.sign(keys.secretKey, data);

	return {
		"body": {
	    "reward": reward,
	    "task_info": task_info,
	    "pub_key": keys.publicKey,
	    "signer_info": '',
	    "vote_status": 0
	  	},
	  	"network_id": 0,
	  	"protocol_version": 0,
	  	"service_id": 1,
	  	"message_id": 0,
	  	"signature": signature2
	}

}