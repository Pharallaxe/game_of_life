# Jeu de la Vie

![Illustration de l'auteur](src/img/pharallaxe.png)

## Licence
Ce projet est sous licence [Apache](./LICENSE).

## Petite histoire

Le "jeu de la vie" est un exemple emblématique de ce que l'on appelle un automate cellulaire&nbsp;: une classe de modèles mathématiques utilisée pour simuler des phénomènes complexes. Bien que ce jeu ne soit pas un jeu au sens traditionnel, il a suscité un intérêt considérable, souvent ludique, en raison de sa simplicité et de la complexité émergente qu'il génère.

Imaginé en 1970 par le mathématicien britannique John Conway, il repose sur une grille à deux dimensions composée de cellules vivantes ou éteintes. Chacune d'entre elles évolue en fonction d'un ensemble de règles simples fondées sur la présence d'autres cellules vivantes dans son voisinage. Initialement conçu pour être joué sur une grille infinie, il a rapidement trouvé des applications en informatique, en mathématiques et en biologie.

Les règles du jeu de la vie au depart sont étonnamment simples&nbsp;:
- Chaque cellule peut être soit vivante (remplie) soit éteinte (vide).
- L'évolution des cellules se fait en fonction de leur environnement immédiat, c'est-à-dire les huit cellules voisines.
- Une cellule vivante avec 2 ou 3 voisins survivra à la génération suivante. Sinon, elle s'éteindra (par "sous-population" ou "surpopulation").
-Une cellule éteinte avec exactement 3 voisins vivants apparaît (par "reproduction").

Bien que les règles du jeu soient simples, cet automate cellulaire génère des configurations étonnamment complexes. On retrouve des planeurs, ensembles de cellules mobiles&nbsp; des oscillateurs ensembles qui reviennent régulièrement à leur état initial&nbsp; des vaisseaux, ensembles mobiles qui laissent derrière eux d'autres ensembles. Il existe également des configurations stables, appelées statics.

De simples et légères modifications dans les règles peuvent conduire vers des modèles chaotiques ou vers des structures stables et passer de l'un à l'autre. En cela, le jeu de la vie est un outil efficace pour se rendre compte de la fragilité de l'équilibre de certains écosystèmes. Par exemple, des petites modifications à un endroit (accentuer ou relâcher la pression à certains endroits) engendrent des conséquences insoupçonnées sur l'ensemble des parties.
        
Le jeu de la vie est un exemple typique de la façon dont des règles simples peuvent générer une merveilleuse complexité émergente. L'exploration des configurations et des modèles de cet outil est une source de réflexion pour les scientifiques et les amateurs. A vous d'essayer et de lancer vos propres expérimentations.

## Description

Ce programme est une implémentation du jeu de la vie. Le projet est en cours.

## Fonctionnalités

### Navigation et Menus

- **Plateau :**
  - Configurer
  - Entrer
  - Afficher
  - Charger
  - Enregistrer
- **Edition :**
  - Définir
  - Prédéfinir
  - Ajout Rapide
  - Pas à Pas
  - Vitesse

### Barre d'icônes
- **Nouvelle Simulation :** Permet de configurer une nouvelle simulation.
- **Pas à Pas :** Avance la simulation d'un pas.
- **Démarrer / Mettre en Pause :** Démarre ou met en pause la simulation.
- **Rapidité :** Ajuste la vitesse de la simulation (x1, x2, x5, x10, x20, x50).
- **Couleur :** Change la couleur des cellules (bleu, rouge, jaune, vert, mur).
- **Dessiner :** Active le mode dessin pour ajouter des cellules.
- **Corbeille :** Efface des cellules de la grille.
- **Grille :** Affiche ou masque la grille.
- **Bordures :** Affiche ou masque les bordures.
- **Historique :** Affiche l'historique des générations.
- **Déplacement :** Déplace la vue de la grille dans toutes les directions.
- **Zoom :** Zoom avant et arrière sur la grille.

### Canvas

- **Canvas Container :**
  - Contient le canvas où se déroule la simulation du Jeu de la Vie.

### Barre de statut

Affiche des informations sur la simulation en cours :
- Génération actuelle
- Nombre de cellules vivantes
- Nombre total de cellules

