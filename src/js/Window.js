import { EventHandler } from './EventHandler.js';
import { Board } from './Board.js';
import { BoardCanvas } from './BoardCanvas.js';
import { HTML } from './HTML.js';

import { $ } from './utils.js';
import { Config } from './Config.js';

class Window {

    #board;
    #boardCanvas;
    #rowCanvas;
    #columnCanvas;
    #cellSize;
    #valueAdd;
    #birth;
    #survival;
    #randomize;
    #weights;
    #border;
    #history;
    #lines;
    #saves;
    #rapidity;
    #step;
    #isPlaying;
    #enableDraw;
    #isDrawing;
    #departAutomate;
    #eventHandler;


    getBoard() {
        return this.#board;
    }

    setBoard(value) {
        this.#board = value;
    }

    getBoardCanvas() {
        return this.#boardCanvas;
    }

    setBoardCanvas(value) {
        this.#boardCanvas = value;
    }

    getEventHandler() {
        return this.#eventHandler;
    }

    setEventHandler(value) {
        this.#eventHandler = value;
    }

    getRowCanvas() {
        return this.#rowCanvas;
    }

    setRowCanvas(value) {
        this.#rowCanvas = value;
    }

    getColumnCanvas() {
        return this.#columnCanvas;
    }

    setColumnCanvas(value) {
        this.#columnCanvas = value;
    }

    getCellSize() {
        return this.#cellSize;
    }

    setCellSize(value) {
        this.#cellSize = value;
    }

    getValueAdd() {
        return this.#valueAdd;
    }

    setValueAdd(value) {
        this.#valueAdd = value;
    }

    getBirth() {
        return this.#birth;
    }

    setBirth(value) {
        this.#birth = value;
    }

    getSurvival() {
        return this.#survival;
    }

    setSurvival(value) {
        this.#survival = value;
    }

    getRandomize() {
        return this.#randomize;
    }

    setRandomize(value) {
        this.#randomize = value;
    }

    getWeights() {
        return this.#weights;
    }

    setWeights(value) {
        this.#weights = value;
    }

    getBorder() {
        return this.#border;
    }

    setBorder(value) {
        this.#border = value;
    }

    getHistory() {
        return this.#history;
    }

    setHistory(value) {
        this.#history = value;
    }

    getLines() {
        return this.#lines;
    }

    setLines(value) {
        this.#lines = value;
    }

    getSaves() {
        return this.#saves;
    }

    setSaves(key, value) {
        this.#saves[key] = value;
    }

    getRapidity() {
        return this.#rapidity;
    }

    setRapidity(value) {
        this.#rapidity = value;
    }

    getStep() {
        return this.#step;
    }

    setStep(value) {
        this.#step = value;
    }

    getIsPlaying() {
        return this.#isPlaying;
    }

    setIsPlaying(value) {
        this.#isPlaying = value;
    }

    getEnableDraw() {
        return this.#enableDraw;
    }

    setEnableDraw(value) {
        this.#enableDraw = value;
    }

    getIsDrawing() {
        return this.#isDrawing;
    }

    setIsDrawing(value) {
        this.#isDrawing = value;
    }

    getDepartAutomate() {
        return this.#departAutomate;
    }

    setDepartAutomate(value) {
        this.#departAutomate = value;
    }

    constructor() {
        this.#board = undefined;
        this.#boardCanvas = undefined;
        this.#eventHandler = undefined;
        this.#rowCanvas = 20;                 // Le nombre de lignes par défaut pour un canvas
        this.#columnCanvas = 20;              // Le nombre de colonnes par défault pour un canvas
        this.#cellSize = 12;                  // La taille de cellule par défaut
        this.#valueAdd = 1;                   // La cellule d'ajout par défaut est la 1
        this.#birth = new Set([2, 3]); // Le nombre de cellules requises pour naitre
        this.#survival = new Set([3]); // Le nombre de cellules reqyuse
        this.#randomize = false;              // La création randomisée n'est pas activée.
        this.#weights = [.9, .1, 0, 0, 0];    // Les poids par défaut dans la création randomisée
        this.#border = false;                 // Les bordures du canvas ne sont pas activées.
        this.#history = false;                // L'historique n'est pas activé
        this.#lines = true;                  // Les lignes ne sont pas activées.
        this.#saves = {};                     // Ensemble des sauvegardes
        this.#rapidity = 5;                      // Rapidité d'animation
        this.#step = 1;                       // Nombre de génération entre pas
        this.#isPlaying = false;              // L'animation n'est pas activée
        this.#enableDraw = false;             // Le dessin n'est pas activé
        this.#isDrawing = false;              // ON n'est pas en train de dessiner
        this.#departAutomate = "quasar-next"; // L'automate de départ.

        this.initialize();
    }

    verifyInputRules() {
        for (let i = 0; i < 9; i++) {
            const birthCheckbox = $(`#birthRule${i}`);
            birthCheckbox.checked = this.getBirth().has(parseInt(birthCheckbox.value));

            const survivalCheckbox = $(`#survivalRule${i}`);
            survivalCheckbox.checked = this.getSurvival().has(parseInt(survivalCheckbox.value));
        }
    }

    initialize() {
        this.verifyInputRules();
        this.setEventHandler(new EventHandler(this));
        this.setBoard(new Board(this));
        this.resetCanvas();
        this.setBoardCanvas(new BoardCanvas(this));
        this.getEventHandler().getPatternManager().displayPrincipalAutomate();
        this.toggleDrawingEvents();
    }

    resetCanvas() {
        // Supprimer de l'ancien canvas
        const existingCanvases = $('canvas');
        const parentCanvas = existingCanvases.parentNode;
        parentCanvas.removeChild(existingCanvases);

        // Créer un nouveau canvas
        let canvas = document.createElement('canvas');
        parentCanvas.appendChild(canvas);
    }

    /**
     * Formate la grille en fonction du nombre de lignes, de colonnes et de la taille des cellules.
     *
     * @param {number} row - Le nombre de lignes de la grille.
     * @param {number} col - Le nombre de colonnes de la grille.
     * @param {number} cellSize - La taille initiale des cellules.
     * @returns {void}
     */
    formatGrid(row, col, cellSize) {
        const canvasSize = HTML.canvasContainer.offsetWidth - 20

        // Mise à jour de la taille des cellules en fonction de la largeur.   
        const currentMaxCellSize = Math.min(parseInt(canvasSize / col), Config.MAX_CELL_SIZE, cellSize);

        this.setRowCanvas(row);
        this.setColumnCanvas(col);
        this.setCellSize(currentMaxCellSize);
    }

    cleanGrid() {
        this.clearGrid();
        this.stopAnimation();
        this.updateBottomNav(true);
    }

    calculateNextGeneration(isAnimating = false) {
        const numberGeneration = isAnimating ? 1 : this.getStep();
        for (let i = 0; i < numberGeneration; i++) {
            this.getBoard().getNextGeneration();
            this.getBoard().updateHistoryGrid();
            this.getBoard().countAliveCells();
            this.updateBottomNav();
        }
        this.getBoardCanvas().drawGrid();
    }

    updateBottomNav(reset = false) {
        HTML.generation.textContent = reset ? "0" : this.getBoard().getGeneration();
        HTML.livingCells.textContent = reset ? "0" : this.getBoard().getIsAlive();
        HTML.totalCells.textContent = reset ? "0" : this.getBoard().getTotalAlive();
        if (reset) {
            this.getBoard().setGeneration(0);
            this.getBoard().setIsAlive(0);
            this.getBoard().setTotalAlive(0);
        }
    }

    setCellSizeZoomIn() {
        let zoom = this.getCellSize() + 1;
        if (zoom > Config.MAX_CELL_SIZE) zoom = Config.MAX_CELL_SIZE;

        const canvasSize = HTML.canvasContainer.offsetWidth - 20

        // Mise à jour de la taille des cellules en fonction de la largeur.   
        const currentMaxCellSize = Math.min(
            Math.floor(canvasSize / this.getColumnCanvas()),
            zoom)
        this.setCellSize(currentMaxCellSize);
        this.getBoardCanvas().setupCanvas();
        this.getBoardCanvas().drawGrid();
    }

    setCellSizeZoomOut() {
        let zoom = this.getCellSize() - 1;
        if (zoom < Config.MIN_CELL_SIZE) zoom = Config.MIN_CELL_SIZE;
        this.setCellSize(zoom);
        this.getBoardCanvas().setupCanvas();
        this.getBoardCanvas().drawGrid();
    }

    toggleAnimation() {
        this.setIsPlaying(!this.getIsPlaying());
        if (this.getIsPlaying()) this.startAnimation(this.getRapidity());
        else this.stopAnimation();
    }

    startAnimation() {
        this.intervalId = setInterval(() => {
            this.calculateNextGeneration(true);
        }, 1000 / this.getRapidity());
    }

    stopAnimation() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    toggleDrawingEvents() {
        if (this.getEnableDraw()) this.addDrawingEvent();
        else this.removeDrawingEvent();
    }

    addDrawingEvent() {
        this.getBoardCanvas().getCanvas().addEventListener('mousedown', this.startDrawing.bind(this));
        this.getBoardCanvas().getCanvas().addEventListener('mouseup', this.stopDrawing.bind(this));
        this.getBoardCanvas().getCanvas().addEventListener('mousemove', this.drawIfDrawing.bind(this));
    }

    removeDrawingEvent() {
        this.getBoardCanvas().getCanvas().removeEventListener('mousedown', this.startDrawing.bind(this));
        this.getBoardCanvas().getCanvas().removeEventListener('mouseup', this.stopDrawing.bind(this));
        this.getBoardCanvas().getCanvas().removeEventListener('mousemove', this.drawIfDrawing.bind(this));
    }

    startDrawing(event) {
        if (this.getEnableDraw()) {
            this.setIsDrawing(true);
            this.draw(event);
        }
    }

    stopDrawing() {
        this.setIsDrawing(false);
    }

    drawIfDrawing(event) {
        if (this.getIsDrawing()) this.draw(event);
    }

    draw(event) {
        const i = Math.floor(event.offsetX / this.getCellSize());
        const j = Math.floor(event.offsetY / this.getCellSize());
        if (
            j >= 0 &&
            j < this.getBoard().getGridEnableDraw().length &&
            i >= 0 &&
            i < this.getBoard().getGridEnableDraw()[j].length
        ) {
            this.writeInGrid(j, i);
            this.getBoardCanvas().drawGrid();
        }
    }

    writeInGrid(j, i) {
        const currentValue = this.getBoard().getGridValue(j, i);
        let newValue;

        if (currentValue === this.getValueAdd()) newValue = 0;
        else newValue = this.getValueAdd();

        this.getBoard().setGridValue(j, i, newValue);
        if (newValue === 0) this.getBoard().setGridHistoryValue(j, i, 0);
    }

    clearGrid() {
        for (let j = 0; j < this.getRowCanvas(); j++) {
            for (let i = 0; i < this.getColumnCanvas(); i++) {
                this.getBoard().setGridValue(j, i, 0);
                this.getBoard().setGridHistoryValue(j, i, 0);
            }
        }
        this.getBoardCanvas().drawGrid();
    }
}


document.addEventListener('DOMContentLoaded', function () {
    new Window();

});

