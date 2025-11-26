let levelStart = -1440;
let levelEnd = 2880;
let characterHP = 100; // HP für Level 1
let smallChickenAmount;
let bigChickenAmount = 10;
let coinsAmount = 30;
let bottleAmount = 15;
let endbossHP;
let levelNumber = 1; // Level-Nummer
let level1;
function createLevel1() {

    level1 = new Level(
        [
            levelStart,
            levelEnd
        ],
        new Character(characterHP), // Character mit level-spezifischer HP
        generateBackgrounds(),
        generateClouds(),
        generateStatusBars(),
        generateChickens(bigChickenAmount), // Anzahl der Chickens
        [
            new Endboss(levelEnd),
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