console.log('contracts');
$.get( "http://127.0.0.1:8000/test.json", function( data ) {
  console.log(1);
  console.log(data);
  let a;
  a=0
  data.forEach(function(item, i, arr) {

  //a = parseInt($("#contracts").find("tr").last().find('td').first().text())+1;
  a++;
  a=a+'';
  console.log(a)
  $('#contracts tr:last').after('<tr><td>'+a+'</td><td>'+item.name+'</td><td>'+item.discription+'</td><td>'+item.price+'</td><td><button type="button" class="btn btn-success btn-md show" id="go" cname='+item.name+'>Отправить решение</button> </td></tr>')

});

});
