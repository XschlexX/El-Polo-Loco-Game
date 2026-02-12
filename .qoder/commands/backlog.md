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
3. Liste finden mit Name "Backlog" (case-insensitive) oder Fallbacks: "Back Log", "To Do", "Todo", "Tasks"
4. `mcp_trello_get_cards_by_list_id` mit der Listen-ID aufrufen
5. Ergebnis anzeigen:
   ```
   ## Backlog Tasks (X Tasks gefunden)
   1. [Task-Name]
   2. [Task-Name]
   ...
   ```

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

## Fehlerbehandlung (sofort ausführen)

- Kein aktives Board → "❌ Kein aktives Trello-Board gefunden."
- Keine Backlog-Liste → "❌ Keine Backlog-Liste gefunden."
- Liste leer → "ℹ️ Die Backlog-Liste enthält keine Tasks."
- Kein Titel beim Erstellen → "❌ Bitte gib einen Titel an. Beispiel: /backlog Mein Task"
