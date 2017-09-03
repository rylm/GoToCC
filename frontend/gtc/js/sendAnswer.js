$(document).ready(function() {
	$('button#SendBut').click( function(event){
		name=Cookies.get('cname');// название контракта
		console.log('Cookie sets');
		let data=''; //ваш json
		sendData(data);

	});
});
