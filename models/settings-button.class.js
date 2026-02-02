class SettingsButton extends DrawableObject {
    width = 30;
    height = 30;
    x = 720 - 60; // 60px vom rechten Rand
    y = 50; // Oben rechts
    world;
    isHovered = false;

    constructor() {
        super();
    }

    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;

        // Zeichne runden Button-Hintergrund
        ctx.fillStyle = this.isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Zeichne runden Rahmen
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Zeichne Hamburger-Menu-Icon (drei horizontale Linien)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const lineWidth = 12;
        const lineSpacing = 4;

        // Obere Linie
        ctx.beginPath();
        ctx.moveTo(centerX - lineWidth / 2, centerY - lineSpacing);
        ctx.lineTo(centerX + lineWidth / 2, centerY - lineSpacing);
        ctx.stroke();

        // Mittlere Linie
        ctx.beginPath();
        ctx.moveTo(centerX - lineWidth / 2, centerY);
        ctx.lineTo(centerX + lineWidth / 2, centerY);
        ctx.stroke();

        // Untere Linie
        ctx.beginPath();
        ctx.moveTo(centerX - lineWidth / 2, centerY + lineSpacing);
        ctx.lineTo(centerX + lineWidth / 2, centerY + lineSpacing);
        ctx.stroke();
    }

    isClicked(mouseX, mouseY) {
        // Prüfe ob Klick innerhalb des Kreises liegt
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        // Wenn das Victory-Overlay sichtbar ist, ist der Button nicht klickbar
        if (this.world.defeatOverlay.isVisible || this.world.victoryOverlay.isVisible) {
            return false;
        }
        return distance <= radius;
    }

    isHovering(mouseX, mouseY) {
        // Prüfe ob Maus innerhalb des Kreises liegt
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        this.isHovered = distance <= radius;

        if (this.world.defeatOverlay.isVisible || this.world.victoryOverlay.isVisible) {
            return false;
        }
        return this.isHovered;
    }
}
