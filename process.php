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

	if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == "POST" && !empty($_POST)) {
		$checkCapcha = false;
        $recaptcha = $_POST['g-recaptcha-response'];
        $checkCapcha = check_recaptcha($recaptcha);
        if($checkCapcha){
        	echo $_POST['textmsg']; exit;
        	/***
        		Perform Actions Here (Add,Update,Delete etc) 
        	**/
        }else{
			echo “reCaptcha Error”;
		}
	}
	echo "failed";exit;


?>
