// Importer la classe Board
const Board = require('./Board');

// Fonction pour tester les assertions
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function runTests() {
    console.log("Tests for Board:");

    // Test d'initialisation
    (function testInitialization() {
        const board = new Board(5, 5);
        assert(board.rows === 5, "Rows should be 5");
        assert(board.cols === 5, "Cols should be 5");
        assert(board.grid.length === 5, "Grid should have 5 rows");
        assert(board.grid[0].length === 5, "Grid should have 5 columns");
        assert(board.grid[0][0] === 0, "Initial state should be false");
        console.log("testInitialization passed");
    })();

    // Test getCellState et setCellState
    (function testGetSetCellState() {
        const board = new Board(5, 5);
        board.setCellState(2, 2, true);
        assert(board.getCellState(2, 2) === true, "Cell state should be true");
        board.setCellState(2, 2, 0);
        assert(board.getCellState(2, 2) === 0, "Cell state should be false");
    })();

    // Test applyPattern (placeholder)
    (function testApplyPattern() {
        const board = new Board(5, 5);
        const state = 1;
        const pattern = [
            [1, 1],
            [1, 0]
        ];
        board.applyPattern(pattern, 2, 2, 1);
        assert(board.getCellState(2, 2) === 0, "Pattern application failed at (2, 2)");
        assert(board.getCellState(2, 3) === 0, "Pattern application failed at (2, 3)");
        assert(board.getCellState(3, 2) === state, "Pattern application failed at (3, 2)");
        assert(board.getCellState(3, 3) === state, "Pattern application failed at (3, 3)");
    })();

        // Test de la méthode nextGeneration
        (function testNextGeneration() {
            const board = new Board(5, 5);
    
            // Initialisation d'un motif de "clignotant" (blinker)
            const blinker = [
                [0, 1],
                [1, 1],
                [2, 1]
            ];
            board.applyPattern(blinker, 1, 1, board.ALIVE);
    
            // Vérifier l'état initial
            assert(board.getCellState(1, 1) === board.ALIVE, "Initial state failed at (1, 1)");
            assert(board.getCellState(2, 1) === board.ALIVE, "Initial state failed at (2, 1)");
            assert(board.getCellState(3, 1) === board.ALIVE, "Initial state failed at (3, 1)");
    
            // Appliquer la génération suivante
            board.nextGeneration();
    
            // Vérifier l'état après une génération
            assert(board.getCellState(2, 0) === board.ALIVE, "Next generation failed at (2, 0)");
            assert(board.getCellState(2, 1) === board.ALIVE, "Next generation failed at (2, 1)");
            assert(board.getCellState(2, 2) === board.ALIVE, "Next generation failed at (2, 2)");
    
            console.log("testNextGeneration passed");
        })();
    
        // Test de la méthode moveTop
        (function testMoveTop() {
            const board = new Board(5, 5);
            board.setCellState(4, 2, board.ALIVE);
            board.moveTop();
            assert(board.getCellState(3, 2) === board.ALIVE, "MoveTop failed to move cell");
            assert(board.getCellState(4, 2) === board.DEAD, "MoveTop failed to clear bottom row");
            console.log("testMoveTop passed");
        })();
    
        // Test de la méthode moveBottom
        (function testMoveBottom() {
            const board = new Board(5, 5);
            board.setCellState(0, 2, board.ALIVE);
            board.moveBottom();
            assert(board.getCellState(1, 2) === board.ALIVE, "MoveBottom failed to move cell");
            assert(board.getCellState(0, 2) === board.DEAD, "MoveBottom failed to clear top row");
            console.log("testMoveBottom passed");
        })();
    
        // Test de la méthode moveLeft
        (function testMoveLeft() {
            const board = new Board(5, 5);
            board.setCellState(2, 4, board.ALIVE);
            board.moveLeft();
            assert(board.getCellState(2, 3) === board.ALIVE, "MoveLeft failed to move cell");
            assert(board.getCellState(2, 4) === board.DEAD, "MoveLeft failed to clear right column");
            console.log("testMoveLeft passed");
        })();
    
        // Test de la méthode moveRight
        (function testMoveRight() {
            const board = new Board(5, 5);
            board.setCellState(2, 0, board.ALIVE);
            board.moveRight();
            assert(board.getCellState(2, 1) === board.ALIVE, "MoveRight failed to move cell");
            assert(board.getCellState(2, 0) === board.DEAD, "MoveRight failed to clear left column");
            console.log("testMoveRight passed");
        })();
}

// Exécuter les tests
runTests();
