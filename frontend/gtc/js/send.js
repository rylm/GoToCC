function sendData(data2){
  $.ajax({
    url:"http://127.0.0.1:1488/api/services/cryptocurrency/v1/wallets/transaction",
    type:"POST",
    headers: {

    },
    data:data2,
    dataType:"json"})



	console.log('send data: ok');
}
