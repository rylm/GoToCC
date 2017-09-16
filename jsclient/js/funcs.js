"use strict";

const baseGetUrl = 'http://127.0.0.1:1488/api/services/cryptocurrency/v1/';
const postUrl = 'http://127.0.0.1:1488/api/services/cryptocurrency/v1/walconsts/transaction';

function checkStorage() {
    return !(typeof Storage === typeof undefined);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}

function parseText(response) {
    return response.text();
}

function findTxByHash(txs, hash) {
    return txs.filter(function(x) {
        return x.signature === hash;
    })[0];
}

function genKeys() {
    const tmp = Exonum.keyPair();
    localStorage.setItem('secretKey', tmp.secretKey);
    localStorage.setItem('publicKey', tmp.publicKey);

    console.log('Keys generated and saved!');
}

function importKeys(keyPair) {
    localStorage.setItem('secretKey', keyPair.secretKey);
    localStorage.setItem('publicKey', keyPair.publicKey);
    console.log('Keys imported!');
}

function exportKeys() {
    const secretKey = localStorage.getItem('secretKey');
    const publicKey = localStorage.getItem('publicKey');
    const keyPair = {secretKey: secretKey, publicKey: publicKey};
    console.log('Hey! Somebody exported your keys. It better were you!');

    return keyPair;
}

const mkGet = url => fetch(baseGetUrl + url)
                      .then(checkStatus)
                      .then(parseJSON);

const getOpenScholarships = () => mkGet('contracts/open');

const getSubmittedSolutions = () => mkGet('contracts/users/done');

const getApprovedSolutions = () => mkGet('contracts/admin/approved');

function getUserInfo(publicKey) {
    fetch(baseGetUrl + 'walconst/' + publicKey)
            .then(checkStatus)
            .then(parseText);
}

function getUserContracts(publicKey) {
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

function createWalconst(keys, name) {
    const msg = TxCreateWalconstJSON(keys, name);
    sendTx(msg);
}

function addContract(keys, reward, task_info) {
    const msg = setup(keys, reward, task_info);
    sendTx(msg);
}

function submitSolution(keys, signer_info, block) {
    const msg = assign(keys, signer_info, block);
    sendTx(msg);
}

function voteForContract() {
    const msg = vote(keys, vote_status, block);
    sendTx(msg);
}

function acquireContract(keys, acquire_status, block) {
    const msg = acquire(keys, acquire_status, block);
    sendTx(msg);
}