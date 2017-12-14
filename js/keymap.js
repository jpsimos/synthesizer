/* Author Jacob Psimos 2017 */

var KeyMap = new Object();

const KEY_TILDE = 192;

KeyMap.Initialize = function(){
    'use strict';
    
    this.map = new Object();
    this.mappingNextKey = false;
    
    $(document).keydown(function(e){
        //console.log(e);
        KeyMap.OnKeyDown(e);      
    });
};

KeyMap.OnKeyDown = function(e){
    'use strict';
    
    var keyCode = e.originalEvent.keyCode;
    var keyName = e.originalEvent.key;
    
    if(e.originalEvent.keyCode == KEY_TILDE){
        this.mappingNextKey = true;
        this.SetPanelStyle(true);
        return undefined;
    }
    
    if(!this.mappingNextKey){
        var playToneAt = this.map[keyName];
        if(playToneAt != undefined){
            Synth.PlayKeyAt(playToneAt);
        }
        return undefined;
    }
    
    //keydown Alt { target: <body>, key: "Alt", charCode: 0, keyCode: 18 }
    this.map[keyName] = Synth.lastKeyPlayed;
    this.mappingNextKey = false;
    this.SetPanelStyle(false);
    
    
    $('#tableKeyMapping tbody').empty();
    
    for(var keyNameInMap in this.map){
        var noteName = Synth.keyNames[this.map[keyNameInMap]];
        
        var row = document.createElement('tr');
        var keyCol = document.createElement('td');
        var noteCol = document.createElement('td');
        
        $(keyCol).text(keyNameInMap);
        $(noteCol).text(noteName);
        $(row).append(keyCol);
        $(row).append(noteCol);
        
        $('#tableKeyMapping').append(row);
    }
    
    //console.log('Mapped ' + keyCode + ' to synth ' + lastKeyPlayed);
};

KeyMap.Reload = function(map2){
    //if(map2.length > 0){
        this.map = map2;
        $('#tableKeyMapping tbody').empty();
        for(var keyNameInMap in this.map){
            var noteName = Synth.keyNames[this.map[keyNameInMap]];
            console.log(noteName);
            var row = document.createElement('tr');
            var keyCol = document.createElement('td');
            var noteCol = document.createElement('td');
            
            $(keyCol).text(keyNameInMap);
            $(noteCol).text(noteName);
            $(row).append(keyCol);
            $(row).append(noteCol);
            
            $('#tableKeyMapping').append(row);
        }
    //}
}

KeyMap.SetPanelStyle = function(mapping){
    'use strict'
    if(mapping){
        $('#panelKeyMapping').removeClass('panel-default');
        $('#panelKeyMapping').removeClass('panel-primary');
        $('#panelKeyMapping').addClass('panel-primary');
        $('#panelKeyMappingActive').removeClass('glyphicon glyphicon-edit');
        $('#panelKeyMappingActive').addClass('glyphicon glyphicon-edit');
    }else{
        $('#panelKeyMapping').removeClass('panel-default');
        $('#panelKeyMapping').removeClass('panel-primary');
        $('#panelKeyMapping').addClass('panel-default');
        $('#panelKeyMappingActive').removeClass('glyphicon glyphicon-edit');
    }
};