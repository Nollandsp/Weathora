Weathora est une application météo simple et intuitive, centrée exclusivement sur les villes françaises. Elle permet à l'utilisateur de saisir le nom d'une ville et d'obtenir rapidement ses conditions météorologiques actuelles.

Un système d'autocomplétion est intégré pour faciliter la recherche et réduire les erreurs de saisie.

Une carte est eventuellement mise à disposition pour l'utilisateurs afin de voir où se situe la ville qu'il tape depusi le barre de recherche.

Fonctionnalités :
. Rechercher la météo par ville française.

. Affichage des données météorologiques (température, météo actuelle, etc.).

. Autocomplétion des noms de villes pour une expérience fluide.

. Interface en français et ciblée exclusivement sur la France.

. Carte qui rensiegne où se situe chaque ville à chaque recherche.

Technologies utilisées :
. Frontend : HTML, CSS, JavaScript (ou framework utilisé comme React/Vue)

. API météo : OpenWeatherMap (ou autre source météo)

. Autocomplétion : Intégration de la base des villes françaises (API Geo ou base INSEE)

APIs utilisées :

1. API Météo : OpenWeatherMap
   L'API Current Weather Data d'OpenWeatherMap fournit des données météorologiques en temps réel pour n’importe quelle ville dans le monde, y compris les villes françaises. Les données incluent la température, la météo, l’humidité, le vent, la pression atmosphérique, etc.

2. geo.api.gouv.fr – API des communes françaises 
L'API des communes françaises proposée par le gouvernement français permet de récupérer toutes les villes/communes françaises. Elle est utilisée ici pour la fonction d'autocomplétion : lorsque l’utilisateur commence à taper une ville, l’interface propose les correspondances les plus probables.
