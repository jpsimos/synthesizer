//Jacob Psimos 2017

var getListOfPeopleBusy = false;
var invokeLoadSettingsBusy = false;
var invokeSaveSettingsBusy = false;

function invoke_getListOfPeople(){
	var req = {
		busy : false,
		postdata : {
			'request' : 'getlistofpeople'
		},
		success : function(data){
			if(data.success){
				console.log(data);
			}else{
				console.log('[error] invoke_getListOfPeople: ' + data.exception);
			}
			invoke_getListOfPeople.busy = false;
		},
		error: function(jqXHR, exception){
			console.log('[error] invoke_getListOfPeople ' + exception);
			invoke_getListOfPeople.busy = false;
		},
		always: function(){
			invoke_getListOfPeople.busy = false;
		}
	}
	return req;
}

function invoke_saveSettings(){
	var req = {
		busy : false,
		postdata : {
			'request' : 'savesettings',
			'display_name' : $('#txtDisplayName').val(),
			'keys_start' : $('#txtBeginIndex').val(),
			'keys_end' : $('#txtEndIndex').val(),
			'map' : KeyMap.map
		},
		success: function(data){
			if(data.success){
				getListOfPeople();
				alert('Successfully saved your settings');
			}else{
				console.log('[error] invoke_saveSettings: ' + data.exception);
			}
			invoke_saveSettings.busy = false;
		},
		error: function(jqXHR, exception){
			console.log('[error] invoke_saveSettings: ' + exception);
			invoke_saveSettings.busy = false;
		},
		always : function(){
			invoke_saveSettings.busy = false;
		}
	}
	return req;
}

function invoke_getSettings(){
	var req = {
		busy : false,
		postdata : {
			'request' : 'getsettings',
			'display_name' : $('#lstDisplayNames').val()
		},
		success: function(data){
			if(data.success){
				console.log(data);
				Synth.DrawKeysInRange(data.settings.keys_start_at, data.settings.keys_end_at);
				KeyMap.Reload(data.settings.keys_map);
			}else{
				console.log('[error] invoke_getSettings: ' + data.exception);
			}
			invoke_getSettings.busy = false;
		},
		error: function(jqXHR, exception){
			console.log('[error] invoke_getSettings: ' + exception);
			invoke_getSettings.busy = false;
		},
		always : function(){
			invoke_getSettings.busy = false;
		}
	}
	return req;
}


function invoke(request){
	if(request.busy){
		console.log('[notice] ' + request.postdata.request + ' is busy; ignoring request.');
		return undefined;
	}
	
	request.busy = true; // fix
	
	console.log(request.postdata);
	
	$.ajax({
		url: 'invoke/customizationInvoker.php',
		type: 'POST',
		dataType: 'json',
		data: request.postdata,
		success: request.success,
		error: request.error,
		always: request.always
	});
}

function getListOfPeople(){
	
	if(getListOfPeopleBusy){
		console.log('[notice] invoker is busy; ignoring request.');
		return undefined;
	}
	
	getListOfPeopleBusy = true;
	
	$.ajax({
		url: 'invoke/customizationInvoker.php',
		type: 'POST',
		dataType: 'json',
		data: { 'request' : 'getlistofpeople' },
		success: function(data){
			getListOfPeopleBusy = false;
			if(data.success){
				$('#divPeople').empty();
				for(var i in data.display_names){
					var person = data.display_names[i];
					var listOption = document.createElement('option');
					
					$(listOption).val(person);
					$(listOption).text(person);
					$('#lstDisplayNames').prepend(listOption);
				}
			}else{
				console.log('[error] invoker error: ' + data.exception);
			}
		},
		error: function(jqXHR, exception){
			getListOfPeopleBusy = false;
			console.log('[error] invoker error (' + jqXHR.status + ') ' + exception);
		},
		always: function(){
			getListOfPeopleBusy = false;
		}
	});
}