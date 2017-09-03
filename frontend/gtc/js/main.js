var url2 = 'http://localhost:8888/api/services/cryptocurrency/v1/wallets/transaction'

console.log(Cookies.get());
$(document).ready(function() { // вся мaгия пoсле зaгрузки стрaницы
    $('button#newContract').click( function(event){
        console.log('Creating contract...');
        var data=setup(Cookies.get(),$('#prCoast').val() ,$('#prName').val());
        console.log(JSON.stringify(data));
        if(data != undefined){
            console.log("'data' variable seems valid!");
        } else {
            console.log("Oh, you fucked up somewhere(");
        }

        sendData(JSON.stringify(data), url2);
    });
});