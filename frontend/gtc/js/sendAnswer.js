$(document).ready(function() {
	$('button#SendBut').click( function(event){
		name=Cookies.get('cname');// название контракта
		console.log('Cookies sets');
		let data;
		data=''; //ваш json
		sendData(data)

	});


});
