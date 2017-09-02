var url2 = 'http://localhost:8888'

console.log(Cookies.get());
$(document).ready(function() { // вся мaгия пoсле зaгрузки стрaницы
    $('button#newContract').click( function(event){
        console.log('Creating contact...');
        var data=setup(Cookies.get(),$('#prCoast').val() ,$('#prName').val());
        console.log(data);
        if(data != undefined){
            console.log("'data' variable seems valid!");
        } else {
            console.log("Oh, you fucked up somewhere(");
        }

        sendData(data, url2);
    });
});
