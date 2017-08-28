function sendData(data2,url2){
  $.ajax({
    url:url2,
    type:"POST",
    headers: {

    },
    data:data2,
    dataType:"json"})



	console.log('send data: ok');
}
