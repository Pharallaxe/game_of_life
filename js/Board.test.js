import { Board } from './Board.js';
import { conf } from './configuration.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function runTests() {
    console.log("Running tests for Board:");

    // Mock de l'application pour les tests
    const mockApp = {
        getRowCanvas: () => 5,
        getColumnCanvas: () => 5,
        getWeights: () => [0.5, 0.5], // Utilisé par getRandomCellState
        getRandomize: () => true,
        getBorder: () => false,
        getBirth: () => new Set([3]),
        getSurvival: () => new Set([2, 3]),
    };

    // Test d'initialisation
    (function testInitialization() {
        const board = new Board(mockApp);
        assert(board.getApp() === mockApp, "App should be set correctly");
        assert(board.getIsAlive() === 0, "Initial isAlive should be 0");
        assert(board.getGeneration() === 0, "Initial generation should be 0");
        assert(board.getTotalAlive() === 0, "Initial totalAlive should be 0");
        assert(board.getGrid().length === 5, "Grid should have 5 rows");
        assert(board.getGrid()[0].length === 5, "Grid should have 5 columns");
        console.log("testInitialization passed");
    })();

    // Test de création de grille
    (function testCreateGrid() {
        const board = new Board(mockApp);
        const grid = board.createGrid(false);
        assert(grid.length === 5, "Grid should have 5 rows");
        assert(grid[0].length === 5, "Grid should have 5 columns");
        assert(grid.every(row => row.every(cell => cell === conf.DEAD)), "Grid should be initialized with DEAD cells");
        console.log("testCreateGrid passed");
    })();

    // Test des setters et getters
    (function testSettersAndGetters() {
        const board = new Board(mockApp);
        board.setIsAlive(5);
        assert(board.getIsAlive() === 5, "isAlive should be set to 5");

        board.setGeneration(2);
        assert(board.getGeneration() === 2, "generation should be set to 2");

        board.setTotalAlive(10);
        assert(board.getTotalAlive() === 10, "totalAlive should be set to 10");

        board.setGridValue(1, 1, 1);
        assert(board.getGridValue(1, 1) === 1, "Grid value at (1,1) should be set to 1");

        board.setGridHistoryValue(1, 1, 1);
        assert(board.getGridHistoryValue(1, 1) === 1, "GridHistory value at (1,1) should be set to 1");

        board.setGridNumberNeighborsValue(1, 1, 3);
        assert(board.getGridNumberNeighborsValue(1, 1) === 3, "GridNumberNeighbors value at (1,1) should be set to 3");

        board.setGridTypeNeighborsValue(1, 1, 2);
        assert(board.getGridTypeNeighborsValue(1, 1) === 2, "GridTypeNeighbors value at (1,1) should be set to 2");

        board.setGridEnableDrawValue(1, 1, true);
        assert(board.getGridEnableDrawValue(1, 1) === true, "GridEnableDraw value at (1,1) should be set to true");
        console.log("testSettersAndGetters passed");
    })();

    // Test de getRandomCellState
    (function testGetRandomCellState() {
        const board = new Board(mockApp);
        const randomState = board.getRandomCellState();
        assert([0, 1].includes(randomState), "Random cell state should be either 0 or 1");
        console.log("testGetRandomCellState passed");
    })();

    // Test d'application de motif
    (function testApplyPattern() {
        const board = new Board(mockApp);
        const pattern = [[0, 0], [0, 1], [1, 0]];
        board.applyPattern(pattern, 1, 1, 1);
        assert(board.getGridValue(1, 1) === 1, "Pattern cell (0,0) should be applied");
        assert(board.getGridValue(1, 2) === 1, "Pattern cell (0,1) should be applied");
        assert(board.getGridValue(2, 1) === 1, "Pattern cell (1,0) should be applied");
        console.log("testApplyPattern passed");
    })();

    // Test de mise à jour de la grille historique
    (function testUpdateHistoryGrid() {
        const board = new Board(mockApp);
        board.setGridValue(1, 1, 1);
        board.updateHistoryGrid();
        assert(board.getGridHistoryValue(1, 1) === 1, "History value at (1,1) should be updated to 1");
        board.setGridValue(1, 1, 0);
        board.updateHistoryGrid();
        assert(board.getGridHistoryValue(1, 1) === 0, "History value at (1,1) should be reset to 0");
        console.log("testUpdateHistoryGrid passed");
    })();

    // Test de calcul de la prochaine génération
    (function testGetNextGeneration() {
        const board = new Board(mockApp);
        board.setGridValue(1, 1, 1);
        board.setGridValue(1, 2, 1);
        board.setGridValue(2, 1, 1);
        board.getNextGeneration();
        assert(board.getGridValue(1, 1) === 1, "Grid value at (1,1) should be 1");
        assert(board.getGridValue(2, 2) === 1, "Grid value at (2,2) should be 1");
        console.log("testGetNextGeneration passed");
    })();

    // Test de déplacement de la grille
    (function testGridMovement() {
        const board = new Board(mockApp);
        board.setGridValue(1, 1, 1);
        board.moveTop();
        assert(board.getGridValue(1, 1) === 0, "Grid value at (1,1) should be 0 after moveTop");
        assert(board.getGridValue(0, 1) === 1, "Grid value at (0,1) should be 1 after moveTop");

        board.moveBottom();
        assert(board.getGridValue(0, 1) === 0, "Grid value at (0,1) should be 0 after moveBottom");
        assert(board.getGridValue(1, 1) === 1, "Grid value at (1,1) should be 1 after moveBottom");

        board.moveLeft();
        assert(board.getGridValue(1, 1) === 0, "Grid value at (1,1) should be 0 after moveLeft");
        assert(board.getGridValue(1, 0) === 1, "Grid value at (1,0) should be 1 after moveLeft");

        board.moveRight();
        assert(board.getGridValue(1, 0) === 0, "Grid value at (1,0) should be 0 after moveRight");
        assert(board.getGridValue(1, 1) === 1, "Grid value at (1,1) should be 1 after moveRight");
        console.log("testGridMovement passed");
    })();
}

runTests();
