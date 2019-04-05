interface AudioContextConstructor {
    new(): AudioContext;
}

interface Window {
    AudioContext: AudioContextConstructor;
    webkitAudioContext: AudioContextConstructor;
}