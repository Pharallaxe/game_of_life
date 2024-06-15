
// function make

export const conf = {
    // Taille des cellules du canvas
    MIN_CELL_SIZE : 2,
    MAX_CELL_SIZE : 50,

    // Nombre minimales et maximales de colonne
    MIN_COL : 2,
    MAX_COL : 50,

    // Valeurs des cellules
    DEAD : 0,
    ALIVE1 : 1,
    ALIVE2 : 2,
    ALIVE3 : 3,
    ALIVE4 : 4,
    WALL : 9,

    // Milieu
    MIDDLE : [
        { name: 'N', x: 0, y: -1 },
        { name: 'NE', x: 1, y: -1 },
        { name: 'E', x: 1, y: 0 },
        { name: 'SE', x: 1, y: 1 },
        { name: 'S', x: 0, y: 1 },
        { name: 'SO', x: -1, y: 1 },
        { name: 'O', x: -1, y: 0 },
        { name: 'NO', x: -1, y: -1 }
    ],

    aliveValuesSet : new Set([1, 2, 3, 4]),

    notDeadValueSet : new Set([1, 2, 3, 4, 9]),

    // Font Canvas
    canvasBgColor : 'black',
}