document.addEventListener("DOMContentLoaded", () => {
    const volSlider = document.querySelector('.vol-slider');
    const audio = document.getElementById('myAudio');

    // 1. Al entrar a settings, aplicar el volumen que ya existía
    const savedVolume = localStorage.getItem('gameVolume') || 50;
    volSlider.value = savedVolume;
    if (audio) {
        audio.volume = savedVolume / 100;
    }

    // 2. Cambiar volumen en tiempo real
    volSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        const volumeLevel = value / 100;
        
        // Guardar para que el Index lo sepa
        localStorage.setItem('gameVolume', value);
        
        // Aplicar al audio de la página actual
        if (audio) {
            audio.volume = volumeLevel;
        }
    });
});