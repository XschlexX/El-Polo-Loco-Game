# Interval Tracking Guide

## Übersicht

Alle `setInterval`-Aufrufe in deinem Spiel werden jetzt zentral vom **GlobalIntervalManager** verwaltet. Dies ermöglicht es dir, alle aktiven Intervals zu überwachen und zu debuggen.

## Verwendung in der Console

### 1. Status-Report anzeigen

```javascript
window.intervalManager.printStatus();
```

Zeigt eine formatierte Übersicht aller aktiven Intervals mit:

- Anzahl aktiver Intervals
- Gruppierung nach Besitzer (Character, Endboss, Chicken, etc.)
- Details zu jedem Interval (Name, Delay, Erstellungszeit)

### 2. Statistiken abrufen

```javascript
window.intervalManager.getStats();
```

Gibt ein Objekt mit Statistiken zurück:

```javascript
{
  totalActive: 15,
  totalRegistered: 20,
  byOwner: {
    Character: 4,
    Endboss: 2,
    Chicken: 6,
    World: 2
  },
  intervals: [...]
}
```

### 3. Aktive Intervals auflisten

```javascript
window.intervalManager.getActive();
```

Gibt ein Array aller aktiven Intervals zurück.

### 4. Alle Intervals anzeigen

```javascript
console.log(window.intervalManager.intervals);
```

Zeigt das komplette intervals-Objekt mit allen Details.

### 5. Alle Intervals stoppen (für Debug-Zwecke)

```javascript
window.intervalManager.clearAll();
```

⚠️ **Achtung**: Stoppt ALLE Intervals im gesamten Spiel!

## Beispiel-Output

Wenn du `window.intervalManager.printStatus()` aufrufst, siehst du etwa:

```
╔════════════════════════════════════════════════════════════════╗
║         GLOBAL INTERVAL MANAGER - STATUS REPORT                ║
╚════════════════════════════════════════════════════════════════╝

📊 SUMMARY:
   Total Active Intervals: 18
   Total Registered: 18

🎯 BY OWNER:
   Character: 4
   World: 2
   Endboss: 2
   Chicken: 4
   ChickenSmall: 2
   Cloud: 2
   ThrowableObject: 2

📋 DETAILS:
   1. Character sleep reset check
      Owner: Character | Delay: 100ms
      Created: 17:05:23
   2. Character sound control
      Owner: Character | Delay: 100ms
      Created: 17:05:23
   ...
```

## Nützliche Debug-Szenarien

### Performance-Probleme untersuchen

```javascript
// Prüfe ob zu viele Intervals aktiv sind
const stats = window.intervalManager.getStats();
console.log(`${stats.totalActive} aktive Intervals`);
```

### Memory Leaks finden

```javascript
// Vergleiche vorher/nachher
const before =
  window.intervalManager.getStats().totalActive;
// ... mache etwas im Spiel ...
const after = window.intervalManager.getStats().totalActive;
console.log(`Interval-Differenz: ${after - before}`);
```

### Welches Objekt hat die meisten Intervals?

```javascript
const stats = window.intervalManager.getStats();
console.table(stats.byOwner);
```

## Automatisches Tracking

Alle `setInterval`-Aufrufe werden automatisch registriert:

- ✅ Character-Bewegung und Animation
- ✅ Gegner-Bewegung und Animation
- ✅ Endboss-Kampfsystem
- ✅ Welt-Kollisionsprüfungen
- ✅ Werfbare Objekte
- ✅ Sammelbare Objekte
- ✅ Wolken-Animation

Keine manuelle Registrierung erforderlich!
