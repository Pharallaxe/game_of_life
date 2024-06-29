
// function make

export const conf = {
    // Taille des cellules du canvas
    MIN_CELL_SIZE : 3,
    MAX_CELL_SIZE : 40,

    // Nombre minimales et maximales de colonne
    MIN_COL : 2,
    MAX_COL : 250,

    // Valeurs des cellules
    DEAD : 0,
    ALIVE1 : 1,
    ALIVE2 : 2,
    ALIVE3 : 3,
    ALIVE4 : 4,
    WALL : 9,

    // Milieux
    MIDDLES : {
        "Désert": [
            { name: 'N', x: 0, y: -1 },
            { name: 'E', x: 1, y: 0 },
            { name: 'S', x: 0, y: 1 },
            { name: 'O', x: -1, y: 0 },
        ],
        "Ville": [
            { name: 'N-1', x: 0, y: -1 },
            { name: 'N-2', x: 0, y: -2 },
            { name: 'E-1', x: 1, y: 0 },
            { name: 'E-2', x: 2, y: 0 },
            { name: 'S-1', x: 0, y: 1 },
            { name: 'S-2', x: 0, y: 2 },
            { name: 'O-1', x: -1, y: 0 },
            { name: 'O-2', x: -2, y: 0 },
        ],
        'Plaine': [
            { name: 'N', x: 0, y: -1 },
            { name: 'NE', x: 1, y: -1 },
            { name: 'E', x: 1, y: 0 },
            { name: 'SE', x: 1, y: 1 },
            { name: 'S', x: 0, y: 1 },
            { name: 'SO', x: -1, y: 1 },
            { name: 'O', x: -1, y: 0 },
            { name: 'NO', x: -1, y: -1 }
        ],
        'Forêt': [
            { name: 'N-1', x: 0, y: -1 },
            { name: 'N-2', x: 0, y: -2 },
            { name: 'NE', x: 1, y: -1 },
            { name: 'E-1', x: 1, y: 0 },
            { name: 'E-2', x: 2, y: 0 },
            { name: 'SE', x: 1, y: 1 },
            { name: 'S-1', x: 0, y: 1 },
            { name: 'S-2', x: 0, y: 2 },
            { name: 'SO', x: -1, y: 1 },
            { name: 'O-1', x: -1, y: 0 },
            { name: 'O-2', x: -2, y: 0 },
            { name: 'NO', x: -1, y: -1 }
        ],
        'Mer': [
            { name: 'N-1', x: 0, y: -1 },
            { name: 'N-2', x: 0, y: -2 },
            { name: 'NE-1', x: 1, y: -1 },
            { name: 'NE-2', x: 2, y: -2 },
            { name: 'E-1', x: 1, y: 0 },
            { name: 'E-2', x: 2, y: 0 },
            { name: 'SE-1', x: 1, y: 1 },
            { name: 'SE-2', x: 2, y: 2 },
            { name: 'S-1', x: 0, y: 1 },
            { name: 'S-2', x: 0, y: 2 },
            { name: 'SO-1', x: -1, y: 1 },
            { name: 'SO-2', x: -2, y: 2 },
            { name: 'O-1', x: -1, y: 0 },
            { name: 'O-2', x: -2, y: 0 },
            { name: 'NO-1', x: -1, y: -1 },
            { name: 'NO-2', x: -2, y: -2 }
        ],
    },

    aliveValuesSet : new Set([1, 2, 3, 4]),

    notDeadValueSet : new Set([1, 2, 3, 4, 9]),

    // Font Canvas
    canvasBgColor : 'black',
}