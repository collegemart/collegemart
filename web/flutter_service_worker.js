'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "802109a44f0929e4c73c279bdcd7293a",
"assets/assets/images/about.png": "d489334d2c33aaf4e2c8693463f0a2ea",
"assets/assets/images/aplc.png": "cbc8e16838034bbef6542d06a5c72acc",
"assets/assets/images/banner.png": "80fadd97e0b896342f16f3753a847bc3",
"assets/assets/images/banner2.jpg": "607d40a7359c55edfa1989232b320bda",
"assets/assets/images/books.png": "4ff564d911dc452744ded0a273d676f9",
"assets/assets/images/books2.png": "a4b8bba76af7858ee0f7612c7e67d4da",
"assets/assets/images/calc.png": "4599299f91a0d20d8c29b7c73cc7555c",
"assets/assets/images/dakshdabas.jpg": "8229cb4626c0091413f14e26f189a5df",
"assets/assets/images/dtu_logo.png": "411f1ccbe6a02ef58c20ac6e1f45a9ef",
"assets/assets/images/eg.png": "3f9f57cd68738cc969e3ff649878fa7a",
"assets/assets/images/eg2.png": "e7f1e3aecb3d3f6016ca17046e75523d",
"assets/assets/images/freelancing.png": "b4c66f866faa6e4cd925f730fe490348",
"assets/assets/images/helicopter.png": "778350912d7eac9ce9587657a0f0d0dd",
"assets/assets/images/himanshu.jpg": "276b6393d32a06c46f652007f5f19100",
"assets/assets/images/igdtuw.jpg": "34a6bdda9d8033b3707520b123e6d471",
"assets/assets/images/iiit.png": "c82a3b5358983f64f85b14ecb9d787f8",
"assets/assets/images/insta.png": "c5ddecc677d10dd4ae1a9216bf75dff7",
"assets/assets/images/kartik.jpg": "4b351f9d78fc53baf6ba4a752bf709c1",
"assets/assets/images/lc.png": "54df8dbffe3c0761454354be6015921e",
"assets/assets/images/new.jpg": "29eebcdc84eea9c9f0a9f8b3264325eb",
"assets/assets/images/nsut.jpeg": "9afd20b726883be80928f9297267a6bd",
"assets/assets/images/sc.png": "45fd07ed1b0849866e225a6e9e127183",
"assets/assets/images/sc2.png": "d223ec3c5a6aeaec32f669b1fc5ffee9",
"assets/assets/images/sk.png": "b675b1d5476d01524307dd89fd379ae8",
"assets/assets/images/skit.png": "8b54e931ba6977c512ae1de914028bb6",
"assets/assets/images/skitb.png": "187628d659e417da66c5cf39e041a439",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "8174dd9bf3d36c824bb409832ecec5b8",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "92aeb2999da9912151c66e9a3e2bced2",
"/": "92aeb2999da9912151c66e9a3e2bced2",
"main.dart.js": "aa7eab390f8040526edac8ac5c9edd6b",
"manifest.json": "34acc7b78e0ef351a041cc70813637a6",
"version.json": "dfd2bafd349afe5dfd9b556156373af6"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
