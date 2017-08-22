console.log('contracts');
$.get( "http://127.0.0.1:3000/test.json", function( data ) {
  console.log(1);
  console.log(data);
  data.forEach(function(item, i, arr) {
  let a;
  a = parseInt($("#contracts").find("tr").last().find('td').first().text())+1;
  a=''+a;
  console.log(a)
  $('#contracts tr:last').after('<tr><td>'+a+'</td><td>'+item.name+'</td><td>'+item.discription+'</td><td>'+item.price+'</td><td><button type="button" class="btn btn-success btn-md show" id="go">Отправить решение</button> </td></tr>')

});
  
});
