Mets à jour `CLAUDE.md` pour refléter l'état actuel du projet :

1. Lis le `CLAUDE.md` actuel
2. Vérifie les fichiers récemment modifiés (`git diff --name-only HEAD~5`)
3. Mets à jour :
   - La section "Structure clés" si des composants ont changé
   - La section "Todo restant" : coche ce qui est fait, ajoute ce qui est nouveau
   - La section "Architecture" si le flux a changé
4. Commite avec le message : `docs: sync CLAUDE.md`
5. Push sur la branche active

Ne modifie pas les sections "Règles absolues", "Stack technique" ou "Système de design" sauf si elles sont factuellement incorrectes.
