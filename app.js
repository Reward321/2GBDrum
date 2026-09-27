const pads = document.querySelectorAll(".pad");


// -----------------------------
// SOUND FILES
// -----------------------------

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


// -----------------------------
// AUDIO ENGINE
// -----------------------------

const AudioContext =
  window.AudioContext ||
  window.webkitAudioContext;

const audioContext = new AudioContext();

const audioBuffers = {};


// -----------------------------
// LOAD ONE SOUND
// -----------------------------

async function loadSound(name, file) {

  try {

    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("Could not load " + file);
    }

    const data =
      await response.arrayBuffer();

    audioBuffers[name] =
      await audioContext.decodeAudioData(data);

  }

  catch (error) {

    console.error(
      "Sound loading error:",
      name,
      error
    );

  }

}


// -----------------------------
// LOAD ALL SOUNDS
// -----------------------------

async function loadSounds() {

  const loading = [];

  for (const name in sounds) {

    loading.push(
      loadSound(
        name,
        sounds[name]
      )
    );

  }

  await Promise.all(loading);

  console.log("2GBDrum sounds loaded");

}


loadSounds();


// -----------------------------
// PLAY SOUND
// -----------------------------

function playSound(name, pad) {

  const buffer =
    audioBuffers[name];

  // Don't play if sound isn't loaded
  if (!buffer) return;


  // Resume AudioContext after
  // the first user interaction
  if (audioContext.state === "suspended") {

    audioContext.resume();

  }


  // Create a new source for
  // every drum hit
  const source =
    audioContext.createBufferSource();


  source.buffer = buffer;


  // Connect sound to speakers
  source.connect(
    audioContext.destination
  );


  // Play immediately
  source.start(0);


  // Visual pad animation
  pad.classList.add("active");


  setTimeout(() => {

    pad.classList.remove("active");

  }, 60);

}


// -----------------------------
// TOUCH + MOUSE
// -----------------------------

pads.forEach(pad => {

  pad.addEventListener(
    "pointerdown",
    () => {

      playSound(
        pad.dataset.sound,
        pad
      );

    }
  );

});


// -----------------------------
// KEYBOARD
// -----------------------------

document.addEventListener(
  "keydown",
  event => {

    // Prevent holding a key
    // from repeatedly firing
    if (event.repeat) return;


    const pad =
      document.querySelector(
        `.pad[data-key="${event.key}"]`
      );


    if (!pad) return;


    playSound(
      pad.dataset.sound,
      pad
    );

  }
);


// -----------------------------
// SERVICE WORKER
// -----------------------------

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("sw.js")
    .then(() => {

      console.log(
        "2GBDrum offline cache ready"
      );

    })
    .catch(error => {

      console.error(
        "Service worker error:",
        error
      );

    });

}
