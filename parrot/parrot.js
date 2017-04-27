window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var synth = window.speechSynthesis;

var topbeak = Snap("#top-beak");
var bottombeak = Snap("#bottom-beak");

const recognition = new SpeechRecognition();
recognition.interimResults = true;
let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

var listening = true;

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
  .map(result => result[0])
  .map(result => result.transcript)
  .join('');
  const poopScript = transcript.replace(/poop|poo/gi, '💩');
  p.textContent = poopScript;
  if (e.results[0].isFinal) {
    recognition.stop();
    listening = false;
    p = document.createElement('p');
    words.prepend(p);
    var utterThis = new SpeechSynthesisUtterance(poopScript);
    var voices = synth.getVoices();
    utterThis.voice = voices.filter(function(voice) { return voice.name === 'Daniel'})[0];
    synth.speak(utterThis);
    talkOut();
    utterThis.onend = function(event) {
      listening = true;
      topbeak.stop();
      bottombeak.stop();
      recognition.start();
    };
  }
});

recognition.addEventListener('end', function() {
  if (listening) {
    recognition.start();
  } else {
    recognition.stop();
  }
});
recognition.start();

function talkOut() {
    var tbbox = topbeak.getBBox();
    var bbbox = bottombeak.getBBox();

    topbeak.animate({transform: "r-14," + tbbox.cx + "," + tbbox.cy }, 150, talkIn.bind(null));
    bottombeak.animate({transform: "r9," + bbbox.cx + "," + bbbox.cy }, 150);
};

function talkIn() {
    var tbbox = topbeak.getBBox();
    var bbbox = bottombeak.getBBox();

    topbeak.animate({transform: "r9," + tbbox.cx + "," + tbbox.cy }, 150, talkOut.bind(null));
    bottombeak.animate({transform: "r-9," + bbbox.cx + "," + bbbox.cy }, 150);
};
