/**
 * Manages preloading of all game image and sound assets.
 * Collects paths from game classes and loads them with progress tracking.
 */
class AssetLoader {
    constructor() {
        this.imagePaths = new Set();
        this.soundPaths = new Set();
        this.loadedImages = 0;
        this.loadedSounds = 0;
        this.totalAssets = 0;
        this.onProgress = null;
        this.onComplete = null;
    }

    /**
     * Collects all image paths from the global imagePaths registry.
     * Iterates the two-level structure (entity → animation set → paths).
     */
    collectImagePaths() {
        Object.values(imagePaths).forEach(entity => {
            Object.values(entity).forEach(paths => {
                if (Array.isArray(paths)) {
                    paths.forEach(path => {
                        if (path) this.imagePaths.add(path);
                    });
                }
            });
        });
    }

    /**
     * Collects all sound paths from the global SoundManager instance.
     */
    collectSoundPaths() {
        if (window.soundManager && window.soundManager.sounds) {
            Object.values(window.soundManager.sounds).forEach(audio => {
                if (audio && audio.src) {
                    this.soundPaths.add(audio.src);
                }
            });
        }
    }

    /**
     * Starts loading all collected image and sound assets.
     * @param {Function} onProgress - Progress callback receiving (loaded, total, percentage)
     * @param {Function} onComplete - Callback invoked when all assets are loaded
     */
    loadAll(onProgress, onComplete) {
        this.onProgress = onProgress;
        this.onComplete = onComplete;

        this.collectImagePaths();
        this.collectSoundPaths();

        this.totalAssets = this.imagePaths.size + this.soundPaths.size;
        this.loadedImages = 0;
        this.loadedSounds = 0;

        if (this.totalAssets === 0) {
            if (this.onComplete) this.onComplete();
            return;
        }

        this.loadImages();
        this.loadSounds();
    }

    /**
     * Loads all collected images, storing them in the global image cache.
     */
    loadImages() {
        this.imagePaths.forEach(path => this.loadSingleImage(path));
    }

    /**
     * Loads a single image, using cache if available.
     * @param {string} path - Image file path
     */
    loadSingleImage(path) {
        if (DrawableObject.globalImageCache?.[path]) {
            this.loadedImages++;
            this.updateProgress();
            return;
        }
        const img = new Image();
        img.onload = () => this.onImageLoaded(path, img);
        img.onerror = () => this.onImageError(path);
        img.src = path;
    }

    /**
     * Called when an image loads successfully.
     * @param {string} path - Image file path
     * @param {HTMLImageElement} img - Loaded image element
     */
    onImageLoaded(path, img) {
        this.loadedImages++;
        if (DrawableObject.globalImageCache) {
            DrawableObject.globalImageCache[path] = img;
        }
        this.updateProgress();
    }

    /**
     * Called when an image fails to load.
     * @param {string} path - Image file path
     */
    onImageError(path) {
        console.warn(`Bild konnte nicht geladen werden: ${path}`);
        this.loadedImages++;
        this.updateProgress();
    }

    /**
     * Loads all collected sounds, storing them in the global sound cache.
     */
    loadSounds() {
        this.soundPaths.forEach(path => this.loadSingleSound(path));
    }

    /**
     * Loads a single sound, using cache if available.
     * @param {string} path - Sound file path
     */
    loadSingleSound(path) {
        if (SoundManager.globalSoundCache?.[path]) {
            this.loadedSounds++;
            this.updateProgress();
            return;
        }
        const audio = new Audio();
        audio.oncanplaythrough = () => this.onSoundLoaded(path, audio);
        audio.onerror = () => this.onSoundError(path);
        audio.src = path;
        audio.load();
    }

    /**
     * Called when a sound loads successfully.
     * @param {string} path - Sound file path
     * @param {HTMLAudioElement} audio - Loaded audio element
     */
    onSoundLoaded(path, audio) {
        this.loadedSounds++;
        if (SoundManager.globalSoundCache) {
            SoundManager.globalSoundCache[path] = audio;
        }
        this.updateProgress();
    }

    /**
     * Called when a sound fails to load.
     * @param {string} path - Sound file path
     */
    onSoundError(path) {
        console.warn(`Sound konnte nicht geladen werden: ${path}`);
        this.loadedSounds++;
        this.updateProgress();
    }

    /**
     * Updates loading progress and invokes callbacks.
     */
    updateProgress() {
        const loaded = this.loadedImages + this.loadedSounds;
        const total = this.totalAssets;
        const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;

        if (this.onProgress) {
            this.onProgress(loaded, total, percentage);
        }

        if (loaded >= total && this.onComplete) {
            this.onComplete();
        }
    }

}
