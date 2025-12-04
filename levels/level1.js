let levelStart = -720;
let levelEnd = 2160;
let characterHP = 100; // HP für Level 1
let characterBottles = 0;
let smallChickenAmount = 0; // Anzahl der kleinen Hühner
let bigChickenAmount = 10;
let chickenSpeed = 1;
let coinsAmount = 0;
let bottleAmount = 10;
let endbossHP = 20;
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
        generateBottlesWithMinDistance(bottleAmount, 100), // Flaschen mit Mindestabstand
        generateCoinsWithMinDistance(coinsAmount, 50), // Münzen mit Mindestabstand
        [
            new LevelDisplay(levelNumber) // Level Anzeige
        ]

    );
}