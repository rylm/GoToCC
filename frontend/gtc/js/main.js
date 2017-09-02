//function genKey(){
 //let tmp =Exonum.keyPair()
//

//}
//Cookies.set('publicKey', "02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1");
//Cookies.set('secretKey', "6ba5966eddacd09563868ea0ac21f9efdb82e6c86ce0a252d02d0f62c026ae6a02b9c6561322f68d2cf973e8d544d91716bf0b04874914f31dcde6de99c5c9a1");

var url2 = 'http://localhost:1488'

console.log(Cookies.get());
$(document).ready(function() { // вся мaгия пoсле зaгрузки стрaницы
    $('button#newContract').click( function(event){
        console.log('ffff');
        var tmp=setup(Cookies.get(),$('#prCoast').val() ,$('#prName').val());
        console.log(tmp);
        if(tmp!=undefined){
            console.log('zap');
        }
      //эта штука шлёт запрос на создание контракта, ваш json это data
      sendData(data, url2);
    });
});
