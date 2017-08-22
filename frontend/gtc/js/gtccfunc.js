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

function TxFullScholarshipJSON(keys, reward, task_info, signer_info, vote_status) {
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

	var keyPair = keys;

	var data = {
		reward: reward,
		task_info: task_info,
		pub_key: keyPair.publicKey,
		signer_info: signer_info, 
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
	    "reward": reward,
	    "task_info": task_info,
	    "pub_key": keyPair.publicKey,
	    "signer_info": signer_info,
	    "vote_status": vote_status
	  	},
	  	"network_id": 0,
	  	"protocol_version": 0,
	  	"service_id": 1,
	  	"message_id": 0,
	  	"signature": signature2
	}

}

function TxSetUpScholarshipJSON(keys, reward, task_info) {
	var TxSetUpScholarshipT = Exonum.newType({
	    size: 16,
	    fields: {
	        reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
	        task_info: {type: Exonum.String, size: 8, from: 8, to: 16},
	    }
	});

	var keyPair = keys;

	var data = {
		reward: reward,
		task_info: task_info
	};

	signature = Exonum.sign(keyPair.secretKey, data, TxSetUpScholarshipT);

	setUpScholarship = Exonum.newMessage({
		size: 16,
		network_id: 0,
		protocol_version: 0,
		service_id: 1,
		message_id: 2,
		signature: signature,
		fields: {
	        reward: {type: Exonum.Int64, size: 8, from: 0, to: 8},
	        task_info: {type: Exonum.String, size: 8, from: 8, to: 16}
	    }
	});

	signature2 = setUpScholarship.sign(keyPair.secretKey, data);

	return {
		"body": {
	    "reward": reward,
	    "task_info": task_info
	  	},
	  	"network_id": 0,
	  	"protocol_version": 0,
	  	"service_id": 1,
	  	"message_id": 2,
	  	"signature": signature2
	}

}

function TxVoteForScholarshipJSON(keys, vote_status, msg_key) {
	var TxVoteForScholarshipT = Exonum.newType({
	    size: 40,
	    fields: {
	        vote_status: {type: Exonum.Int64, size: 8, from: 0, to: 8},
	        msg_key: {type: Exonum.PublicKey, size: 32, from: 8, to: 40}
	    }
	});

	var keyPair = keys;

	var data = {
		vote_status: vote_status,
		msg_key: msg_key
	};

	signature = Exonum.sign(keyPair.secretKey, data, TxVoteForScholarshipT);

	voteForScholarship = Exonum.newMessage({
		size: 40,
		network_id: 0,
		protocol_version: 0,
		service_id: 1,
		message_id: 3,
		signature: signature,
		fields: {
	        vote_status: {type: Exonum.Int64, size: 8, from: 0, to: 8},
	        msg_key: {type: Exonum.PublicKey, size: 32, from: 8, to: 40}
	    }
	});

	signature2 = voteForScholarship.sign(keyPair.secretKey, data);

	return {
		"body": {
	    "vote_status": vote_status,
	    "msg_key": msg_key
	  	},
	  	"network_id": 0,
	  	"protocol_version": 0,
	  	"service_id": 1,
	  	"message_id": 3,
	  	"signature": signature2
	}

}

function TxLookWhatIDidJSON(keys, signer_info, msg_key) {
	var TxLookWhatIDidT = Exonum.newType({
	    size: 72,
	    fields: {
	        pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
	        signer_info: {type: Exonum.String, size: 8, from: 32, to: 40},
	        msg_key: {type: Exonum.PublicKey, size: 32, from: 40, to: 72}
	    }
	});

	var keyPair = keys;

	var data = {
		pub_key: keyPair.publicKey,
		signer_info: signer_info,
		msg_key: msg_key
	};

	signature = Exonum.sign(keyPair.secretKey, data, TxLookWhatIDidT);

	setUpScholarship = Exonum.newMessage({
		size: 72,
		network_id: 0,
		protocol_version: 0,
		service_id: 1,
		message_id: 4,
		signature: signature,
		fields: {
	        pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
	        signer_info: {type: Exonum.String, size: 8, from: 32, to: 40},
	        msg_key: {type: Exonum.PublicKey, size: 32, from: 40, to: 72}
	    }
	});

	signature2 = setUpScholarship.sign(keyPair.secretKey, data);

	return {
		"body": {
	    "pub_key": keyPair.publicKey,
	    "signer_info": signer_info,
	    "msg_key": msg_key
	  	},
	  	"network_id": 0,
	  	"protocol_version": 0,
	  	"service_id": 1,
	  	"message_id": 4,
	  	"signature": signature2
	}

}