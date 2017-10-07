
function formSubmit(form){
	var text = $.trim($('#text'+form).val());
	if(text != ''){
		switch(form){
			case '1' : grecaptcha.execute(widget_1); break;
			case '2' : grecaptcha.execute(widget_2); break;
			case '3' : grecaptcha.execute(widget_3); break;
		}
		
	}

}

function saveData(form){
	$.ajax( {
      type: 'POST',
      url:  $("#form"+form).attr( 'action' ),
      data: $("#form"+form).serialize(),
      success: function( response ) {
        alert( "Your msg "+response+" has been successfully saved.");
        $('#text'+form).val('');
        switch(form){
			case '1' : grecaptcha.reset(widget_1); break;
			case '2' : grecaptcha.reset(widget_2); break;
			case '3' : grecaptcha.reset(widget_3); break;
		}
      }
    } );

}
