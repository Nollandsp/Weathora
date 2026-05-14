# Weathora

Application météo moderne construite avec Next.js 15, Supabase et l'API OpenWeatherMap. Interface épurée, typographie éditoriale, données en temps réel.

---

## Fonctionnalités

- **Météo en temps réel** — température, ressenti, vent, humidité, pression
- **Recherche de villes françaises** — autocomplétion via geo.api.gouv.fr
- **Géolocalisation GPS** — détection automatique de la position
- **Prévisions 5 jours** — affichage par tranches horaires
- **Favoris** — sauvegarde jusqu'à 3 villes (compte requis)
- **Toggle °C / °F** — persisté dans le localStorage
- **Authentification** — inscription, connexion, gestion du profil, suppression de compte
- **Page Premium** — présentation de l'offre payante

---

## Stack technique

| Couche    | Technologie                 |
| --------- | --------------------------- |
| Framework | Next.js 15 (App Router)     |
| Langage   | JavaScript (`.js` / `.jsx`) |
| Style     | Tailwind CSS v4 + shadcn/ui |
| Icônes    | Lucide React                |
| Auth & DB | Supabase                    |
| API Météo | OpenWeatherMap              |
| Toasts    | Sonner                      |

---

## Prérequis

- Node.js 18+
- Un compte [Supabase](https://supabase.com)
- Une clé API [OpenWeatherMap](https://openweathermap.org/api)

---

## Installation

```bash
git clone https://github.com/votre-utilisateur/weathora.git
cd weathora
npm install
```

Créez un fichier `.env` à la racine :

```env
OPENWEATHER_API_KEY=votre_clé_openweathermap

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

Lancez le serveur de développement :

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Structure du projet

```
app/
├── api/
│   ├── weather/current/     ← Météo actuelle (proxy sécurisé)
│   ├── weather/forecast/    ← Prévisions 5 jours
│   ├── weather/reverse/     ← Géocodage inverse
│   └── delete-user/         ← Suppression de compte (admin)
├── Connexion/
├── Inscription/
├── Favoris/
├── profil/
├── premium/
├── globals.css
└── layout.js

components/
├── ui/                      ← Composants shadcn (ne pas modifier)
├── Navbar/
├── MainWeather/
├── ForecastExtended/
├── Footer/
└── WeatherIcon/             ← Icônes météo Lucide par code OpenWeatherMap

hooks/
├── useUnit.js               ← Toggle °C/°F (localStorage)
└── useScrollToElement.js

lib/
├── utils.js                 ← Fonction cn()
└── supabase/client.js
```

---

````

> Activez la **Row Level Security (RLS)** sur les deux tables avec des politiques filtrant par `auth.uid()`.

---

## Sécurité

- La clé API OpenWeatherMap n'est jamais exposée côté client — tous les appels passent par les routes `/api/weather/*`
- La `SUPABASE_SERVICE_ROLE_KEY` est utilisée uniquement dans `/api/delete-user` côté serveur
- Les suppressions de favoris vérifient l'ownership (`profiles_id = user.id`)
- En-têtes HTTP de sécurité configurés : `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, etc.
- Timeout de 5 secondes sur tous les appels sortants vers OpenWeatherMap

---

## Scripts disponibles

```bash
npm run dev      # Serveur de développement (Turbopack)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification ESLint
````

---

## Variables d'environnement

| Variable                        | Côté               | Description            |
| ------------------------------- | ------------------ | ---------------------- |
| `OPENWEATHER_API_KEY`           | Serveur            | Clé API OpenWeatherMap |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client + Serveur   | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Serveur   | Clé publique Supabase  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Serveur uniquement | Clé admin Supabase     |

---

## Auteur

Projet réalisé dans le cadre de l'ECF par Da Silva Pereira Nollan.
