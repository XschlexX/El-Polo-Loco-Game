let levelStart = - canvasWidth * 1;
let levelEnd = canvasWidth * 3;
let characterHP = 50; // HP für Level 1
let characterBottles = 0;
let smallChickenAmount = 0; // Anzahl der kleinen Hühner
let bigChickenAmount = 5;
let chickenSpeed = 1;
let coinsAmount = 0;
let bottleAmount = 10;
let endbossHP = 50;
let levelNumber = 1; // Level-Nummer

let level1;
function createLevel1() {

    level1 = new Level(
        [
            levelStart,
            levelEnd
        ],
        new Character(characterHP, characterBottles),
        generateBackgrounds(),
        generateClouds(),
        generateStatusBars(),
        [...generateSmallChickens(smallChickenAmount, chickenSpeed), ...generateChickens(bigChickenAmount, chickenSpeed)], // Kleine und große Chickens kombiniert
        [
            new Endboss(levelEnd, endbossHP),
        ],
        [
            new GameTimer()
        ],
        [
            new DebugInfo()
        ],
        [
            new LevelDisplay(levelNumber) // Level Anzeige
        ],
        generateBottlesWithMinDistance(bottleAmount, 100), // Flaschen mit Mindestabstand
        generateCoinsWithMinDistance(coinsAmount, 50) // Münzen mit Mindestabstand
    );
}