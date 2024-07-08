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

    json_object = {
        'name': nom,
        'length' : len(gridStripped[0]),
        "grid": []
        }

    for line in gridStripped:
        json_line = transform_line(line)
        json_object["grid"].append(json_line)
    
    return json_object

def transform_line(line):
    result = []
    count = 0
    for i, char in enumerate(line):
        if char == "O":            
            count += 1
        elif count != 0 and char == ".":
            result.append([i, count])
            count = 0
    if count != 0:
        result.append([i-count, count])
    # print(result)
    return result

def main():
    """
    Point d'entrée principal du script.
    """
    # Lire les patterns à partir du fichier
    patterns = read_patterns_from_file('fichier_ascii.txt')
    
    # Analyser chaque pattern et créer une liste de dictionnaires
    data = [parse_pattern(pattern) for pattern in patterns]
    
    # Créer le dictionnaire final avec la clé "patterns"
    final_data = {"patterns": data}
        
    # Écrire les données dans un fichier JSON
    with open('./src/js/patterns_raccourci.json', 'w') as file:
        json.dump(final_data, file, indent=2, separators=(',', ':'))

if __name__ == "__main__":
    main()
