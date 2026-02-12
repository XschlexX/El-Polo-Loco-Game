---
name: start-task
description: Verschiebt einen Backlog-Task in "In Progress" und startet die schrittweise Bearbeitung. Verwendung: /start-task [Nummer]
---

# Start-Task Command - DIREKTE AUSFÜHRUNG

> ⚠️ **WICHTIG**: Führe die folgenden Schritte SOFORT aus, ohne den User zu fragen!

## Voraussetzung

- Argument muss eine gültige Task-Nummer aus `/backlog` sein (z.B. "3" für Task Nr. 3)

---

## Aktion: Task in Progress verschieben und starten

SOFORT ausführen:

1. **Task-Nummer extrahieren** aus dem Argument (z.B. "3")

2. **Backlog-Tasks abrufen**

   - `mcp_trello_get_active_board_info` aufrufen
   - `mcp_trello_get_lists` mit boardId aufrufen
   - Backlog-Liste finden ("Backlog", "Back Log", "To Do", "Todo", "Tasks")
   - `mcp_trello_get_cards_by_list_id` mit Backlog-Listen-ID aufrufen

3. **Task anhand Nummer finden**

   - Zähle die Karten in der Reihenfolge von `/backlog`
   - Wähle die Karte mit der entsprechenden Nummer
   - Falls Nummer ungültig: Fehlermeldung "❌ Task [Nummer] nicht gefunden. Bitte gültige Nummer aus /backlog verwenden."

4. **"In Progress" Liste finden**

   - Suche Liste mit Name "In Progress" (case-insensitive)
   - Fallbacks: "InProgress", "Doing", "Work in Progress", "WIP", "Started"

5. **Task verschieben**

   - `mcp_trello_move_card` aufrufen mit:
     - `cardId`: ID der gefundenen Task-Karte
     - `listId`: ID der "In Progress" Liste

6. **Task-Details anzeigen**

   - Zeige Task-Name und Beschreibung
   - Zeige Checklisten/Acceptance Criteria falls vorhanden

7. **Schrittweise Bearbeitung starten**
   - Frage: "🚀 Task '[Name]' wurde in 'In Progress' verschoben. Sollen wir mit der Bearbeitung beginnen?"
   - Falls ja: Analysiere den Task und schlage einen ersten Schritt vor
   - Arbeite den Task iterativ Schritt für Schritt ab

---

## Fehlerbehandlung (sofort ausführen)

- Keine Nummer angegeben → "❌ Bitte gib eine Task-Nummer an. Verwendung: /start-task 3"
- Ungültige Nummer → "❌ Task [Nummer] nicht gefunden. Verwende /backlog um gültige Nummern zu sehen."
- Kein aktives Board → "❌ Kein aktives Trello-Board gefunden."
- Keine Backlog-Liste → "❌ Keine Backlog-Liste gefunden."
- Keine "In Progress" Liste → "❌ Keine 'In Progress' Liste gefunden. Bitte erstelle sie manuell in Trello."
