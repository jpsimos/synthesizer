<?php
	/* Author Jacob Psimos 2017 */

	function failAndExit($exception, $exitCode = 0){
		echo json_encode(array('success' => FALSE, 'exception' => $exception));
		exit($exitCode);
	}

	function successAndExit(array $mergeArray = array()){
		$result = array('success' => TRUE);
		foreach($mergeArray as $key => $value){
			$result[$key] = $value;
		}
		echo json_encode($result);
		exit(0);
	}

	/*
		Cleans up any non-numeric chars from a phone number string
		Returns a global phone number in the format '+12223334444'
		FALSE for invalid input
	*/
	function polishPhoneNumber($str){
		if($str[0] == '+' && $str[1] == '1' && strlen($str)== 12){
			return $str;
		}

		$stripped = preg_replace('/[^0-9]/', '', $str);
		$result = "+1$stripped";
		$len = strlen($result);
		if($len == 12){
			return $result;
		}
		return FALSE;
	}

	function isPhoneNumber($str){
		$length = strlen($str);
		if($length != 12 || $str[0] != '+'){ return FALSE; }
		for($i = 1; $i < $length; $i++){
			if(!is_numeric($str[$i])){
				return FALSE;
			}
		}
		return TRUE;
	}

	/*
		alphanum(string, [b]spaces)
		Removes all non-alphanumeric characters from a string
		Optionally allows spaces (default true)
	*/
	function alphanum($str, $spaces = FALSE){
		return !$spaces ? preg_replace('/[^0-9a-zA-Z]/', '', $str)
			: preg_replace('/[^0-9a-zA-Z ]/', '', $str);
	}

	/*
		allnum(string)
		Filters out all non-numeric characters
	*/
	function allnum($str){
		return preg_replace('/[^0-9]/', '', $str);
	}

	/*
		is_alphanum(string, [b]spaces)
		Returns boolean with respect to all of the characters in the string
		being alphanumeric.  Optionally allows spaces.
	*/
	function is_alphanum($str, $spaces = TRUE){
		$len = strlen($str);
		for($i = 0; $i < $len; $i++){
			$ascii = ord($i);
			//Numbers [48-57];
			//Lower Case [97-122]
			//Upper Case [65-90]
			//Space [32]

			$numeric = ($ascii >= 48 && $ascii <= 57);
			$alpha = ($ascii >= 97 && $ascii <= 122) || ($ascii >= 65 && $ascii <= 90);

			if(!$numeric && !$alpha){
				//Space?
				if($ascii == 32 && $spaces){ continue; }
				return FALSE;
			}
		}
		return TRUE;
	}

	/*
		despace(sring, [b]multi)
		Replaces MULTIPLE spaces with a single space
	*/
	function despace($str){
		return preg_replace('/\s+/', ' ', trim($str));
	}

	function ldate(){
		date_default_timezone_set("America/New_York");
		return date("m/d/Y g:i:s A");
	}

	/***
		Replaces any emoji in a string with the string literal [Emoji]
		Acknowledgement::This function was made possible because of
		the Github User<https://gist.github.com/hnq90> and his publicaly
		available PHP script 'CheckEmoji.php'
	*/
	function emojisToText($string){
		$regexEmoticons = '/[\x{1F600}-\x{1F64F}]/u';
		$regexSymbols = '/[\x{1F300}-\x{1F5FF}]/u';
		$regexTransport = '/[\x{1F680}-\x{1F6FF}]/u';
		$regexMisc = '/[\x{2600}-\x{26FF}]/u';
		$regexDingbats = '/[\x{2700}-\x{27BF}]/u';

		$string = preg_replace($regexEmoticons, "[Emoji]", $string);
		$string = preg_replace($regexSymbols, "[Emoji]", $string);
		$string = preg_replace($regexTransport, '', $string);
		$string = preg_replace($regexMisc, '', $string);
		$string = preg_replace($regexDingbats, '',  $string);
		return $string;
	}


?>
