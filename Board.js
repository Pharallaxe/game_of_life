import { conf } from './configuration.js';


export class Board {
    #app;
    #isAlive;
    #generation;
    #totalAlive;

    #grid;
    #gridHistory;
    #gridNumberNeighbors;
    #gridTypeNeighbors;
    #gridEnableDraw;

    getApp() { return this.#app; }

    getIsAlive() { return this.#isAlive; }
    setIsAlive(value) { this.#isAlive = value; }

    getGeneration() { return this.#generation; }
    setGeneration(value) { this.#generation = value; }

    getTotalAlive() { return this.#totalAlive; }
    setTotalAlive(value) { this.#totalAlive = value; }

    // Grille principale
    getGrid() { return this.#grid; }
    setGrid(value) { this.#grid = value; }
    getGridValue(y, x) { return this.#grid[y][x]; }
    setGridValue(y, x, value) { this.#grid[y][x] = value; }

    // Historique de la grille
    getGridHistory() { return this.#gridHistory; }
    setGridHistory(value) { this.#gridHistory = value; }
    getGridHistoryValue(y, x) { return this.#gridHistory[y][x]; }
    setGridHistoryValue(y, x, value) { this.#gridHistory[y][x] = value; }

    // Nombre de voisins dans la grille
    getGridNumberNeighbors() { return this.#gridNumberNeighbors; }
    setGridNumberNeighbors(value) { this.#gridNumberNeighbors = value; }
    getGridNumberNeighborsValue(y, x) { return this.#gridNumberNeighbors[y][x]; }
    setGridNumberNeighborsValue(y, x, value) { this.#gridNumberNeighbors[y][x] = value; }

    // Type de voisins dans la grille
    getGridTypeNeighbors() { return this.#gridTypeNeighbors; }
    setGridTypeNeighbors(value) { this.#gridTypeNeighbors = value; }
    getGridTypeNeighborsValue(y, x) { return this.#gridTypeNeighbors[y][x]; }
    setGridTypeNeighborsValue(y, x, value) { this.#gridTypeNeighbors[y][x] = value; }

    // Activation du dessin sur la grille
    getGridEnableDraw() { return this.#gridEnableDraw; }
    setGridEnableDraw(value) { this.#gridEnableDraw = value; }
    getGridEnableDrawValue(y, x) { return this.#gridEnableDraw[y][x]; }
    setGridEnableDrawValue(y, x, value) { this.#gridEnableDraw[y][x] = value; }



    constructor(app) {
        this.#app = app;
        this.isAlive = 0;
        this.generation = 0;
        this.totalAlive = 0

        this.grid = this.createGrid();
        this.gridHistory = this.createGrid();
        this.gridNumberNeighbors = this.createGrid();
        this.gridTypeNeighbors = this.createGrid();
        this.gridEnableDraw = this.createGrid();
    }

    getRandomCellState() {
        // Génère un nombre aléatoire entre 0 et 1
        const random = Math.random();
    
        // Calcule la distribution cumulative
        let cumulativeProbability = 0;
        for (let i = 0; i < this.getApp().getWeights().length; i++) {
            cumulativeProbability += this.getApp().getWeights()[i];
            if (random <= cumulativeProbability) {
                return i;
            }
        }
    
        // Retourne DEAD par défaut (ne devrait pas se produire)
        return conf.DEAD;
    }

    // Méthode pour initialiser la grille avec des cellules mortes
    createGrid() {
        return Array.from({ length: this.getApp().getRowCanvas() }, () => 
            Array.from({ length: this.getApp().getColumnCanvas() }, () =>
                this.getApp().getRandomize() ? this.getRandomCellState() : conf.DEAD
            )
        );
    }

    applyPattern(pattern, startY, startX, state = conf.ALIVE1) {
        pattern.forEach(([dy, dx]) => {
            const y = startY + dy;
            const x = startX + dx;
            if (y >= 0 && y < this.getApp().getRowCanvas() && x >= 0 && x < this.getApp().getColumnCanvas()) {
                this.setGridValue(y, x, state);
            }
        });
    }

    // Calcule la prochaine génération du jeu
    getNextGeneration() {
        this.setGeneration(this.getGeneration() + 1);
        this.calculateNeighbors();
        const nextGrid = this.createNextGrid();
        this.setGrid(nextGrid)
        this.updateHistoryGrid();
    }

    // Met à jour la grille d'historique pour l'évaluation des tendances
    updateHistoryGrid() {
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            for (let i = 0; i < this.getApp().getColumnCanvas(); i++) {
                if (conf.aliveValuesSet.has(this.getGridValue(j, i))) {
                    this.setGridHistoryValue(j, i, this.getGridHistoryValue(j,i) + 1);
                } else {
                    this.setGridHistoryValue(j, i, 0)
                }
            }
        }
    }

    isWithinGridBounds(j, i) {
        return j >= 0 && j < this.getApp().getRowCanvas() && i >= 0 && i < this.getApp().getColumnCanvas();
    }

    applyBoundaryRules(j, i) {
        if (j === -1) { j = this.getApp().getRowCanvas() - 1; }
        if (j === this.getApp().getRowCanvas()) { j = 0; }
        if (i === -1) { i = this.getApp().getColumnCanvas() - 1; }
        if (i === this.getApp().getColumnCanvas()) { i = 0; }
        if (j === -2) { j = this.getApp().getRowCanvas() - 2; }
        if (j === this.getApp().getRowCanvas() + 1) { j = 1; }
        if (i === -2) { i = this.getApp().getColumnCanvas() - 2; }
        if (i === this.getApp().getColumnCanvas() + 1) { i = 1; }

        return [j, i];
    }


    // Compte les voisins d'une cellule donnée
    calculateNeighbors(y, x) {
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            for (let i = 0; i < this.getApp().getColumnCanvas(); i++) {
                const [
                    numberNeighbors,
                    typeNeighbors
                ] = this.countNeighbors(j, i, this.getApp().getBorder());
                this.setGridNumberNeighborsValue(j, i, numberNeighbors);
                this.setGridTypeNeighborsValue(j, i, typeNeighbors);
            }
        }
    }

    countAliveCells() {
        let isAlive = 0;
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            for (let i = 0; i < this.getApp().getColumnCanvas(); i++) {
                if (conf.aliveValuesSet.has(this.getGrid(j, i))) {
                    isAlive++; // Incrémente le compteur si la cellule est vivante
                }
            }
        }
        this.setIsAlive(isAlive);
        this.setTotalAlive(this.getTotalAlive() + isAlive);
    }

    countNeighbors(j, i, withBorder) {
        let neighborsAccount = 0;
        let neighborsTotal = 0;

        conf.MIDDLE.forEach(direction => {
            let [y, x] = [j + direction.y, i + direction.x]

            if (!withBorder) [y, x] = this.applyBoundaryRules(y, x);

            if (this.isWithinGridBounds(y, x)) {
                const currentValue = this.getGrid(y, x);
                if (conf.aliveValuesSet.has(currentValue)) {
                    neighborsAccount += 1;
                    neighborsTotal += currentValue;
                }
            }
        });

        return neighborsAccount ? [neighborsAccount, Math.round(neighborsTotal / neighborsAccount)] : [0, 0];
    }

    createNextGrid() {
        const nextGrid = [];
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            const nextRow = [];
            for (let i = 0; i < this.getApp().getColumnCanvas(); i++) {
                const typeNeighbors = this.getGridTypeNeighborsValue(j, i);
                const numberNeighbors = this.getGridNumberNeighborsValue(j, i);
                const currentValue = this.getGrid(j, i);
                const nextCellValue = this.determineNextCellValue(currentValue, typeNeighbors, numberNeighbors);
                nextRow.push(nextCellValue);
            }
            nextGrid.push(nextRow);
        }
        return nextGrid;
    }

    determineNextCellValue(currentValue, typeNeighbors, numberNeighbors) {
        if (conf.aliveValuesSet.has(currentValue)) {
            if (this.getApp().getBirth().has(numberNeighbors)) {
                return currentValue;
            } else {
                return conf.DEAD;
            }
        } else if (currentValue === conf.DEAD) {
            if (this.getApp().getSurvival().has(numberNeighbors)) {
                return typeNeighbors;
            } else {
                return conf.DEAD;
            }
        } else if (currentValue === conf.WALL) {
            return conf.WALL;
        }
    }

    // Déplace la grille vers le haut
    moveTop() {
        let nextGrid = this.getGrid().slice(1);
        nextGrid.push(Array(this.getApp().getColumnCanvas()).fill(conf.DEAD));
        this.setGrid(nextGrid);
    }

    // Déplace la grille vers le bas
    moveBottom() {
        let nextGrid = [];
        nextGrid.push(Array(this.getApp().getColumnCanvas()).fill(conf.DEAD));
        nextGrid = nextGrid.concat(this.getGrid().slice(0, this.getApp().getRowCanvas() - 1));
        this.setGrid(nextGrid);
    }

    // Déplace la grille vers la gauche
    moveLeft() {
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            for (let i = 0; i < this.getApp().getColumnCanvas() - 1; i++) {
                this.setGridValue(j, i, this.getGridValue(j, i + 1));
            }
            this.setGridValue(j, this.getApp().getColumnCanvas() - 1, conf.DEAD);
        }
    }

    // Déplace la grille vers la droite
    moveRight() {
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            for (let i = this.getApp().getColumnCanvas() - 1; i > 0; i--) {
                this.setGridValue(j, i, this.getGridValue(j, i - 1));
            }
            this.setGridValue(j, 0, conf.DEAD);
        }
    }
}
