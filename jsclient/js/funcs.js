let baseGetUrl = 'http://127.0.0.1:1488/api/services/cryptocurrency/v1/'
let postUrl = 'http://127.0.0.1:1488/api/services/cryptocurrency/v1/wallets/transaction'

function genKeys() {
	let tmp = Exonum.keyPair();
	Cookies.set('secretKey', tmp.secretKey);
	Cookies.set('publicKey', tmp.publicKey);
	console.log('Keys generated and saved!');
}

function importKeys(keyPair) {
	Cookies.set('secretKey', keyPair.secretKey);
	Cookies.set('publicKey', keyPair.publicKey);
	console.log('Keys imported!')
}

function exportKeys() {
	secretKey = Cookies.get('secretKey');
	publicKey = Cookies.get('publicKey');

	let keyPair = {'secretKey': secretKey, 'publicKey': publicKey};
	console.log('Hey! Somebody exported your keys. It better were you!')
	return keyPair
}

function getOpenScholarships(callback) {
	$.getJSON(baseGetUrl + 'contracts/open', function(data) {
		console.log('Here are your contracts:');
		console.log(data);
		callback(data);
	});
}

function getSubmittedSolutions(callback) {
	$.getJSON(baseGetUrl + 'contracts/users/done', function(data) {
		console.log('Here are all submitted, yet still unreviewed contracts:');
		console.log(data);
		callback(data);
	});
}

function getApprovedSolutions(callback) {
	$.getJSON(baseGetUrl + 'contracts/admin/approved', function(data) {
		console.log('Here are all approved contracts:');
		console.log(data);
		callback(data);
	});
}

function getUserInfo(publicKey, callback) {
	$.get(baseGetUrl + 'wallet/:' + publicKey, function(data) {
		console.log('Info about this user (' + publicKey + '):');
		console.log(data);
		callback(data);
	});
}

function getUserContracts(publicKey, callback) {
	$.getJSON(baseGetUrl + 'contracts/users/sent_by_user/:' + publicKey, function(data) {
		console.log('Here are all contracts sent by this user (' + publicKey + '):');
		console.log(data);
		callback(data);
	});
}

function createWallet(keys, name) {
	let msg = TxCreateWalletJSON(keys, name);

	if (typeof msg !== 'undefined') {
		$.ajax({
		    url: postUrl,
		    type: "POST",
		    data: JSON.stringify(msg),
		    dataType: "json"
		});
	}
}

function addContract(keys, reward, task_info) {
	let msg = setup(keys, reward, task_info);

	if (typeof msg !== 'undefined') {
		$.ajax({
		    url: postUrl,
		    type: "POST",
		    data: JSON.stringify(msg),
		    dataType: "json"
		});
	}
}

function submitSolution(keys, signer_info, block) {
	return;
}

function voteForContract() {
	return;
}

function acquireContract(keys, acquire_status, block) {
	return;
}



