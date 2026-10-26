import '@jofr/capacitor-media-session';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

// Ask for notification permission so the player shows on the lock screen / notification shade
if (Capacitor.isNativePlatform()) {
  LocalNotifications.requestPermissions().catch(() => {});
}

// Default cover art for the media notification when a track has none
const Orig = window.MediaMetadata;
if (Orig) {
  window.MediaMetadata = class extends Orig {
    constructor(init = {}) {
      if (!init.artwork || !init.artwork.length) {
        init = {
          ...init,
          artwork: [{ src: new URL('cover.jpg', location.href).href, sizes: '512x512', type: 'image/jpeg' }]
        };
      }
      super(init);
    }
  };
}

// Tell the system whether media is playing
const setState = (s) => { try { navigator.mediaSession.playbackState = s; } catch (_) {} };
document.addEventListener('play', () => setState('playing'), true);
document.addEventListener('playing', () => setState('playing'), true);
document.addEventListener('pause', () => setState('paused'), true);
document.addEventListener('ended', () => setState('paused'), true);
