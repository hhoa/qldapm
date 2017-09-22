jQuery( document ).ready(function() {

	$(document).on('click', '.btn-toggle', function() {
        if($('.nav-menu').css('display') == 'none'){
            $('.nav-menu').slideDown(200);
        } else {
            $('.nav-menu').slideUp(200);
        }
	});

	$(document).on("click", ".icon-sidenav", function() {
		if($('#adminSide').hasClass('responsive')){
			//$('#adminSide').removeClass('responsive');
		} else {
			$('#adminSide').addClass('responsive');
		}
	});

	$(document).on("click", ".closebtn", function() {
		if($('#adminSide').hasClass('responsive')){
			$('#adminSide').removeClass('responsive');
			//$('#adminSide').addClass('closenav');
		}
	});

});