// Debug-Settings
let debugModus = false;
let characterDebug = true;
let characterGodMode = false;
let endbossDebug = true;
let endboss = true;
let chicken = false;
let smallChicken = false;

// Canvas-Größe
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
        characterHP: characterGodMode ? 10000 : 10,
        characterBottles: 100,
        smallChickenAmount: smallChicken ? 10 : 0,
        bigChickenAmount: chicken ? 10 : 0,
        chickenSpeed: 3,
        coinsAmount: 10,
        bottleAmount: 10,
        endbossHP: 20,
        levelNumber: 0
    },
    level1: {
        levelStart: - canvasWidth * 1,
        levelEnd: canvasWidth * 3,
        characterHP: 50,
        characterBottles: 0,
        smallChickenAmount: 0,
        bigChickenAmount: 5,
        chickenSpeed: 1,
        coinsAmount: 0,
        bottleAmount: 10,
        endbossHP: 30,
        levelNumber: 1
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
        levelNumber: 2
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
        levelNumber: 3
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
        levelNumber: 4
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
        levelNumber: 5
    },
    // level5: {
    //     levelStart: - canvasWidth * 5,
    //     levelEnd: canvasWidth * 10,
    //     characterHP: 250,
    //     characterBottles: 0,
    //     smallChickenAmount: 0,
    //     bigChickenAmount: 0,
    //     chickenSpeed: 1.4,
    //     coinsAmount: 10,
    //     bottleAmount: 30,
    //     endbossHP: 20,
    //     levelNumber: 5
    // },
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


let imagePaths = {
    character: {
        imagesIdle: [
            '../assets/img/2_character_pepe/1_idle/idle/I-1.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-2.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-3.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-4.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-5.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-6.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-7.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-8.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-9.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-10.png'
        ],

        imagesLongIdle: [
            '../assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
        ],

        imagesWalk: [
            '../assets/img/2_character_pepe/2_walk/W-21.png',
            '../assets/img/2_character_pepe/2_walk/W-22.png',
            '../assets/img/2_character_pepe/2_walk/W-23.png',
            '../assets/img/2_character_pepe/2_walk/W-24.png',
            '../assets/img/2_character_pepe/2_walk/W-25.png',
            '../assets/img/2_character_pepe/2_walk/W-26.png'
        ],

        imagesJump: [
            '../assets/img/2_character_pepe/3_jump/J-31.png',
            '../assets/img/2_character_pepe/3_jump/J-32.png',
            '../assets/img/2_character_pepe/3_jump/J-33.png',
            '../assets/img/2_character_pepe/3_jump/J-34.png',
            '../assets/img/2_character_pepe/3_jump/J-35.png',
            '../assets/img/2_character_pepe/3_jump/J-36.png',
            '../assets/img/2_character_pepe/3_jump/J-37.png',
            '../assets/img/2_character_pepe/3_jump/J-38.png',
            '../assets/img/2_character_pepe/3_jump/J-39.png'
        ],

        imagesThrow: [
            '../assets/img/2_character_pepe/6_throw/th_1.png',
            '../assets/img/2_character_pepe/6_throw/th_2.png',
            '../assets/img/2_character_pepe/6_throw/th_3.png',
            '../assets/img/2_character_pepe/6_throw/th_4.png',
            '../assets/img/2_character_pepe/6_throw/th_5.png'
        ],

        imagesHurt: [
            '../assets/img/2_character_pepe/4_hurt/H-41.png',
            '../assets/img/2_character_pepe/4_hurt/H-42.png',
            '../assets/img/2_character_pepe/4_hurt/H-43.png'
        ],

        imagesDead: [
            '../assets/img/2_character_pepe/5_dead/D-51.png',
            '../assets/img/2_character_pepe/5_dead/D-52.png',
            '../assets/img/2_character_pepe/5_dead/D-53.png',
            '../assets/img/2_character_pepe/5_dead/D-54.png',
            '../assets/img/2_character_pepe/5_dead/D-55.png',
            '../assets/img/2_character_pepe/5_dead/D-56.png',
            '../assets/img/2_character_pepe/5_dead/D-57.png'
        ]
    },

    chicken: {
        imagesWalk: [
            '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ],

        imagesDead: [
            '../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        ]
    },

    smallChicken: {
        imagesWalk: [
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ],

        imagesDead: [
            '../assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        ]
    },

    endboss: {
        imagesWalk: [
            '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G4.png'
        ],

        imagesAlert: [
            '../assets/img/4_enemie_boss_chicken/2_alert/G5.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G6.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G7.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G8.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G9.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G10.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G11.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G12.png',
        ],

        imagesAttack: [
            '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G14.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G15.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G16.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G20.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G20.png'
        ],

        imagesAttackRun: [
            '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G4.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G20.png'
        ],

        imagesHurt: [
            '../assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
            '../assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
            '../assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
        ],

        imagesDead: [
            '../assets/img/4_enemie_boss_chicken/5_dead/G24.png',
            '../assets/img/4_enemie_boss_chicken/5_dead/G25.png',
            '../assets/img/4_enemie_boss_chicken/5_dead/G26.png',
        ]

    }
};
