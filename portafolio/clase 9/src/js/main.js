document.getElementById('play').addEventListener('click', function (e) {
    e.preventDefault();

    const items = document.querySelectorAll('.main-menu__nav > li');
    const destino = this.getAttribute('href');

    items.forEach(function (li, index) {
        setTimeout(function () {
            li.style.transition = 'transform 0.3s ease-in';
            li.style.transform = 'translateX(1000px)';
        }, index * 200);
    });

    const tiempoTotal = (items.length - 1) * 200 + 300;
    setTimeout(function () {
        window.location.href = destino;
    }, tiempoTotal);
});

// Audio
// Busca esto donde tengas la lógica de audio en el INDEX
window.addEventListener('load', function () {
    var audio = document.getElementById('myAudio');
    
    // ESTO ES LO NUEVO: Leer el volumen guardado antes de reproducir
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume !== null && audio) {
        audio.volume = savedVolume / 100;
    }

    var reproducir = function () {
        audio.play().catch(function () {
            console.log("Esperando interacción...");
        });
    };
    document.addEventListener('click', reproducir, { once: true });
});