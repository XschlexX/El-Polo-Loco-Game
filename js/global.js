let canvasHeight = 480;
let canvasWidth = 720;

// Level-Variablen (werden von level-creator.js gesetzt)
let levelStart;
let levelEnd;

let currentLevelNumber = 1;

let levels = {
    level0: {
        levelStart: - canvasWidth * 1,
        levelEnd: canvasWidth * 3,
        characterHP: 50, // HP für Level 1
        characterBottles: 0,
        smallChickenAmount: 0, // Anzahl der kleinen Hühner
        bigChickenAmount: 0,
        chickenSpeed: 1,
        coinsAmount: 10,
        bottleAmount: 10,
        endbossHP: 10,
        levelNumber: 0 // Level-Nummer
    },
    level1: {
        levelStart: - canvasWidth * 1,
        levelEnd: canvasWidth * 3,
        characterHP: 50, // HP für Level 1
        characterBottles: 0,
        smallChickenAmount: 0, // Anzahl der kleinen Hühner
        bigChickenAmount: 5,
        chickenSpeed: 1,
        coinsAmount: 0,
        bottleAmount: 10,
        endbossHP: 30,
        levelNumber: 1 // Level-Nummer
    },
    level2: {
        levelStart: - canvasWidth * 2,
        levelEnd: canvasWidth * 4,
        characterHP: 100,
        characterBottles: 0,
        smallChickenAmount: 5,
        bigChickenAmount: 10,
        chickenSpeed: 1.1,
        coinsAmount: 0,
        bottleAmount: 15,
        endbossHP: 60,
        levelNumber: 2 // Level-Nummer
    },
    level3: {
        levelStart: - canvasWidth * 3,
        levelEnd: canvasWidth * 6,
        characterHP: 150,
        characterBottles: 0,
        smallChickenAmount: 10,
        bigChickenAmount: 10,
        chickenSpeed: 1.2,
        coinsAmount: 10,
        bottleAmount: 20,
        endbossHP: 100,
        levelNumber: 3 // Level-Nummer
    },
    level4: {
        levelStart: - canvasWidth * 4,
        levelEnd: canvasWidth * 8,
        characterHP: 200,
        characterBottles: 0,
        smallChickenAmount: 10,
        bigChickenAmount: 15,
        chickenSpeed: 1.3,
        coinsAmount: 10,
        bottleAmount: 25,
        endbossHP: 150,
        levelNumber: 4 // Level-Nummer
    },
    level5: {
        levelStart: - canvasWidth * 5,
        levelEnd: canvasWidth * 10,
        characterHP: 250,
        characterBottles: 0,
        smallChickenAmount: 15,
        bigChickenAmount: 20,
        chickenSpeed: 1.4,
        coinsAmount: 10,
        bottleAmount: 30,
        endbossHP: 200,
        levelNumber: 5 // Level-Nummer
    },
    godModeLevel: {
        levelStart: - canvasWidth * 6,
        levelEnd: canvasWidth * 24,
        characterHP: 10000,
        characterBottles: 0,
        smallChickenAmount: 10,
        bigChickenAmount: 10,
        chickenSpeed: 10,
        coinsAmount: 30,
        bottleAmount: 30,
        endbossHP: 1000,
        levelNumber: 999
    }
};
