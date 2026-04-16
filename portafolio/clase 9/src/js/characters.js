const characters = [
    {
        name: "ELEVEN",
        desc: "Posee habilidades psicoquinéticas y telepáticas. Es la clave para cerrar el portal al Upside Down.",
        img: "../src/models/obj/player/once.png"
    },
    {
        name: "LAMPARA CEMENTERIO",
        desc: "El cerebro del grupo. Experto en tecnología y diplomacia con criaturas de otras dimensiones.",
        img: "../src/models/obj/collectibe/lamp.png"
    }
    
];

let currentIndex = 0;

const imgElement = document.getElementById('char-img');
const nameElement = document.getElementById('char-name');
const descElement = document.getElementById('char-description');

function updateCharacter() {
    const char = characters[currentIndex];
    nameElement.innerText = char.name;
    descElement.innerText = char.desc;
    imgElement.src = char.img;
}

document.getElementById('next-btn').onclick = () => {
    currentIndex = (currentIndex + 1) % characters.length;
    updateCharacter();
};

document.getElementById('prev-btn').onclick = () => {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    updateCharacter();
};