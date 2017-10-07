/***
 * @Created by: Prathamesh Sawant (prathameshsandeepsawant@gmail.com)
 * @Date : 24/07/2017
 * @description To handle Multiple Google Invisible reCaptcha Implementation
 */  

 /**************************************************************************\
 * Step 1 - Initialize reCaptcha Site Key and Widget eg: widget_1 for Form 1
 * Step 2 - In init function add code to create form submit callback action.
 * Step 3 - Call renderInvisibleReCaptcha function by passing reCaptcha ID 
 *          and createCallbackFn Response.
 ***************************************************************************/

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
						    "theme"		: "light",
						    'size'		: 'invisible',
						    'badge'		: 'inline',
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
