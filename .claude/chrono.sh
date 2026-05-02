#!/bin/bash
# Chronomètre avec pause — ne compte que le temps actif
# Usage: chrono.sh start "nom"
#        chrono.sh pause "nom"
#        chrono.sh resume "nom"
#        chrono.sh stop "nom" "estimation_min"

TMPFILE="/tmp/claude_chrono.txt"
LOGFILE="$(dirname "$0")/leconhorloge.md"
TZ="Europe/Paris"

case "$1" in
  start)
    TASK="${2:-tâche}"
    NOW=$(date +%s)
    # Format: START|TASK|ACCUMULATED_SECONDS|PAUSED(0/1)
    echo "$NOW|$TASK|0|0" > "$TMPFILE"
    echo "⏱️  Chrono démarré : $TASK ($(TZ=$TZ date '+%H:%M:%S'))"
    ;;

  pause)
    if [ ! -f "$TMPFILE" ]; then echo "Erreur : pas de chrono démarré."; exit 1; fi
    DATA=$(cat "$TMPFILE")
    SEGMENT_START=$(echo "$DATA" | cut -d'|' -f1)
    TASK=$(echo "$DATA" | cut -d'|' -f2)
    ACCUMULATED=$(echo "$DATA" | cut -d'|' -f3)
    NOW=$(date +%s)
    NEW_ACC=$(( ACCUMULATED + NOW - SEGMENT_START ))
    echo "$NOW|$TASK|$NEW_ACC|1" > "$TMPFILE"
    echo "⏸️  Chrono en pause : $TASK ($(TZ=$TZ date '+%H:%M:%S')) — accumulé : $(( NEW_ACC / 60 ))m $(( NEW_ACC % 60 ))s"
    ;;

  resume)
    if [ ! -f "$TMPFILE" ]; then echo "Erreur : pas de chrono démarré."; exit 1; fi
    DATA=$(cat "$TMPFILE")
    TASK=$(echo "$DATA" | cut -d'|' -f2)
    ACCUMULATED=$(echo "$DATA" | cut -d'|' -f3)
    NOW=$(date +%s)
    echo "$NOW|$TASK|$ACCUMULATED|0" > "$TMPFILE"
    echo "▶️  Chrono repris : $TASK ($(TZ=$TZ date '+%H:%M:%S'))"
    ;;

  stop)
    TASK="${2:-tâche}"
    ESTIMATE="${3:-?}"

    if [ ! -f "$TMPFILE" ]; then echo "Erreur : pas de chrono démarré."; exit 1; fi

    DATA=$(cat "$TMPFILE")
    SEGMENT_START=$(echo "$DATA" | cut -d'|' -f1)
    ACCUMULATED=$(echo "$DATA" | cut -d'|' -f3)
    PAUSED=$(echo "$DATA" | cut -d'|' -f4)
    NOW=$(date +%s)

    # Si pas en pause, ajouter le segment en cours
    if [ "$PAUSED" = "0" ]; then
      TOTAL=$(( ACCUMULATED + NOW - SEGMENT_START ))
    else
      TOTAL=$ACCUMULATED
    fi

    ELAPSED=$(( TOTAL / 60 ))
    ELAPSED_S=$(( TOTAL % 60 ))
    DATE=$(TZ=$TZ date '+%Y-%m-%d')

    echo "✅ Terminé : $TASK"
    echo "   Temps réel : ${ELAPSED}m ${ELAPSED_S}s (hors pauses)"
    echo "   Estimé     : $ESTIMATE"

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
    echo "Usage: chrono.sh start|pause|resume|stop <tâche> [estimation_min]"
    ;;
esac
