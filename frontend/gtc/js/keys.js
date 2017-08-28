$(document).ready(function() {
	$('button#ExBut').click( function(event){

		console.log('Cookies sets');
		$('#pubk').val(Cookies.get('secretKey'));
    $('#privk').val(Cookies.get('publicKey'));

	});

  $('button#ImpBut').click( function(event){
    Cookies.set('secretKey',$('#pubk').val());
    Cookies.set('publicKey',$('#privk').val());
    console.log('Cookies sets');
    alert('Ключи импортированы');
  });
  $('button#GenBut').click( function(event){
    let tmp;
    tmp=Exonum.keyPair();
    Cookies.set('secretKey',tmp.secretKey);
    Cookies.set('publicKey',tmp.publicKey);
    console.log('Cookies sets');
    alert('Ключи Сгенерированы');
  });
});
