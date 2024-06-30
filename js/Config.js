// function make

export class Config {
    // Taille des cellules du canvas
    static MIN_CELL_SIZE = 3;
    static MAX_CELL_SIZE = 250;

    // Nombre minimales et maximales de colonne
    static MIN_COL = 2;
    static MAX_COL = 250;

    // Valeurs des cellules
    static DEAD = 0;
    static ALIVE1 = 1;
    static ALIVE2 = 2;
    static ALIVE3 = 3;
    static ALIVE4 = 4;
    static WALL = 9;

    // Milieux
    MIDDLES = {
        "Désert": [
            {name: 'N', x: 0, y: -1},
            {name: 'E', x: 1, y: 0},
            {name: 'S', x: 0, y: 1},
            {name: 'O', x: -1, y: 0},
        ],
        "Ville": [
            {name: 'N-1', x: 0, y: -1},
            {name: 'N-2', x: 0, y: -2},
            {name: 'E-1', x: 1, y: 0},
            {name: 'E-2', x: 2, y: 0},
            {name: 'S-1', x: 0, y: 1},
            {name: 'S-2', x: 0, y: 2},
            {name: 'O-1', x: -1, y: 0},
            {name: 'O-2', x: -2, y: 0},
        ],
        'Plaine': [
            {name: 'N', x: 0, y: -1},
            {name: 'NE', x: 1, y: -1},
            {name: 'E', x: 1, y: 0},
            {name: 'SE', x: 1, y: 1},
            {name: 'S', x: 0, y: 1},
            {name: 'SO', x: -1, y: 1},
            {name: 'O', x: -1, y: 0},
            {name: 'NO', x: -1, y: -1}
        ],
        'Forêt': [
            {name: 'N-1', x: 0, y: -1},
            {name: 'N-2', x: 0, y: -2},
            {name: 'NE', x: 1, y: -1},
            {name: 'E-1', x: 1, y: 0},
            {name: 'E-2', x: 2, y: 0},
            {name: 'SE', x: 1, y: 1},
            {name: 'S-1', x: 0, y: 1},
            {name: 'S-2', x: 0, y: 2},
            {name: 'SO', x: -1, y: 1},
            {name: 'O-1', x: -1, y: 0},
            {name: 'O-2', x: -2, y: 0},
            {name: 'NO', x: -1, y: -1}
        ],
        'Mer': [
            {name: 'N-1', x: 0, y: -1},
            {name: 'N-2', x: 0, y: -2},
            {name: 'NE-1', x: 1, y: -1},
            {name: 'NE-2', x: 2, y: -2},
            {name: 'E-1', x: 1, y: 0},
            {name: 'E-2', x: 2, y: 0},
            {name: 'SE-1', x: 1, y: 1},
            {name: 'SE-2', x: 2, y: 2},
            {name: 'S-1', x: 0, y: 1},
            {name: 'S-2', x: 0, y: 2},
            {name: 'SO-1', x: -1, y: 1},
            {name: 'SO-2', x: -2, y: 2},
            {name: 'O-1', x: -1, y: 0},
            {name: 'O-2', x: -2, y: 0},
            {name: 'NO-1', x: -1, y: -1},
            {name: 'NO-2', x: -2, y: -2}
        ],
    };

    static aliveValuesSet = new Set([1, 2, 3, 4]);

    static notDeadValueSet = new Set([1, 2, 3, 4, 9]);

    // Font Canvas
    static canvasBgColor = 'black';
}