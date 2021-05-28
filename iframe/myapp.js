const manifestUri = 'https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd';

async function init() {
  // When using the UI, the player is made automatically by the UI object.
  const video = document.getElementById('video');
  const ui = video['ui'];
  const controls = ui.getControls();
  const player = controls.getPlayer();

  player.configure({
    drm: {
      servers: {
        'com.widevine.alpha': 'https://cwip-shaka-proxy.appspot.com/no_auth',
      }
    }
  });

  // Attach player and ui to the window to make it easy to access in the JS console.
  window.player = player;
  window.ui = ui;

  // Listen for error events.
  player.addEventListener('error', onPlayerErrorEvent);
  player.addEventListener('drmsessionupdate', onDrmSessionUpdate);
  controls.addEventListener('error', onUIErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (error) {
    onPlayerError(error);
  }
}

function onDrmSessionUpdate() {
  const errorPre = document.querySelector('#errorPre');
  errorPre.innerHTML = 'Success: DrmSessionUpdateEvent';
}

function onPlayerErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function onPlayerError(error) {
  // Handle player error
  const errorPre = document.querySelector('#errorPre');
  errorPre.innerHTML = JSON.stringify(error, null, 2);
  console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function initFailed() {
  // Handle the failure to load; errorEvent.detail.reasonCode has a
  // shaka.ui.FailReasonCode describing why.
  console.error('Unable to load the UI library!');
}

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
document.addEventListener('shaka-ui-loaded', init);
// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener('shaka-ui-load-failed', initFailed);
