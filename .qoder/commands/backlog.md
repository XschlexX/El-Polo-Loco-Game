---
name: backlog
description: Führt sofort Trello Backlog Aktion aus - zeigt Tasks an oder erstellt neue Karte
---

# Backlog Command - DIREKTE AUSFÜHRUNG

> ⚠️ **WICHTIG**: Führe die folgenden Schritte SOFORT aus, ohne den User zu fragen!

## Bedingung prüfen

**Falls KEIN Argument übergeben wurde:** → Führe "Anzeigen" aus
**Falls Argument übergeben wurde:** → Führe "Erstellen" aus

---

## Aktion: Anzeigen (kein Argument)

SOFORT ausführen:

1. `mcp_trello_get_active_board_info` aufrufen
2. `mcp_trello_get_lists` mit der boardId aufrufen
3. **Auto-Formatierung durchführen:**
   - Für **ALLE Listen** auf dem Board:
     - `mcp_trello_get_cards_by_list_id` aufrufen
     - Jeden Task prüfen und ggf. formatieren (siehe "Auto-Formatierung")
4. **Backlog anzeigen:**
   - Liste finden mit Name "Backlog" (case-insensitive) oder Fallbacks: "Back Log", "To Do", "Todo", "Tasks"
   - `mcp_trello_get_cards_by_list_id` mit der Listen-ID aufrufen (frisch formatiert)
5. Ergebnis anzeigen:
   ```
   ## Backlog Tasks (X Tasks gefunden)
   1. [Task-Name]
   2. [Task-Name]
   ...
   ```

## Auto-Formatierung von Tasks

Beim Durchsuchen prüfe jeden Task-Titel:

**Gültige Präfixe (keine Änderung nötig):**

- `🔴 [Bug]`
- `[Chicken]`
- `[Endboss]`
- `[Feature]`
- `[Performance]`
- `[Refactor]`
- `[UI]`

**Wenn Titel KEIN gültiges Präfix hat:**

- Analysiere den Task-Inhalt (Name + Beschreibung)
- Weise die passende Kategorie zu
- Aktualisiere den Task-Titel mit `mcp_trello_update_card_details`

**Kategorie-Erkennung (Schlüsselwörter im Titel/Beschreibung):**

| Kategorie       | Schlüsselwörter                                                           |
| --------------- | ------------------------------------------------------------------------- |
| `🔴 [Bug]`      | bug, fehler, error, crash, fix, problem, issue, kaputt, nicht funktionier |
| `[Chicken]`     | chicken, huhn, küken, gegner klein                                        |
| `[Endboss]`     | endboss, boss, final, gegner groß                                         |
| `[Feature]`     | feature, neu, hinzufügen, implementieren, erstellen, new                  |
| `[Performance]` | performance, optimierung, schneller, lag, fps, memory, leak               |
| `[Refactor]`    | refactor, umbauen, aufräumen, code, struktur, clean                       |
| `[UI]`          | ui, design, button, screen, overlay, layout, style, css                   |

**Fallback:** Wenn keine Kategorie passt → `[Feature]`

**Formatierung anwenden:**

```
Neuer Titel: "[Kategorie] Originaler Titel"
```

Beispiel: "Loading Spinner einbauen" → "[UI] Loading Spinner einbauen"

---

## Aktion: Erstellen (mit Argument)

SOFORT ausführen:

1. Titel = übergebenes Argument (alles nach "/backlog ")
2. `mcp_trello_get_active_board_info` aufrufen
3. `mcp_trello_get_lists` mit der boardId aufrufen
4. Liste finden mit Name "Backlog" oder Fallbacks
5. `mcp_trello_add_card_to_list` aufrufen mit:

   - listId: ID der gefundenen Liste
   - name: Titel
   - description: |

     ```
     ## Task: [Titel]

     ### Beschreibung
     [Detailed description of the task]

     ### Aufgaben
     - [ ] Aufgabe 1
     - [ ] Aufgabe 2
     - [ ] Aufgabe 3
     ```

6. Bestätigung anzeigen: "✅ Backlog-Karte '[Titel]' erstellt: [URL]"

---

## Formatierungsregel für Task-Titel

Alle Tasks müssen folgendes Format verwenden:

```
[Kategorie] Beschreibung
```

**Verfügbare Kategorien:**

- `🔴 [Bug]` - Fehlerbehebung (immer mit rotem Punkt)
- `[Chicken]` - Gegner: Chicken
- `[Endboss]` - Gegner: Endboss
- `[Feature]` - Neue Features
- `[Performance]` - Performance-Optimierung
- `[Refactor]` - Code-Refactoring
- `[UI]` - Benutzeroberfläche

**Beispiele:**

- `🔴 [Bug] Intervalle laufen weiter nach Restart Game`
- `[UI] Loading Spinner bei Start Game einbauen`
- `[Feature] Level 2 erstellen`

---

## Fehlerbehandlung (sofort ausführen)

- Kein aktives Board → "❌ Kein aktives Trello-Board gefunden."
- Keine Backlog-Liste → "❌ Keine Backlog-Liste gefunden."
- Backlog-Liste leer → "ℹ️ Die Backlog-Liste enthält keine Tasks."
- Kein Titel beim Erstellen → "❌ Bitte gib einen Titel an. Beispiel: /backlog Mein Task"
