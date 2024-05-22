# Exemple de scraping avec `puppeteer`

Le projet fournit un aperçu de web scraping en `node` sur un thème divertissant choisi pour l'exemple. Veillez à bien respecter le droit d'auteur !

Obtenir la copie sur sur le site [Little Garden](https://littlexgarden.com), d'un manga qu'on a acheté par ailleurs, en version numérique et colorisée parfois reste simple :
  * Se rendre sur la page du chapitre, ex [Chapitre 40](https://littlexgarden.com/one-piece/40)
  * Cliquer droit pour ouvrir le menu contextuel, puis cliquer sur `Télécharger le chapitre`

En revanche, en récupérer un millier est fastidieux ! Le projet propose une automatisation pour le mange `One piece`. Il requiert `node` et utilise la librairie [Puppeteer](https://pptr.dev/) pour le scraping et [minimist](https://github.com/minimistjs/minimist) pour les arguments.

```sh
# Installation des dépendances
npm ci

# Téléchargement des chapitres 1 à 10 (par défaut)
npm run execute -- --startChapter=1 --endChapter=10

# Téléchargement des chapitres 205 à 1114
#npm run execute -- --startChapter=1 --endChapter=1114
```

Remarque :
* On obtient de temps en temps un message du type `Error: Navigating frame was detached`. Cela est lié à une gestion perfectible des temps de réponses qui sont variables mais gérés avec des timers ici. Il n'y a pas d'événement de type "le fichier est téléchargé" et il faudrait tester la présence de celui-ci sur disque. Cela reste donc améliorable.
* Pour lister les fichiers manquants, exécuter dans le répertoire `downloaded` :
```sh
#!/bin/bash

# A adapter
start=1
end=1114

prefix="Little Garden - One Piece"
suffix=".zip"

for i in $(seq $start $end); do
    filename="${prefix} ${i}${suffix}"
    if [ ! -f "$filename" ]; then
        echo "Manquant: $filename"
    fi
done
```