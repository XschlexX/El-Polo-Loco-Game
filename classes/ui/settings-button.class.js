/**
 * Circular settings button rendered on the canvas with a hamburger-menu icon.
 * Supports hover highlighting and click detection.
 * @extends DrawableObject
 */
class SettingsButton extends DrawableObject {
    width = 30;
    height = 30;
    x = 720 - 60;
    y = 50;
    isHovered = false;

    constructor() {
        super();
    }

    /**
     * Draws the circular button with a hamburger-menu icon on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;

        ctx.fillStyle = this.isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const lineWidth = 12;
        const lineSpacing = 4;

        ctx.beginPath();
        ctx.moveTo(centerX - lineWidth / 2, centerY - lineSpacing);
        ctx.lineTo(centerX + lineWidth / 2, centerY - lineSpacing);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - lineWidth / 2, centerY);
        ctx.lineTo(centerX + lineWidth / 2, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - lineWidth / 2, centerY + lineSpacing);
        ctx.lineTo(centerX + lineWidth / 2, centerY + lineSpacing);
        ctx.stroke();
    }

    /**
     * Checks whether a click falls within the circular button area.
     * Returns false when the victory or defeat overlay is visible.
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     * @returns {boolean} True if the button was clicked
     */
    isClicked(mouseX, mouseY) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        if (window.world.defeatOverlay.isVisible || window.world.victoryOverlay.isVisible) {
            return false;
        }
        return distance <= radius;
    }

    /**
     * Checks whether the mouse is hovering over the circular button area.
     * Updates the isHovered state and returns false when an overlay is visible.
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     * @returns {boolean} True if the button is being hovered
     */
    isHovering(mouseX, mouseY) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        this.isHovered = distance <= radius;

        if (window.world.defeatOverlay.isVisible || window.world.victoryOverlay.isVisible) {
            return false;
        }
        return this.isHovered;
    }
}
