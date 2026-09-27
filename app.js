const pads = document.querySelectorAll(".pad");


const sounds = {

  tom: "sounds/tom.mp3",

  rom: "sounds/rom.mp3",

  crash: "sounds/crash.mp3",

  bell: "sounds/bell.mp3",

  kick: "sounds/kick.mp3",

  snare: "sounds/snare.mp3",

  "closed-hihat": "sounds/closed-hihat.mp3",

  "open-hihat": "sounds/open-hihat.mp3"

};


const audio = {};


// Load the sounds
for (let name in sounds) {

  audio[name] = new Audio(sounds[name]);

  audio[name].preload = "auto";

}


// Play a drum
function playSound(name, pad) {

  const sound = audio[name];

  sound.currentTime = 0;

  sound.play();

  pad.classList.add("active");

  setTimeout(() => {

    pad.classList.remove("active");

  }, 80);

}


// Mobile / mouse
pads.forEach(pad => {

  pad.addEventListener("pointerdown", () => {

    playSound(
      pad.dataset.sound,
      pad
    );

  });

});


// PC keyboard
document.addEventListener("keydown", event => {

  if (event.repeat) return;

  const pad = document.querySelector(
    `.pad[data-key="${event.key}"]`
  );

  if (!pad) return;

  playSound(
    pad.dataset.sound,
    pad
  );

});


// Offline caching
if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("sw.js");

}
