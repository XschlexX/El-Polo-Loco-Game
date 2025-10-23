/**
 * Generiert Flaschen mit Mindestabstand zueinander
 * @param {number} count - Anzahl der Flaschen
 * @param {number} minDistance - Mindestabstand in Pixeln
 * @returns {Array} Array von CollectableBottle Objekten
 */
function generateBottlesWithMinDistance(count, minDistance) {
    const bottles = [];
    const minX = 200;
    const maxX = 1900;

    for (let i = 0; i < count; i++) {
        let newX;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 500; // Mehr Versuche

        while (!validPosition && attempts < maxAttempts) {
            newX = minX + Math.random() * (maxX - minX);
            validPosition = true;

            // Prüfe Abstand zu allen existierenden Flaschen
            for (let bottle of bottles) {
                if (Math.abs(newX - bottle.x) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        // Nur hinzufügen wenn gültige Position gefunden wurde
        if (validPosition) {
            const bottle = new CollectableBottle(newX);
            bottles.push(bottle);
        } else {
            console.warn(`Konnte Flasche ${i + 1} nicht mit Mindestabstand platzieren`);
        }
    }

    return bottles;
}

const level1 = new Level(
    [
        new Cloud(300),
        new Cloud(300 + 1440),
        new Cloud(300 + 1440 * 2),
        new Cloud(300 + 1440 * 3),
        new Cloud(300 + 1440 * 4),
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
        new StatusBar('imagesCoinBar', 2),
        new StatusBar('imagesHealthBarEndboss', 0),
        new StatusBar('imagesHealthBarEndboss', 1),
        new StatusBar('imagesHealthBarEndboss', 2)
    ],
    generateBottlesWithMinDistance(15, 100) // 8 Flaschen mit 200px Mindestabstand

);