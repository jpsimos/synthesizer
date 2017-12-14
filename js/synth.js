/* Author Jacob Psimos 2017 */
/*
  Middle C: 39
*/

var Synth = new Object();

Synth.Initialize = function(){
  'use strict';

  this.keyObjects = new Array();
  this.keyNames = new Array();
  this.keyFrequencies = new Array();
  this.numKeys = 64;
  this.lastKeyPlayed = 0;
  this.visibleKeysStart = 30; //default
  this.visibleKeysEnd = 51; //default
  
  this.InitializePiano();
  this.DrawKeysInRange(30,51);
};

Synth.DrawKeysInRange = function(startingAt, endingAt){
  'use strict';
  
  var endingKeyIndex = endingAt;
  
  if(endingKeyIndex > this.numKeys){
    console.log('[error] startingAt + endingAt is greater than ' + this.numKeys);
    return undefined;
  }
  
  if(endingAt <= startingAt){
    console.log('[error] endingAt must be greater than startingAt.');
    return undefined;
  }
  
  this.visibleKeysStart = startingAt;
  this.visibleKeysEnd = endingAt;

  $('#pianoContainer').empty();
  $('#txtBeginIndex').val(startingAt);
  $('#txtEndIndex').val(endingAt);

  for(var i = startingAt; i < endingAt; i++){
    var isNoteSharp = this.keyNames[i].indexOf('#') != -1;
    var keyDom = document.createElement('div');
    $(keyDom).addClass(isNoteSharp ? 'pianoKeySharp' : 'pianoKey');
    //$(keyDom).addClass('pianoKey');
    $(keyDom).addClass('noselect');
    $(keyDom).click(Synth.CreateKeyPlayCallback(i));
    $(keyDom).text(this.keyNames[i].substr(0, 2));
    $(keyDom).attr('name', i.toString());
    
    /*
    var keyNameLength = this.keyNames[i].length;
    for(var a = 0; a < keyNameLength; a++){
      var verticalCharacter = document.createElement('span');
      $(verticalCharacter).css('display', 'block');
      $(verticalCharacter).text(this.keyNames[i].charAt(a));
      $(keyDom).append(verticalCharacter);
    }
    */

    $('#pianoContainer').append(keyDom);
  }
}

Synth.CreateKeyPlayCallback = function(index){
  'use strict';
  return function(){
    'use strict';
    Synth.PlayKeyAt(index);
  };
}

Synth.PlayKeyAt = function(index){
  'use strict';
  
  if(index < 0 || index >= this.numKeys){
    console.log('[error] Synth.PlayKeyAt - index out of bounds.');
    return undefined;
  }
  
  var keyObject = $(this.keyObjects[index]);
  
  
  var asyncAudioObject = keyObject.clone();
  asyncAudioObject.attr('preload', 'true');
  asyncAudioObject.trigger('play');
  
  this.lastKeyPlayed = index;
  
  $('#lblLastKeyPlayed').text(this.keyNames[index]);
  
  keyObject = $('#pianoContainer div[name="' + index.toString() + '"]');
  
  keyObject.removeClass('pianoKeyHover');
  keyObject.addClass('pianoKeyHover');
  
  setTimeout(function(){
    keyObject.removeClass('pianoKeyHover');
  }, 200);
};

Synth.InitializePiano = function(){
  'use strict';
  
  this.keyObjects = new Array();
  this.keyNames = new Array();
  this.keyFrequencies = new Array();
  
  for(var i = 1; i <= this.numKeys; i++){
    var audioObject = document.createElement('AUDIO');
    var audioFileURL = 'sounds/jobro/piano_' + i.toString() + '.wav';
    
    $(audioObject).attr('src', audioFileURL);
    $(audioObject).attr('preload', 'true');
    
    this.keyObjects.push(audioObject);
  }

  this.keyNames.push("A0");
  this.keyFrequencies.push(27.500000);
  this.keyNames.push("A#0/Bb0");
  this.keyFrequencies.push(29.135300);
  this.keyNames.push("B0");
  this.keyFrequencies.push(30.867700);
  this.keyNames.push("C1");
  this.keyFrequencies.push(32.703200);
  this.keyNames.push("C#1/Db1");
  this.keyFrequencies.push(34.647900);
  this.keyNames.push("D1");
  this.keyFrequencies.push(36.708100);
  this.keyNames.push("D#1/Eb1");
  this.keyFrequencies.push(38.890900);
  this.keyNames.push("E1");
  this.keyFrequencies.push(41.203500);
  this.keyNames.push("F1");
  this.keyFrequencies.push(43.653600);
  this.keyNames.push("F#1/Gb1");
  this.keyFrequencies.push(46.249300);
  this.keyNames.push("G1");
  this.keyFrequencies.push(48.999500);
  this.keyNames.push("G#1/Ab1");
  this.keyFrequencies.push(51.913000);
  this.keyNames.push("A1");
  this.keyFrequencies.push(55.000000);
  this.keyNames.push("A#1/Bb1");
  this.keyFrequencies.push(58.270500);
  this.keyNames.push("B1");
  this.keyFrequencies.push(61.735400);
  this.keyNames.push("C2");
  this.keyFrequencies.push(65.406400);
  this.keyNames.push("C#2/Db2");
  this.keyFrequencies.push(69.295700);
  this.keyNames.push("D2");
  this.keyFrequencies.push(73.416200);
  this.keyNames.push("D#2/Eb2");
  this.keyFrequencies.push(77.781700);
  this.keyNames.push("E2");
  this.keyFrequencies.push(82.406900);
  this.keyNames.push("F2");
  this.keyFrequencies.push(87.307100);
  this.keyNames.push("F#2/Gb2");
  this.keyFrequencies.push(92.498600);
  this.keyNames.push("G2");
  this.keyFrequencies.push(97.998900);
  this.keyNames.push("G#2/Ab2");
  this.keyFrequencies.push(103.826000);
  this.keyNames.push("A2");
  this.keyFrequencies.push(110.000000);
  this.keyNames.push("A#2/Bb2");
  this.keyFrequencies.push(116.541000);
  this.keyNames.push("B2");
  this.keyFrequencies.push(123.471000);
  this.keyNames.push("C3");
  this.keyFrequencies.push(130.813000);
  this.keyNames.push("C#3/Db3");
  this.keyFrequencies.push(138.591000);
  this.keyNames.push("D3");
  this.keyFrequencies.push(146.832000);
  this.keyNames.push("D#3/Eb3");
  this.keyFrequencies.push(155.563000);
  this.keyNames.push("E3");
  this.keyFrequencies.push(164.814000);
  this.keyNames.push("F3");
  this.keyFrequencies.push(174.614000);
  this.keyNames.push("F#3/Gb3");
  this.keyFrequencies.push(184.997000);
  this.keyNames.push("G3");
  this.keyFrequencies.push(195.998000);
  this.keyNames.push("G#3/Ab3");
  this.keyFrequencies.push(207.652000);
  this.keyNames.push("A3");
  this.keyFrequencies.push(220.000000);
  this.keyNames.push("A#3/Bb3");
  this.keyFrequencies.push(233.082000);
  this.keyNames.push("B3");
  this.keyFrequencies.push(246.942000);
  this.keyNames.push("C4");
  this.keyFrequencies.push(261.626000);
  this.keyNames.push("C#4/Db4");
  this.keyFrequencies.push(277.183000);
  this.keyNames.push("D4");
  this.keyFrequencies.push(293.665000);
  this.keyNames.push("D#4/Eb4");
  this.keyFrequencies.push(311.127000);
  this.keyNames.push("E4");
  this.keyFrequencies.push(329.628000);
  this.keyNames.push("F4");
  this.keyFrequencies.push(349.228000);
  this.keyNames.push("F#4/Gb4");
  this.keyFrequencies.push(369.994000);
  this.keyNames.push("G4");
  this.keyFrequencies.push(391.995000);
  this.keyNames.push("G#4/Ab4");
  this.keyFrequencies.push(415.305000);
  this.keyNames.push("A4");
  this.keyFrequencies.push(440.000000);
  this.keyNames.push("A#4/Bb4");
  this.keyFrequencies.push(466.164000);
  this.keyNames.push("B4");
  this.keyFrequencies.push(493.883000);
  this.keyNames.push("C5");
  this.keyFrequencies.push(523.251000);
  this.keyNames.push("C#5/Db5");
  this.keyFrequencies.push(554.365000);
  this.keyNames.push("D5");
  this.keyFrequencies.push(587.330000);
  this.keyNames.push("D#5/Eb5");
  this.keyFrequencies.push(622.254000);
  this.keyNames.push("E5");
  this.keyFrequencies.push(659.255000);
  this.keyNames.push("F5");
  this.keyFrequencies.push(698.456000);
  this.keyNames.push("F#5/Gb5");
  this.keyFrequencies.push(739.989000);
  this.keyNames.push("G5");
  this.keyFrequencies.push(783.991000);
  this.keyNames.push("G#5/Ab5");
  this.keyFrequencies.push(830.609000);
  this.keyNames.push("A5");
  this.keyFrequencies.push(880.000000);
  this.keyNames.push("A#5/Bb5");
  this.keyFrequencies.push(932.328000);
  this.keyNames.push("B5");
  this.keyFrequencies.push(987.767000);
  this.keyNames.push("C6");
  this.keyFrequencies.push(1046.500000);

};


