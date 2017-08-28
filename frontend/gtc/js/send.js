function sendData(data2){
  $.ajax({
    url:"http://google.com",
    type:"POST",
    headers: {

    },
    data:data2,
    dataType:"json"})



console.log('send data: ok');

}
