// --- 1. DATA JUZ (Ganti dengan Link Asli Nanti) ---
const juzList = [
    "https://server8.mp3quran.net/afs/001.mp3", // Juz 1
    "https://server8.mp3quran.net/afs/112.mp3", // Juz 2 (Placeholder)
    "https://server8.mp3quran.net/afs/113.mp3"  // Juz 3 (Placeholder)
]; // Lengkapi sampai 30

// --- 2. STATE MANAGEMENT ---
let currentJuz = parseInt(localStorage.getItem('fq_juz')) || 0;
let isPlaying = false;

// UI Elements
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const juzDisplay = document.getElementById('juz-number');
const seekBar = document.getElementById('seek-bar');
const timeCurrent = document.getElementById('current-time');
const timeDuration = document.getElementById('duration');

// --- 3. CORE LOGIC ---
function loadJuz(index, autoPlay = false) {
    if (index < 0 || index >= juzList.length) return;
    currentJuz = index;
    
    engine.setSource(juzList[currentJuz]);
    juzDisplay.innerText = currentJuz + 1;
    localStorage.setItem('fq_juz', currentJuz); // Simpan Histori
    
    // Smart Resume Logic
    const savedTime = localStorage.getItem(`fq_time_juz_${currentJuz}`);
    if (savedTime && !autoPlay) {
        engine.seek(parseFloat(savedTime));
    }

    updateMediaSession();
    if (autoPlay) togglePlay(true);
}

function togglePlay(forcePlay = null) {
    if (forcePlay === true || engine.audio.paused) {
        engine.play().then(() => {
            isPlaying = true;
            btnPlay.innerText = "⏸";
        }).catch(e => console.log("Auto-play dicegah browser", e));
    } else {
        engine.pause();
        isPlaying = false;
        btnPlay.innerText = "▶";
    }
}

// Auto-Play Next Juz (Sistem Inti)
engine.audio.addEventListener('ended', () => {
    if (currentJuz < juzList.length - 1) {
        loadJuz(currentJuz + 1, true); // Lanjut otomatis
    } else {
        alert("Alhamdulillah, Khatam 30 Juz!");
    }
});

// Update Progress & Smart Resume Autosave
engine.audio.addEventListener('timeupdate', () => {
    seekBar.value = engine.audio.currentTime;
    timeCurrent.innerText = formatTime(engine.audio.currentTime);
    
    // Simpan posisi setiap 5 detik
    if (Math.floor(engine.audio.currentTime) % 5 === 0) {
        localStorage.setItem(`fq_time_juz_${currentJuz}`, engine.audio.currentTime);
    }
});

engine.audio.addEventListener('loadedmetadata', () => {
    seekBar.max = engine.audio.duration;
    timeDuration.innerText = formatTime(engine.audio.duration);
});

seekBar.addEventListener('input', () => engine.seek(seekBar.value));

// --- 4. EVENT LISTENERS ---
btnPlay.addEventListener('click', () => togglePlay());
btnNext.addEventListener('click', () => loadJuz(currentJuz + 1, true));
btnPrev.addEventListener('click', () => loadJuz(currentJuz - 1, true));

document.getElementById('speed-control').addEventListener('change', (e) => {
    engine.setSpeed(parseFloat(e.target.value));
});

// Settings Modal Logic
document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.remove('hidden');
});
document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.add('hidden');
});

// --- 5. KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', (e) => {
    if(e.target.tagName === 'INPUT') return; // Ignore if typing
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'KeyN') loadJuz(currentJuz + 1, true);
    if (e.code === 'KeyP') loadJuz(currentJuz - 1, true);
});

// --- 6. MEDIA SESSION (Notifikasi HP) ---
function updateMediaSession() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: `Juz ${currentJuz + 1}`,
            artist: 'FlowQuran Murottal',
            artwork: [{ src: 'https://via.placeholder.com/512/0a0a0a/38bdf8?text=FQ', sizes: '512x512', type: 'image/png' }]
        });
        navigator.mediaSession.setActionHandler('play', () => togglePlay(true));
        navigator.mediaSession.setActionHandler('pause', () => togglePlay(false));
        navigator.mediaSession.setActionHandler('nexttrack', () => loadJuz(currentJuz + 1, true));
        navigator.mediaSession.setActionHandler('previoustrack', () => loadJuz(currentJuz - 1, true));
    }
}

// Utils
function formatTime(sec) {
    if (isNaN(sec)) return "00:00";
    let m = Math.floor(sec / 60); let s = Math.floor(sec % 60);
    return `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
}

// INIT PWA Service Worker (Untuk Offline Cache)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => console.log('PWA Ready')).catch(err => console.log('PWA Error', err));
    });
}

// Start Application
loadJuz(currentJuz);
      
