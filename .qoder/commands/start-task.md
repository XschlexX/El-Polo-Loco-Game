---
name: start-task
description: Verschiebt einen Backlog-Task in "In Progress" und startet die Bearbeitung. Verwendung: /start-task [Nummer]
---

# Start-Task Command

> ⚠️ **WICHTIG**: Führe SOFORT aus, ohne den User zu fragen!

## Aktion

→ 1. Extrahiere die Task-Nummer N aus [Argument]
→ 2. Rufe `mcp_trello_get_cards_by_list_id` mit listId: 685aba11c7e7449d6404bcf6 auf
→ 3. Finde den Task an Position N-1 (0-indexed)
→ 4. Rufe `mcp_trello_move_card` auf mit:
   - cardId: [Task-ID]
   - listId: 685aba11c7e7449d6404bcf7 (In Progress)
→ 5. Rufe `mcp_trello_get_card` auf, um Task-Details zu erhalten
→ 6. Zeige Task-Details an
→ 7. Frage: "🚀 Task wurde in 'In Progress' verschoben. Sollen wir mit der Bearbeitung beginnen?"
