console.log('contracts');
$.get( "test.json", function( data ) {
  global tmp;
  tmp=data;
  alert( "Load was performed." );
},function(data){alert( "ne zagruzilo." )},'json');
