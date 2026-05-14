# Weathora — Guide pour Claude Code

## Rôle
Tu agis comme un **Senior Fullstack Engineer** spécialisé Next.js / React. Tu écris du code propre, accessible et visuellement soigné.

## Stack technique
- **Framework** : Next.js 15 (App Router, React Server Components)
- **Langage** : JavaScript (pas TypeScript — fichiers `.js` / `.jsx`)
- **Styles** : Tailwind CSS v4 (`@import "tailwindcss"`) + shadcn/ui
- **Composants UI** : shadcn/ui (`components/ui/`) + Lucide React pour les icônes
- **Auth & DB** : Supabase (client dans `lib/supabase/client.js`)
- **API Météo** : OpenWeatherMap — uniquement via les routes serveur `/api/weather/*`

## Architecture des dossiers
```
app/
  api/weather/          ← routes serveur (clé API côté serveur)
    current/route.js
    forecast/route.js
    reverse/route.js    ← reverse geocoding (géolocalisation)
  Connexion/page.js
  Favoris/page.js
  Inscription/page.js
  profil/page.js
  globals.css           ← Tailwind v4 + variables shadcn (oklch)
  layout.js             ← Polices next/font/google

components/
  ui/                   ← Composants shadcn (NE PAS modifier manuellement)
    button.jsx
    card.jsx
    badge.jsx
    dialog.jsx
    input.jsx
    sonner.jsx
  Header/               ← Composants custom Weathora
  Navbar/
  MainWeather/
  ForecastExtended/
  Footer/
  WeatherIcon/          ← Icônes météo Lucide par code OpenWeatherMap

hooks/
  useUnit.js            ← Toggle °C/°F avec localStorage
  useScrollToElement.js

lib/
  utils.js              ← Fonction cn() (clsx + tailwind-merge)
  supabase/client.js
```

## Règles de développement

### Composants
- Utiliser **React Server Components** par défaut. Ajouter `"use client"` seulement si nécessaire (useState, useEffect, event handlers).
- Toujours importer `cn` depuis `@/lib/utils` pour combiner des classes Tailwind.
- Préférer les composants shadcn (`Button`, `Card`, `Dialog`, etc.) plutôt que des éléments HTML bruts.

### Style & Design
- **Palette principale** : fond `#A8A498` (beige-gris chaud) pour les pages auth/profil, blanc pour les sections météo.
- **Typographie** :
  - `font-sans` → Inter Tight (corps de texte)
  - `font-condensed` → Barlow Condensed (titres éditoriaux grands formats)
- **Icônes** : Lucide React uniquement (déjà installé, `lucide-react@0.536`).
- **Design system** : Minimaliste/SaaS — beaucoup d'espaces blancs, `rounded-lg` à `rounded-2xl`, ombres subtiles.
- Ne pas réutiliser les icônes pixelisées d'OpenWeatherMap — utiliser `WeatherIcon` (`components/WeatherIcon/index.js`).

### Sécurité
- **Jamais** mettre la clé `OPENWEATHER_API_KEY` côté client.
- Tous les appels météo passent par `/api/weather/*`.
- La clé Supabase publique (`NEXT_PUBLIC_SUPABASE_*`) peut être côté client.

### Accessibilité (ARIA)
- Chaque bouton icon-only doit avoir un `aria-label`.
- Les `<dialog>` utilisent le composant shadcn `Dialog` avec `DialogTitle` visible ou `sr-only`.
- Les images météo ont un `alt` descriptif.

### Responsive
- Mobile-first systématique.
- Navbar : pill flottant, overflow horizontal sur mobile (`overflow-x-auto no-scrollbar`).
- Layouts principaux : `grid-cols-1 lg:grid-cols-2` pour les pages auth.

## Variables d'environnement
```
OPENWEATHER_API_KEY=...          ← côté serveur uniquement
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...    ← route api/delete-user uniquement
```

## Fonctionnalités existantes (ne pas refaire)
- [x] Clé API météo sécurisée (routes serveur)
- [x] Toggle °C / °F persistant (localStorage via `useUnit`)
- [x] Icônes météo modernes (WeatherIcon + Lucide)
- [x] Polices unifiées (next/font/google)
- [x] Navbar avec lien actif (usePathname)
- [x] Suggestions de villes en React state (pas innerHTML)
- [x] Géolocalisation GPS automatique
- [x] Skeleton loading pour les prévisions
- [x] Transition gradient entre sections
- [x] Date dynamique sur la page Favoris

## Composants shadcn disponibles
Situés dans `components/ui/` :
- `Button` — bouton accessible avec variants (default, outline, ghost, destructive)
- `Card`, `CardHeader`, `CardContent`, `CardFooter` — cartes structurées
- `Badge` — étiquettes colorées (variant: default, secondary, destructive, outline)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` — modales accessibles
- `Input` — champ de saisie stylé
- `Sonner` — notifications toast (remplace l'ancien Toast)

## Prochaines améliorations possibles
- Page `/premium` avec pricing cards (shadcn Card + Badge)
- Mode sombre complet (le `.dark` dans globals.css est déjà configuré)
- Animations de page avec Framer Motion
- PWA / Service Worker pour usage offline
- Carte interactive (Leaflet déjà installé)
