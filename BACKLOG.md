# Backlog — Weathora

> Ce fichier liste les améliorations identifiées suite à une phase de tests fonctionnels et sécurité approfondie (~110 cas testés sur 5 modules).
> Les priorités sont classées par criticité (🔴 haute, 🟡 moyenne, 🟢 basse).

---

## 🔴 Priorité haute

### Sécurité & Authentification

- [ ] **Persistance de session** — Le refresh (F5) ou la fermeture du navigateur déconnecte l'utilisateur malgré la présence du token dans le Local Storage. À investiguer : `persistSession`, `onAuthStateChange`, erreurs `400 ant_type=password` dans la console.
- [ ] **Validation email côté serveur** — Ajouter une regex stricte exigeant un TLD (`.com`, `.fr`, etc.). Actuellement la validation native du navigateur accepte `test@domaine` sans extension.
- [ ] **Intégration d'un captcha** — Mettre en place Cloudflare Turnstile sur les pages Connexion et Inscription pour se protéger contre le brute force et le credential stuffing.

### Déploiement

- [ ] **Synchroniser la branche de production avec les correctifs déjà présents sur la branche dev** :
  - Whitelist des caractères autorisés dans le pseudo (anti-XSS)
  - Vérification d'unicité du pseudo à l'inscription
  - Règles de mot de passe strictes (minimum 8 caractères + caractère spécial)

---

## 🟡 Priorité moyenne

### UX / Recherche de ville

- [ ] Déclencher l'autocomplétion à partir de 2-3 caractères au lieu d'1 seul (économie d'appels API)
- [ ] Limiter la longueur de l'input recherche avec `maxLength={50}` (protection contre les chaînes excessives)
- [ ] Désactiver visuellement le bouton de recherche si le champ est vide

### Données / Favoris

- [ ] Corriger la vérification d'unicité des favoris : actuellement basée uniquement sur le nom de ville, ce qui empêche d'ajouter deux villes homonymes (ex. Sainte-Marie La Réunion + Sainte-Marie Martinique). Utiliser une clé composite `(city_name, department)`.

### UX / Authentification

- [ ] Normaliser les emails côté front avant envoi : `email.trim().toLowerCase()`. Actuellement, `TEST100@GMAIL.COM` ou `" test100@gmail.com "` sont refusés à la connexion.

### Conversion

- [ ] Ajouter un lien explicite vers la page Premium dans le message « Maximum 3 favoris atteint » pour transformer la limite en opportunité de conversion.

---

## 🟢 Priorité basse / Long terme

### Communication

- [ ] Configurer un SMTP custom (Resend ou SendGrid) pour les emails transactionnels
- [ ] Activer la vérification d'email à l'inscription via lien de confirmation
- [ ] Implémenter la fonctionnalité « Mot de passe oublié »

### UX / Sécurité renforcée

- [ ] Ajouter un indicateur visuel de force du mot de passe (jauge faible / moyen / fort)
- [ ] Ajouter un toast « Annuler » après la suppression d'un favori (éviter les suppressions accidentelles)

### Performance

- [ ] Optimiser le composant Image du logo : ajouter la prop `sizes` (warning Next.js)

### Architecture

- [ ] Migration éventuelle vers `@supabase/ssr` + cookies `HttpOnly` (si l'app gère un jour des données plus sensibles)

---

## 📋 Tests à mener

- [ ] Audit accessibilité (Lighthouse, axe DevTools)
- [ ] Audit performance (PageSpeed Insights, Core Web Vitals)
- [ ] Mise en place de tests E2E automatisés (Cypress ou Playwright)
- [ ] Test pratique du trigger SQL `enforce_favorites_limit` via DevTools (validation effective du blocage de bypass)

---

## ✅ Déjà corrigé / mis en place

### Sécurité

- [x] **Régénération complète des clés API Supabase** (anon + service_role)
- [x] **Trigger SQL `enforce_favorites_limit`** créé pour bloquer l'ajout de favoris au-delà de 3 côté serveur (anti-bypass de la limite Premium)
- [x] **Rate limiting Supabase Auth** configuré (5 requêtes / 5 minutes / IP sur sign-up et sign-in)
- [x] **Row Level Security (RLS)** activée et configurée sur la table `favorites` avec policies SELECT, INSERT, DELETE basées sur `auth.uid() = profiles_id`
- [x] **Whitelist des caractères du pseudo** (lettres, chiffres, `-`, `_`) — anti-XSS persistant (sur branche dev)
- [x] **Vérification d'unicité du pseudo** à l'inscription (sur branche dev)
- [x] **Règles de mot de passe strictes** : minimum 8 caractères + 1 caractère spécial obligatoire (sur branche dev)

### Tests réalisés (résumé)

| Module               | Cas testés | Résultats                                   |
| -------------------- | ---------- | ------------------------------------------- |
| Recherche de ville   | 22         | 19 OK / 3 améliorations mineures            |
| Inscription          | 35         | 19 OK / 1 amélioration                      |
| Connexion            | 20         | 16 OK / 2 améliorations / 2 bugs            |
| Favoris              | 23         | 18 OK / 1 bug d'unicité / 1 faille corrigée |
| Premium (page promo) | 11         | 10 OK / 1 amélioration UX                   |
| **Total**            | **111**    | **82 OK**                                   |

### Démarche sécurité (inspirée du OWASP Top 10)

- **A01 — Broken Access Control** : RLS Supabase configurée, accès aux favoris restreint à leur propriétaire
- **A02 — Cryptographic Failures** : HTTPS + HSTS activés, mot de passe jamais retourné dans les réponses API
- **A03 — Injection** : Validation et échappement automatique par React, whitelist sur le pseudo, validation email
- **A05 — Security Misconfiguration** : Headers de sécurité Supabase vérifiés (X-Content-Type-Options, Strict-Transport-Security)
- **A07 — Identification and Authentication Failures** : Rate limit configuré, message d'erreur générique uniforme empêchant l'énumération de comptes

---

_Dernière mise à jour : mai 2026_
