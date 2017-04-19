window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var synth = window.speechSynthesis;

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
    synth.speak(utterThis);
    utterThis.onend = function(event) {
      listening = true;
      console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
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
