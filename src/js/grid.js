class Config {
    static DEAD = 0;
    static ALIVE1 = 1;
    static ALIVE2 = 2;
    static ALIVE3 = 3;
    static ALIVE4 = 4;
    static WALL = 9;
}

class GameOfLife {
    constructor(birth, survival) {
        this.livingCells = new Map();
        this.visitedCells = new Set();
        this.historyEnabled = false;
        this.birth = birth;
        this.survival = survival;
    }

    enableHistory(enable) {
        this.historyEnabled = enable;
        if (!enable) {
            this.visitedCells.clear();
        }
    }

    // Convert a grid (2D array) to a list of living cells with their states
    convertGridToCells(grid) {
        const cells = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const state = grid[y][x];
                if (state !== Config.DEAD) {
                    cells.push([[x, y], state]);
                }
            }
        }
        return cells;
    }

    initialize(cells) {
        this.livingCells.clear();
        if (this.historyEnabled) {
            this.visitedCells.clear();
        }
        cells.forEach(([cell, state]) => {
            const serialized = this._serialize(cell);
            this.livingCells.set(serialized, state);
            if (this.historyEnabled) {
                this.visitedCells.add(serialized);
            }
        });
    }

    getNeighbors(cell) {
        const [x, y] = cell;
        return [
            [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
            [x - 1, y], /* [x, y], */ [x + 1, y],
            [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
        ];
    }

    countLivingNeighbors(cell) {
        return this.getNeighbors(cell).reduce((count, neighbor) => {
            const serialized = this._serialize(neighbor);
            if (this.livingCells.has(serialized) && this.livingCells.get(serialized) !== Config.WALL) {
                count++;
            }
            return count;
        }, 0);
    }

    nextGeneration() {
        const newLivingCells = new Map();
        const potentialCells = new Map();

        this.livingCells.forEach((state, serializedCell) => {
            const cell = this._deserialize(serializedCell);
            const neighbors = this.getNeighbors(cell);
            neighbors.push(cell);

            neighbors.forEach(neighbor => {
                const serializedNeighbor = this._serialize(neighbor);
                if (!potentialCells.has(serializedNeighbor)) {
                    potentialCells.set(serializedNeighbor, { count: 0, state: Config.DEAD });
                }
                if (this.livingCells.has(serializedNeighbor) && this.livingCells.get(serializedNeighbor) !== Config.WALL) {
                    potentialCells.get(serializedNeighbor).count++;
                }
            });
        });

        potentialCells.forEach((data, serializedCell) => {
            const isAlive = this.livingCells.has(serializedCell);
            const currentState = this.livingCells.get(serializedCell) || Config.DEAD;
            if ((isAlive && this.survival.has(data.count)) || (!isAlive && this.birth.has(data.count))) {
                newLivingCells.set(serializedCell, currentState === Config.DEAD ? Config.ALIVE1 : currentState + 1);
                if (this.historyEnabled) {
                    this.visitedCells.add(serializedCell);
                }
            }
        });

        this.livingCells = newLivingCells;
    }

    _serialize([x, y]) {
        return `${x},${y}`;
    }

    _deserialize(serialized) {
        return serialized.split(',').map(Number);
    }

    getVisitedCells() {
        if (this.historyEnabled) {
            return [...this.visitedCells].map(this._deserialize);
        } else {
            return [];
        }
    }

    hasCellBeenVisited(cell) {
        return this.historyEnabled && this.visitedCells.has(this._serialize(cell));
    }
}

// Example usage
const birthConditions = new Set([2, 3]);
const survivalConditions = new Set([3]);
const game = new GameOfLife(birthConditions, survivalConditions);
game.enableHistory(true);

const grid = [
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [9, 9, 0, 0, 0]
];

const cells = game.convertGridToCells(grid);
game.initialize(cells);
console.log("Initial state:", [...game.livingCells].map(([cell, state]) => [game._deserialize(cell), state]));
game.nextGeneration();
console.log("Next state:", [...game.livingCells].map(([cell, state]) => [game._deserialize(cell), state]));
console.log("Visited cells:", game.getVisitedCells());
console.log("Has cell [1, 2] been visited?", game.hasCellBeenVisited([1, 2]));
