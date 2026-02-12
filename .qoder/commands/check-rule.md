---
description: Command zu Prüfung ob eine bestimmte Projekt-Regel eingehalten worden ist.
---

## Ausführung bei Command-Aufruf

WENN der User `/check-rule <rule-name>` aufruft, DANN führe die entsprechende Rule-Prüfung DIREKT durch und zeige die ERGEBNISSE an.

### Verfügbare Rule-Namen

| Command         | Zu prüfende Rule           | Rule-Datei                   |
| --------------- | -------------------------- | ---------------------------- |
| `all`           | Alle Rules                 | Alle `.qoder/rules/*.md`     |
| `git`           | Git & Repository Rule      | git-repository-rule.md       |
| `code-quality`  | Code Qualität Rule         | code-quality-rule.md         |
| `naming`        | Namenskonventionen Rule    | naming-conventions-rule.md   |
| `structure`     | Projektstruktur Rule       | project-structure-rule.md    |
| `functionality` | Funktionalität Rule        | functionality-rule.md        |
| `design`        | Design & UI Rule           | design-ui-rule.md            |
| `gameplay`      | Spielmechanik Rule         | gameplay-rule.md             |
| `enemy`         | Gegner & Kollision Rule    | enemy-collision-rule.md      |
| `performance`   | Performance Rule           | performance-rule.md          |
| `sound`         | Sound Manager Rule         | sound-manager-rule.md        |
| `debug`         | Debug & Development Rule   | debug-development-rule.md    |
| `mobile`        | Mobile Touch Rule          | mobile-touch-rule.md         |
| `state`         | Game State Management Rule | game-state-rule.md           |
| `learning`      | Lern- und Erklärungs-Rule  | learning-explanation-rule.md |

### Always-On Rules

Diese Rules sind immer aktiv (`always_on: true`):

- **antwort-rule.md** - Alle Antworten auf Deutsch
- **learning-explanation-rule.md** - Erklärungen mit Hintergrund und Best Practices

### Beispiele

```
/check-rule all          # Prüft alle Rules
/check-rule code-quality # Prüft nur Code-Qualität
/check-rule performance  # Prüft nur Performance
/check-rule mobile       # Prüft nur Mobile Touch
```

## Rule-Check Anweisungen für AI

### WICHTIG: Bei Command-Aufruf SOFORT ausführen!

Wenn der User `/check-rule <name>` eingibt, führe die Prüfung DIREKT durch:

1. Lade die entsprechende Rule-Datei aus `.qoder/rules/`
2. Analysiere den Projekt-Code entsprechend der Rule
3. Zeige die ERGEBNISSE sofort an

### Code-Quality Rule Check

**Prüf-Kriterien:**

- Funktionslänge > 14 Zeilen (HTML ausgenommen)
- Dateien mit > 400 LOCs
- Fehlende JSDoc-Dokumentation

**Durchführung:**

1. Suche alle `.js` Dateien im Projekt
2. Zähle Zeilen pro Funktion (zwischen `{` und `}`)
3. Zähle Gesamt-LOCs pro Datei
4. Prüfe auf `/** ... */` JSDoc-Kommentare vor Funktionen
5. Liste Verstöße mit Dateiname und Zeilennummer

### Performance Rule Check

**Prüf-Kriterien:**

- `setInterval` ohne entsprechendes `clearInterval`
- Keine `requestAnimationFrame` Nutzung für Animationen
- Fehlende `.splice()` zum Entfernen von Objekten

**Durchführung:**

1. Suche nach `setInterval` Patterns
2. Suche nach zugehörigen `clearInterval` Aufrufen
3. Prüfe Animation-Loops auf `requestAnimationFrame`
4. Suche nach Array-Operationen (splice, filter)

### Structure Rule Check

**Prüf-Kriterien:**

- Ordner `classes/`, `templates/`, `img/` vorhanden
- `index.html` existiert
- Kein statischer HTML-Code in JS-Dateien

**Durchführung:**

1. Prüfe Ordnerstruktur mit `list_dir`
2. Suche nach `index.html`
3. Suche nach HTML-Strings in `.js` Dateien

### Weitere Rules

Analoge Prüfung für:

- `git` - .gitignore, Commit-Historie
- `naming` - camelCase, PascalCase Konventionen
- `functionality` - console.log, fehlerhafte Links
- `design` - Favicon, cursor:pointer
- `gameplay` - Idle-Animation, Statusbar-Updates
- `enemy` - Kollisions-Offsets
- `sound` - muted-Status Prüfung
- `debug` - Debug-Overlay vorhanden
- `mobile` - Touch-Event Handler
- `state` - Game-State Management
- `learning` - Erklärungen vorhanden

### Ausgabe-Format

```
=== RULE CHECK: <Rule-Name> ===

✅ Erfüllt:
  - Punkt 1
  - Punkt 2

⚠️ Warnungen:
  - Datei.js:123 - Beschreibung

❌ Verstöße:
  - Datei.js:45 - Beschreibung

=== ZUSAMMENFASSUNG ===
Status: ✅ Bestanden / ⚠️ Warnungen / ❌ Fehler
```

### Legende

- ✅ = Rule eingehalten
- ⚠️ = Warnung (empfohlene Verbesserung)
- ❌ = Rule verletzt (muss behoben werden)

## Rule-Datei Format

Jede Rule-Datei folgt diesem Format:

```markdown
---
description: Kurze Beschreibung der Rule
always_on: true # Optional: Rule ist immer aktiv
---

## Rule-Name

- Regel-Punkt 1
- Regel-Punkt 2
- Regel-Punkt 3
```
