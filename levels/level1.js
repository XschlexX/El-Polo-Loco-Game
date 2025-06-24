const level1 = new Level(
    [
        new Cloud()
    ],
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new BackgroundObject('../assets/img/5_background/layers/air.png', -1440),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png', -1440),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png', -1440),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png', -1440),
        new BackgroundObject('../assets/img/5_background/layers/air.png', -720),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', -720),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', -720),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', -720),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 720),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', 720),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 1440),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png', 1440),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png', 1440),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png', 1440),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 2160),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', 2160),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', 2160),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', 2160),
    ],
    [
        new StatusBar('imagesHealthBar', 0),
        new StatusBar('imagesHealthBar', 1),
        new StatusBar('imagesHealthBar', 2),
        new StatusBar('imagesBottleBar', 0),
        new StatusBar('imagesBottleBar', 1),
        new StatusBar('imagesBottleBar', 2),
        new StatusBar('imagesCoinBar', 0),
        new StatusBar('imagesCoinBar', 1),
        new StatusBar('imagesCoinBar', 2)
    ]

);