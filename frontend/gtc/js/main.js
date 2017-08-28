//function genKey(){
 //let tmp =Exonum.keyPair()
//

//}
//Cookies.set('publicKey', "02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1");
//Cookies.set('secretKey', "6ba5966eddacd09563868ea0ac21f9efdb82e6c86ce0a252d02d0f62c026ae6a02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1");
console.log(Cookies.get());
$(document).ready(function() { // вся мaгия пoсле зaгрузки стрaницы
    $('button#newContract').click( function(event){
        console.log('ffff');
        var tmp=setup(Cookies.get(),$('#prCoast').val() ,$('#prName').val());
        console.log(tmp);
        var kk='{  "body":    "reward":"100",    "task_info":"123",    "pub_key":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",    "signer_info":"",    "vote_status":"0"  },  "network_id":0,  "protocol_version":0,  "service_id":1,  "message_id":0,  "signature":"92d593f6d514b533fab01dd3c5ac2d590474674c4d2880c8fb02bee6d58a26e34315abc5e79d634cec6f34b5e216614a11a65d86708a3ac4bff537fca1c9c20e"}'
        if(tmp!=undefined){
            console.log('zap');
        }
      //эта штука шлёт запрос на создание контракта, ваш json это data
      sendData(data);
    });
});
