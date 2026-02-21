// FlowQuran Audio Engine v1.0
class FlowAudioEngine {
    constructor() {
        this.audio = new Audio();
        this.ambientAudio = new Audio(); // Untuk Suara Alam
        this.ambientAudio.loop = true;
        
        // Pengaturan Bawaan (Bisa baca dari config nanti)
        this.audio.preload = "auto"; 
    }

    setSource(url) {
        this.audio.src = url;
    }

    play() {
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    setSpeed(speed) {
        this.audio.playbackRate = speed;
    }

    seek(time) {
        this.audio.currentTime = time;
    }

    // Logic untuk Night Shift & Normalization akan di-inject via Web Audio API di tahap lanjutan
    // Saat ini menggunakan kontrol volume standar
    setVolume(level) {
        this.audio.volume = level;
    }

    playAmbient(url, volume) {
        this.ambientAudio.src = url;
        this.ambientAudio.volume = volume;
        this.ambientAudio.play();
    }

    stopAmbient() {
        this.ambientAudio.pause();
    }
}

const engine = new FlowAudioEngine();
