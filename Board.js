export class Board {
    constructor(myWindow) {
        this.myWindow = myWindow;
        this.rows = myWindow.rowCanvas;
        this.cols = myWindow.columnCanvas;
        this.DEAD = 0;
        this.ALIVE1 = 1;
        this.ALIVE2 = 2;
        this.ALIVE3 = 3;
        this.ALIVE4 = 4;
        this.WALL = 9;

        this.valueSet = new Set([this.ALIVE1, this.ALIVE2, this.ALIVE3, this.ALIVE4])

        this.isAlive = 0;
        this.generation = 0;

        this.grid = this.createGrid();
        this.gridHistory = this.createGrid();
        this.gridNumberNeighbors = this.createGrid();
        this.gridTypeNeighbors = this.createGrid();
        this.gridEnableDraw = this.createGrid(true)
    }

    // Méthode pour initialiser la grille avec des cellules mortes
    createGrid(value = this.DEAD) {
        const grid = [];

        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.cols; j++) {
                // Utilise 1 pour les cases de l'échiquier et `value` pour les autres
                row.push((i + j) % 2 === 0 ? value : 1);
            }
            grid.push(row);
        }

        return grid;
    }

    applyPattern(pattern, startY, startX, state = this.ALIVE1) {
        pattern.forEach(([dy, dx]) => {
            const y = startY + dy;
            const x = startX + dx;
            if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
                this.grid[y][x] = state;
            }
        });
    }

    // Calcule la prochaine génération du jeu
    getNextGeneration() {
        this.generation += 1;
        this.calculateNeighbors();
        const nextGrid = this.createNextGrid();
        this.updateGrid(nextGrid);
        this.updateHistoryGrid();
    }

    // Met à jour la grille principale avec la grille de la prochaine génération
    updateGrid(nextGrid) {
        this.grid = nextGrid;
    }

    // Met à jour la grille d'historique pour l'évaluation des tendances
    updateHistoryGrid() {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                if (this.valueSet.has(this.grid[j][i])) {
                    this.gridHistory[j][i] += 1;
                } else {
                    this.gridHistory[j][i] = 0;
                }
            }
        }
    }

    isWithinGridBounds(j, i) {
        return j >= 0 && j < this.rows && i >= 0 && i < this.cols;
    }

    applyBoundaryRules(j, i) {
        if (j === -1) { j = this.rows - 1; }
        if (j === this.rows) { j = 0; }
        if (i === -1) { i = this.cols - 1; }
        if (i === this.cols) { i = 0; }
        if (j === -2) { j = this.rows - 2; }
        if (j === this.rows + 1) { j = 1; }
        if (i === -2) { i = this.cols - 2; }
        if (i === this.cols + 1) { i = 1; }

        return [j, i];
    }


    // Compte les voisins d'une cellule donnée
    calculateNeighbors(y, x) {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                const [
                    numberNeighbors,
                    typeNeighbors
                ] = this.countNeighbors(j, i, this.myWindow.border);
                this.gridNumberNeighbors[j][i] = numberNeighbors;
                this.gridTypeNeighbors[j][i] = typeNeighbors;
            }
        }
    }

    countAliveCells() {
        this.isAlive = 0; // Réinitialise le compteur
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                if (this.valueSet.has(this.grid[j][i])) {
                    this.isAlive++; // Incrémente le compteur si la cellule est vivante
                }
            }
        }
    }

    countNeighbors(j, i, withBorder) {
        let neighborsAccount = 0;
        let neighborsTotal = 0;

        this.myWindow.MIDDLE.forEach(direction => {
            let y = j + direction.y;
            let x = i + direction.x;

            if (!withBorder) {
                [y, x] = this.applyBoundaryRules(y, x);
            }

            if (this.isWithinGridBounds(y, x)) {
                const currentValue = this.grid[y][x];
                if (this.valueSet.has(currentValue)) {
                    neighborsAccount += 1;
                    neighborsTotal += currentValue;
                }
            }
        });

        return neighborsAccount ? [neighborsAccount, Math.round(neighborsTotal / neighborsAccount)] : [0, 0];
    }

    createNextGrid() {
        const nextGrid = [];
        for (let j = 0; j < this.rows; j++) {
            const nextRow = [];
            for (let i = 0; i < this.cols; i++) {
                const typeNeighbors = this.gridTypeNeighbors[j][i];
                const numberNeighbors = this.gridNumberNeighbors[j][i];
                const currentValue = this.grid[j][i];
                const nextCellValue = this.determineNextCellValue(currentValue, typeNeighbors, numberNeighbors);
                nextRow.push(nextCellValue);
            }
            nextGrid.push(nextRow);
        }
        return nextGrid;
    }

    determineNextCellValue(currentValue, typeNeighbors, numberNeighbors) {
        if (this.valueSet.has(currentValue)) {
            if (this.myWindow.birth.has(numberNeighbors)) {
                return currentValue;
            } else {
                return this.DEAD;
            }
        } else if (currentValue === this.DEAD) {
            if (this.myWindow.survival.has(numberNeighbors)) {
                return typeNeighbors;
            } else {
                return this.DEAD;
            }
        } else if (currentValue === this.WALL) {
            return this.WALL;
        }
    }

    // Déplace la grille vers le haut
    moveTop() {
        let nextGrid = this.grid.slice(1);
        nextGrid.push(Array(this.cols).fill(this.DEAD));
        this.grid = nextGrid;
    }

    // Déplace la grille vers le bas
    moveBottom() {
        let nextGrid = [];
        nextGrid.push(Array(this.cols).fill(this.DEAD));
        nextGrid = nextGrid.concat(this.grid.slice(0, this.rows - 1));
        this.grid = nextGrid;
    }

    // Déplace la grille vers la gauche
    moveLeft() {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols - 1; i++) {
                this.grid[j][i] = this.grid[j][i + 1];
            }
            this.grid[j][this.cols - 1] = this.DEAD;
        }
    }

    // Déplace la grille vers la droite
    moveRight() {
        for (let j = 0; j < this.rows; j++) {
            for (let i = this.cols - 1; i > 0; i--) {
                this.grid[j][i] = this.grid[j][i - 1];
            }
            this.grid[j][0] = this.DEAD;
        }
    }
}
