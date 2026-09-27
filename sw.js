const CACHE_NAME = "2gbdrum-v1";


const FILES = [

  "./",

  "./index.html",

  "./style.css",

  "./app.js",

  "./sounds/tom.wav",

  "./sounds/rom.wav",

  "./sounds/crash.wav",

  "./sounds/bell.wav",

  "./sounds/kick.wav",

  "./sounds/snare.wav",

  "./sounds/closed-hihat.wav",

  "./sounds/open-hihat.wav"

];


self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => {

        return cache.addAll(FILES);

      })

  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(names => {

      return Promise.all(

        names

          .filter(name => name !== CACHE_NAME)

          .map(name => caches.delete(name))

      );

    })

  );

});


self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)

      .then(cachedFile => {

        if (cachedFile) {

          return cachedFile;

        }

        return fetch(event.request);

      })

  );

});
