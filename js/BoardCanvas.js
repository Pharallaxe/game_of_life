import { conf } from './configuration.js';

export class BoardCanvas {
    #app;
    #canvas;
    #ctx;

    getApp() { return this.#app; }

    getCanvas() {return this.#canvas;}

    getCtx() {return this.#ctx;}

    constructor(app) {
        this.#app = app;
        this.#canvas = document.querySelector('canvas');
        this.#ctx = this.#canvas.getContext('2d');
        this.setupCanvas();
    }

    setDimensionsCanvas() {
        this.getCanvas().width = this.getApp().getColumnCanvas() * this.getApp().getCellSize();
        this.getCanvas().height = this.getApp().getRowCanvas() * this.getApp().getCellSize();
    }

    setupCanvas() {
        this.setDimensionsCanvas();
        this.getCtx().fillStyle = conf.canvasBgColor;
        this.getCtx().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    }

    clearCanvas() {
        this.getCtx().clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    }

    drawGrid() {
        this.clearCanvas();
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            for (let i = 0; i < this.getApp().getColumnCanvas(); i++) {
                const currentValueCell = this.getApp().getBoard().getGridValue(j, i);
                if (conf.notDeadValueSet.has(currentValueCell)) {
                    this.getCtx().fillStyle = this.getColorFromIndex(currentValueCell, j, i);
                    this.getCtx()
                        .fillRect(
                            i * this.getApp().getCellSize(),
                            j * this.getApp().getCellSize(),
                            this.getApp().getCellSize(),
                            this.getApp().getCellSize());
                }
            }
        }

        if (this.getApp().getLines()) { this.drawLines(); }
    }


    drawLines() {
        this.getCtx().strokeStyle = 'rgb(100, 100, 100)';
        this.getCtx().lineWidth = 1;

        // Dessiner des lignes horizontales
        for (let j = 0; j < this.getApp().getRowCanvas(); j++) {
            this.getCtx().beginPath();
            this.getCtx().moveTo(0, j * this.getApp().getCellSize());
            this.getCtx().lineTo(this.getCanvas().width, j * this.getApp().getCellSize());
            this.getCtx().stroke();
        }

        // Dessiner des lignes verticales
        for (let i = 0; i < this.getApp().getColumnCanvas(); i++) {
            this.getCtx().beginPath();
            this.getCtx().moveTo(i * this.getApp().getCellSize(), 0);
            this.getCtx().lineTo(i * this.getApp().getCellSize(), this.getCanvas().height);
            this.getCtx().stroke();
        }
    }


    getColorFromIndex(value, j, i) {
        let color = 100;
        if (this.getApp().getHistory()) {
            color -= 0.2 * this.getApp().getBoard().getGridHistoryValue(j, i);
            if (color < 10) color = 10;
        }

        switch (value) {
            case 0: return `hsl(0, 0%, 0%)`; // Noir
            case 1: return `hsl(200, ${color}%, 50%)`; // Bleu
            case 2: return `hsl(0, ${color}%, 50%)`; // Rouge
            case 3: return `hsl(60, ${color}%, 50%)`; // Jaune
            case 4: return `hsl(100, ${color}%, 50%)`; // Vert
            case 9: return `hsl(320, ${color}%, 100%)`; // Blanc
            default: return '';
        }
    }
}
