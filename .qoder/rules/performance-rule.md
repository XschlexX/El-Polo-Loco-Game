---
description: Performance Rule - Memory Management, Preloading und Cleanup
always_on: true
---

## Performance Rule

- Intervalle müssen sauber aufgeräumt werden (keine Memory Leaks)
- Bilder/Assets vorladen (preload) für flüssigere Animationen
- Nicht benötigte Objekte aus dem Array entfernen (z.B. tote Gegner, verbrauchte Flaschen)
- requestAnimationFrame für Animationen bevorzugen
