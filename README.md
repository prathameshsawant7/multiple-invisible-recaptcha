# Multiple Invisible reCaptcha V2 on Single Page

# Step 1>

Add below 2 Js library on page

```javascript
<!--  reCaptcha Library -->
<script type="text/javascript" src="https://www.google.com/recaptcha/api.js?render=explicit"></script>

<!--  Customized Init for invisible reCaptcha  -->
<script src="js/init_recaptcha.js" async defer></script>
```

# Step 2>

Add below div's in respective forms.
```html
<div id="recaptcha-form-1" style="display:none;"></div> <!--for Form 1-->
<div id="recaptcha-form-2" style="display:none;"></div> <!--for Form 2-->
<div id="recaptcha-form-3" style="display:none;"></div> <!--for Form 3-->
```

# Step 3> 

Create init_recaptcha.js

 * Step 1 - Initialize reCaptcha Site Key and Widget eg: widget_1 for Form 1
 * Step 2 - In init function add code to create form submit callback action.
 * Step 3 - Call renderInvisibleReCaptcha function by passing reCaptcha ID 
           and createCallbackFn Response.

 ```javascript
"use strict";

var PS = PS || {};
var widget_1;var widget_2;var widget_3;
var recaptcha_site_key = 'RECAPTCHA_SITE_KEY';

if( typeof PS.RECAPTCHA === 'undefined' ) {
	(function (a, $) {
		var retryTime = 300;
		var x = {
			init: function(){
				if(typeof grecaptcha != 'undefined'){

					//For Form 1 Initialization
					if($('#form1 #recaptcha-form-1').length > 0){
						var callbackFn = {
						    action : function(){
						    	saveData('1'); //Here Callback Function
						  	}
						}
						/*--- 'recaptcha-form-1' - reCaptcha div ID | 'form1' - Form ID ---*/
						widget_1 = x.renderInvisibleReCaptcha('recaptcha-form-1',x.createCallbackFn(widget_1,'form1',callbackFn));
		            }

		                                   //For Form 2 Initialization
					if($('#form2 #recaptcha-form-2').length > 0){
						var callbackFn = {
						    action : function(){
						    	saveData('2'); //Here Callback Function
						  	}
						}
						/*--- 'recaptcha-form-2' - reCaptcha div ID | 'form2' - Form ID ---*/
						widget_2 = x.renderInvisibleReCaptcha('recaptcha-form-2',x.createCallbackFn(widget_2,'form2',callbackFn));
		            }

		                                    //For Form 3 Initialization
					if($('#form3 #recaptcha-form-3').length > 0){
						var callbackFn = {
						    action : function(){
						    	saveData('3'); //Here Callback Function
						  	}
						}
						/*--- 'recaptcha-form-3' - reCaptcha div ID | 'form3' - Form ID ---*/
						widget_3 = x.renderInvisibleReCaptcha('recaptcha-form-3',x.createCallbackFn(widget_3,'form3',callbackFn));
		            }

				}else{
					setTimeout(function(){ x.init();} , retryTime);
				}
			},
			renderInvisibleReCaptcha: function(recaptchaID,callbackFunction){
					return grecaptcha.render(recaptchaID, {
						    'sitekey' 	: recaptcha_site_key,
						    "theme"	: "light",
						    'size'		: 'invisible',
						    'badge'	: 'inline',
						    'callback' 	: callbackFunction
						});
			},
			createCallbackFn: function (widget,formID,callbackFn) {
				return function(token) {
	                $('#'+formID+' .g-recaptcha-response').val(token);
	                if($.trim(token) == ''){
                		grecaptcha.reset(widget);
                	}else{
                		callbackFn.action();
                	}
                }
			}
		}
		a.RECAPTCHA = x;
	})( PS, $ );
}

$(window).load(function(){
	PS.RECAPTCHA.init();
});
```

# Step 4>
Changes in Form Validation JS - 
```javascript
/* Execute respective Widget on form submit after form Validations  */
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
```

# Step 5>
Validate reCaptcha from Server Side - 
```php
<?php
	define('RECAPTCHA_SECRET_KEY','KEY');
	/**
	*  @Desc:   To Validate invisible recaptcha from server-side
	*  @Param:  g-recaptcha-response value
   	*  @Return: True/False
	**/
	if(!function_exists('check_recaptcha')){
	    function check_recaptcha($recaptcha_response){
	        $test = array ('secret' => RECAPTCHA_SECRET_KEY,'remoteip' => $_SERVER["REMOTE_ADDR"],'response' => $recaptcha_response);
	        foreach ($test as $key => $value) {
	            $req .= $key . '=' . urlencode(stripslashes($value)) . '&';
	        }
	        $req=substr($req, 0, strlen($req)-1);
	        $path = 'https://www.google.com/recaptcha/api/siteverify?';
	        $response = file_get_contents($path . $req);
	        $responseData = json_decode($response);
	        if($responseData->success){
	            return true;            
	        }else{
	            return false;
	        }
	    }
	}
	
	// Validate reCaptcha
	if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == "POST" && !empty($_POST)) {
		$checkCapcha = false;
       		$recaptcha = $_POST['g-recaptcha-response'];
        		$checkCapcha = check_recaptcha($recaptcha);
        		if($checkCapcha){
        			echo $_POST['textmsg']; exit;
        			/** Perform Actions Here (Add,Update,Delete etc) 
**/
        		}
    else{
			echo “reCaptcha Error”;
		}
	}
	echo "failed";exit;
?>
```

# Step 6>
Reset Widget after Server Call - 
```javascript
// saveData will be automatically get called on grecaptacha.execute 
function saveData(form){
$.ajax( {
    type: 'POST',
    url:  $("#form"+form).attr( 'action' ),
    data: $("#form"+form).serialize(),
    success: function( response ) {
        		switch(form){
			case '1' : grecaptcha.reset(widget_1); break;
			case '2' : grecaptcha.reset(widget_2); break;
			case '3' : grecaptcha.reset(widget_3); break;
			}
    	}
    } );
}
```