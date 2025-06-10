'use strict';

let canvas;
let ctx;
let character = new Image();

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    character.src = '../assets/img/2_character_pepe/2_walk/W-23.png';

    ctx.drawImage(character, 20, 20, 75, 150);
}
