import json
ajout = 0


def read_patterns_from_file(file_path):
    """
    Lit les patterns à partir d'un fichier texte.
    
    Args:
        file_path (str): Le chemin du fichier contenant les patterns.
    
    Returns:
        list: Une liste de patterns bruts.
    """
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Séparer les patterns
    patterns = content.split(':')[1:]
    
    return patterns

def check_grid_length(grid):
    """
    Vérifie que chaque ligne de la grille a la même longueur.
    
    Args:
        grid (list): La grille à vérifier.
    
    Returns:
        bool: True si chaque ligne a la même longueur, False sinon.
    """
    grid_length = None
    for row in grid:
        if len(row.strip()) > 1:
            if grid_length is None:
                grid_length = len(row.strip())
            elif len(row.strip()) != grid_length:
                print(f"Erreur : la ligne '{row}' n'a pas la même longueur que les autres lignes.")
                return False
    return True

def parse_pattern(pattern_raw):
    """
    Analyse un pattern brut pour extraire les informations pertinentes.
    
    Args:
        pattern_raw (str): Le pattern brut.
    
    Returns:
        dict: Un dictionnaire contenant le nom, la description et la grille du pattern.
    """
    patternSplited = pattern_raw.split("\n")
    premiere = patternSplited[0]
    nom = premiere[0:premiere.index(" ")]
    print(nom)
    description = premiere[premiere.index(" "):]
    grid = patternSplited[1:]
    
    if not check_grid_length(grid):
        return None
    
    gridStripped = [row.strip() for row in grid if len(row) > 1]
    gridFormatted = [[0 if i == "." else 1 for i in y] for y in gridStripped]

    # Ajouter une bordure autour de la grille
    gridGrown = add_border_to_grid(gridFormatted)
    
    return {
        'name': nom,
        # 'description': description,
        'grid': gridGrown
    }

def add_border_to_grid(grid):
    """
    Ajoute une bordure de 10 cases autour d'une grille.
    
    Args:
        grid (list): La grille à entourer d'une bordure.
    
    Returns:
        list: La grille avec une bordure ajoutée.
    """
    # Déterminer la taille de la grille d'origine
    grid_height = len(grid)
    grid_width = len(grid[0])
    
    # Créer une nouvelle grille avec 10 cases supplémentaires dans tous les sens
    new_grid_height = grid_height + ajout * 2
    new_grid_width = grid_width + ajout * 2
    
    # Créer une nouvelle grille remplie de 0
    new_grid = [[0 for _ in range(new_grid_width)] for _ in range(new_grid_height)]
    # Placer la grille d'origine au centre de la nouvelle grille
    for y in range(grid_height):
        for x in range(grid_width):
            new_grid[y+ajout][x+ajout] = 0 if grid[y][x] == 0 else 1
    
    return new_grid


def main():
    """
    Point d'entrée principal du script.
    """
    # Lire les patterns à partir du fichier
    patterns = read_patterns_from_file('patterns.txt')
    
    # Analyser chaque pattern et créer une liste de dictionnaires
    data = [parse_pattern(pattern) for pattern in patterns]
    
    # Créer le dictionnaire final avec la clé "patterns"
    final_data = {"patterns": data}
        
    # Écrire les données dans un fichier JSON
    with open('./src/js/patterns.json', 'w') as file:
        json.dump(final_data, file, indent=2, separators=(',', ':'))

if __name__ == "__main__":
    main()
