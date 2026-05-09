# /sync-md — Mise à jour du todo locpilote

Lis `.claude/todo-locpilote.md` en entier, puis mets-le à jour en fonction de ce qui a été accompli dans la conversation courante.

## Règles

- Cocher `[x]` les tâches terminées (avec date courte en commentaire si possible)
- Ne jamais supprimer de tâche — juste les cocher
- Ajouter les nouvelles tâches découvertes pendant la session dans la bonne catégorie
- Conserver exactement la structure et le format du fichier existant
- Écrire une ligne de résumé en bas : `> Dernière sync : JJ/MM/AAAA — X tâches complétées`

## Ce qui est considéré comme "terminé"

- L'utilisateur dit "c'est fait", "ok", "done", "ça marche"
- Une clé API a été fournie et configurée
- Une étape a été confirmée visuellement (screenshot)

Après la mise à jour, afficher uniquement les tâches cochées pendant cette session.
