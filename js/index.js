window.onload = function(){
  'use strict';

  Synth.Initialize();
  KeyMap.Initialize();
  
  $('#btnShowMapping').click(function(){
    if($('#tableKeyMappingContainer').is(':visible')){
      $('#tableKeyMappingContainer').slideUp(400);
    }else{
      $('#tableKeyMappingContainer').slideDown(400);
    }
  });
  
  $('#btnResetMapping').click(function(){
    KeyMap.map = new Object();
    $('#tableKeyMapping tbody').empty();
  });
  
  //$('#btnSaveMapping').click();
  getListOfPeople();
  
  $('#txtBeginIndex').val(Synth.visibleKeysStart);
  $('#txtEndIndex').val(Synth.visibleKeysEnd);
  
  $('#txtBeginIndex').bind('click keyup', function(){
    if(!verifyKeyIndexInput($('#txtBeginIndex').val())){
      $('#txtBeginIndex').css('background-color', '#fcc6bf');
    }else{
      $('#txtBeginIndex').css('background-color', 'white');
    }
  });
  
  $('#txtEndIndex').bind('click keyup', function(){
    if(!verifyKeyIndexInput($('#txtBeginIndex').val())){
      $('#txtEndIndex').css('background-color', '#fcc6bf');
    }else{
      $('#txtEndIndex').css('background-color', 'white');
    }
  });
  
  $('#btnApplyKeys').click(function(){
    var start = $('#txtBeginIndex').val();
    var end = $('#txtEndIndex').val();
    
    if(!verifyKeyIndexInput(start) || !verifyKeyIndexInput(end)){
      return undefined;
    }
    
    if(start >= end){
      alert('Starting index must be less than the ending index.');
      return undefined;
    }
    
    Synth.DrawKeysInRange(start, end);
  });
  
  $('#btnSaveSettings').click(function(){
    if($('#txtDisplayName').val().length > 0){
      invoke(invoke_saveSettings());
    }else{
      alert('You must provide a name for your settings.');
    }
  });
  
  $('#btnLoadSettings').click(function(){
    if($('#lstDisplayNames').val().length > 0){
      invoke(invoke_getSettings());
    }
  });
};

function verifyKeyIndexInput(value){
  //console.log(value);
  var reg = new RegExp('^[0-9]*$');
  if(!reg.test(value.toString())){
    console.log('bp 0');
    return false;
  }
  var num = parseInt(value.toString());
  if(isNaN(num)){
    console.log('bp 1');
    return false;
  }
  if(num > Synth.numKeys || num < 0){
    console.log('bp 3');
    return false;
  }
 
  return true;
}

