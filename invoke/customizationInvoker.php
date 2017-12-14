<?php
	//Jacob Psimos 2017
	
	require_once('../include/SqliteObject.php');
	ini_set('error_log', 'php_errors.log');
	
	if(!isset($_REQUEST['request'])){
		failAndExit('Missing parameter `request`', 0xFE);
	}
	
	$sql = new SqliteObject();
	$request = $_REQUEST['request'];

	if($request == 'getlistofpeople'){
		if(($res = $sql->getData("SELECT display_name FROM personalSettings ORDER BY display_name", TRUE))){
			$names = array();
			foreach($res as $row){
				array_push($names, $row['display_name']);
			}
			echo json_encode(array('success' => TRUE, 'display_names' => $names));
			exit(0);
		}
		failAndExit('unable to get list of people');
	}
	
	if($request == 'getsettings'){
		if(!isset($_POST['display_name'])){
			failAndExit('missing parameter display_name');
		}
		
		$display_name = $sql->escapeString($_POST['display_name']);
		$query = sprintf("SELECT * FROM personalSettings WHERE display_name LIKE '%s'", $display_name);
		$res = array();
		if(($res = $sql->getData($query)) != NULL){
			if($res['keys_map']){
				$res['keys_map'] = json_decode($res['keys_map']);
			}else{
				$res['keys_map'] = array();
			}
			echo json_encode(array('success' => TRUE, 'settings' => $res));
			exit(0);
		}
		failAndExit('unable to get settings');
	}
	
	if($request == 'savesettings'){
		if(!isset($_POST['display_name']) || !isset($_POST['keys_start']) || !isset($_POST['keys_end']) || !isset($_POST['map'])){
			failAndExit(json_encode($_POST));
		}
		
		$display_name = $sql->escapeString($_POST['display_name']);
		$keys_start = allnum($_POST['keys_start']);
		$keys_end = allnum($_POST['keys_end']);
		$map = $sql->escapeString(json_encode($_POST['map']));
		
		$query = sprintf("SELECT EXISTS(SELECT ID FROM personalSettings WHERE display_name = '%s') as `exists`", $display_name);
		if(($res = $sql->getData($query))){
			if($res['exists'] == FALSE){
				$query = sprintf("INSERT INTO personalSettings(display_name,keys_start_at,keys_end_at,keys_map) " .
					"VALUES('%s',%d,%d,'%s')", $display_name, $keys_start, $keys_end, $map);
					
				if(($res = $sql->setData($query))){
					echo json_encode(array('success' => TRUE));
				}else{
					failAndExit('could not insert settings');
				}
				
				exit(0);
			}
			
			$query = "UPDATE personalSettings SET " .
				"keys_start_at = %d, keys_end_at = %d, keys_map = '%s' WHERE display_name = '%s'";
			$query = sprintf($query, $keys_start, $keys_end, $map, $display_name);
			
			if(($res = $sql->setData($query))){
				echo json_encode(array('success' => TRUE));
			}
			failAndExit('could not update settings');
		}
		
		failAndExit('breakpoint 1');
	}
	
	failAndExit('EOF reached');
?>