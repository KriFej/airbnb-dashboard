#!/bin/bash
# Chronomètre automatique pour les estimations de temps
# Usage: chrono.sh start "nom de la tâche"
#        chrono.sh stop "nom de la tâche" "estimation initiale"

TMPFILE="/tmp/claude_chrono.txt"
LOGFILE="$(dirname "$0")/leconhorloge.md"
TZ="Europe/Paris"

case "$1" in
  start)
    TASK="${2:-tâche}"
    START=$(date +%s)
    echo "$START|$TASK" > "$TMPFILE"
    echo "⏱️  Chrono démarré : $TASK ($(TZ=$TZ date '+%H:%M:%S'))"
    ;;

  stop)
    TASK="${2:-tâche}"
    ESTIMATE="${3:-?}"

    if [ ! -f "$TMPFILE" ]; then
      echo "Erreur : pas de chrono démarré."
      exit 1
    fi

    DATA=$(cat "$TMPFILE")
    START=$(echo "$DATA" | cut -d'|' -f1)
    END=$(date +%s)
    ELAPSED=$(( (END - START) / 60 ))
    ELAPSED_S=$(( (END - START) % 60 ))
    DATE=$(TZ=$TZ date '+%Y-%m-%d')

    echo "✅ Terminé : $TASK"
    echo "   Temps réel : ${ELAPSED}m ${ELAPSED_S}s"
    echo "   Estimé     : $ESTIMATE"

    # Calculer l'écart
    EST_NUM=$(echo "$ESTIMATE" | grep -o '[0-9]*' | head -1)
    if [ -n "$EST_NUM" ]; then
      ECART=$(( ELAPSED - EST_NUM ))
      if [ $ECART -gt 2 ] || [ $ECART -lt -2 ]; then
        echo "   ⚠️  Écart de ${ECART} min — log dans leconhorloge.md"
        echo "| $DATE | $TASK | $ESTIMATE min | ${ELAPSED} min | ${ECART} min | À analyser |" >> "$LOGFILE"
      else
        echo "   ✅ Bonne estimation !"
      fi
    fi

    rm -f "$TMPFILE"
    ;;

  *)
    echo "Usage: chrono.sh start|stop <tâche> [estimation_en_min]"
    ;;
esac
