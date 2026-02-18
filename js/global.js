let canvasHeight = 480;
let canvasWidth = 720;



let levels = {
    godModeLevel: {
        levelStart: - canvasWidth * 0,
        levelEnd: canvasWidth * 1,
        characterHP: 999999,
        characterBottles: 999999,
        smallChickenAmount: 999999,
        bigChickenAmount: 999999,
        chickenSpeed: 999999,
        coinsAmount: 999999,
        bottleAmount: 999999,
        endbossHP: 999999,
        levelNumber: 999999
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
        endbossHP: 50,
        levelNumber: 1 // Level-Nummer
    },
    level2: {
        levelStart: - canvasWidth * 2,
        levelEnd: canvasWidth * 4,
        characterHP: 100,
        characterBottles: 0,
        smallChickenAmount: 0,
        bigChickenAmount: 10,
        chickenSpeed: 1,
        coinsAmount: 0,
        bottleAmount: 15,
        endbossHP: 100,
        levelNumber: 2 // Level-Nummer
    },
    level3: {
        levelStart: - canvasWidth * 3,
        levelEnd: canvasWidth * 6,
        characterHP: 150,
        characterBottles: 0,
        smallChickenAmount: 0,
        bigChickenAmount: 15,
        chickenSpeed: 1,
        coinsAmount: 0,
        bottleAmount: 20,
        endbossHP: 150,
        levelNumber: 3 // Level-Nummer
    },
    level4: {
        levelStart: - canvasWidth * 4,
        levelEnd: canvasWidth * 8,
        characterHP: 200,
        characterBottles: 0,
        smallChickenAmount: 0,
        bigChickenAmount: 20,
        chickenSpeed: 1,
        coinsAmount: 0,
        bottleAmount: 25,
        endbossHP: 200,
        levelNumber: 4 // Level-Nummer
    },
    level5: {
        levelStart: - canvasWidth * 5,
        levelEnd: canvasWidth * 10,
        characterHP: 250,
        characterBottles: 0,
        smallChickenAmount: 0,
        bigChickenAmount: 25,
        chickenSpeed: 1,
        coinsAmount: 0,
        bottleAmount: 30,
        endbossHP: 250,
        levelNumber: 5 // Level-Nummer
    }
};
