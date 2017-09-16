let baseGetUrl = 'http://127.0.0.1:1488/api/services/cryptocurrency/v1/';
let postUrl = 'http://127.0.0.1:1488/api/services/cryptocurrency/v1/wallets/transaction';

function checkStorage() {
    "use strict";

    return !(typeof Storage === typeof undefined);
}

function checkStatus(response) {
    "use strict";

    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    "use strict";

    return response.json();
}

function parseText(response) {
    "use strict";

    return response.text();
}

function findTxByHash(txs, hash) {
    "use strict";

    return txs.filter(function(x) {
        return x.signature === hash;
    })[0];
}

function genKeys() {
    "use strict";

    let tmp = Exonum.keyPair();
    localStorage.setItem('secretKey', tmp.secretKey);
    localStorage.setItem('publicKey', tmp.publicKey);

    console.log('Keys generated and saved!');
}

function importKeys(keyPair) {
    "use strict";

    localStorage.setItem('secretKey', keyPair.secretKey);
    localStorage.setItem('publicKey', keyPair.publicKey);
    console.log('Keys imported!');
}

function exportKeys() {
    "use strict";

    let secretKey = localStorage.getItem('secretKey');
    let publicKey = localStorage.getItem('publicKey');
    let keyPair = {secretKey: secretKey, publicKey: publicKey};
    console.log('Hey! Somebody exported your keys. It better were you!');

    return keyPair;
}

function getOpenScholarships() {
    "use strict";

    return fetch(baseGetUrl + 'contracts/open')
            .then(checkStatus)
            .then(parseJSON);
}

function getSubmittedSolutions() {
    "use strict";

    return fetch(baseGetUrl + 'contracts/users/done')
            .then(checkStatus)
            .then(parseJSON);
}

function getApprovedSolutions() {
    "use strict";

    return fetch(baseGetUrl + 'contracts/admin/approved')
            .then(checkStatus)
            .then(parseJSON);
}

function getUserInfo(publicKey) {
    "use strict";

    fetch(baseGetUrl + 'wallet/' + publicKey)
            .then(checkStatus)
            .then(parseText);
}

function getUserContracts(publicKey) {
    "use strict";

    return fetch(baseGetUrl + 'contracts/users/sent_by_user/' + publicKey)
            .then(checkStatus)
            .then(parseJSON);
}

function sendTx(msg) {
    if (typeof msg !== typeof undefined) {
        fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msg)
        });
    }
}

function createWallet(keys, name) {
    "use strict";

    let msg = TxCreateWalletJSON(keys, name);
    sendTx(msg);
}

function addContract(keys, reward, task_info) {
    "use strict";

    let msg = setup(keys, reward, task_info);
    sendTx(msg);
}

function submitSolution(keys, signer_info, block) {
    "use strict";

    let msg = assign(keys, signer_info, block);
    sendTx(msg);
}

function voteForContract() {
    "use strict";

    let msg = vote(keys, vote_status, block);
    sendTx(msg);
}

function acquireContract(keys, acquire_status, block) {
    "use strict";

    let msg = acquire(keys, acquire_status, block);
    sendTx(msg);
}