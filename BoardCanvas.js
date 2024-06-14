export class BoardCanvas {
    constructor(myWindow) {
        this.BACKGROUND_COLOR = "black";
        this.myWindow = myWindow;
        this.valueSet = new Set([1, 2, 3, 4, 9])
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.grid = myWindow.board.grid;

        this.rowCanvas = myWindow.rowCanvas;
        this.columnCanvas = myWindow.columnCanvas;
        this.cellSize = myWindow.cellSize;

        this.setupCanvas();
    }

    setDimensionsCanvas() {
        this.cellSize = this.myWindow.cellSize;
        this.canvas.width = this.columnCanvas * this.cellSize;
        this.canvas.height = this.rowCanvas * this.cellSize;
    }

    setupCanvas() {
        this.setDimensionsCanvas();
        this.ctx.fillStyle = this.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.clearCanvas();
        for (let j = 0; j < this.rowCanvas; j++) {
            for (let i = 0; i < this.columnCanvas; i++) {
                const currentValueCell = this.myWindow.board.grid[j][i]
                if (this.valueSet.has(currentValueCell)) {
                    this.ctx.fillStyle = this.getColorFromIndex(currentValueCell, j, i);
                    this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }

        if (this.myWindow.lines) { this.drawLines(); }
    }


    drawLines() {
        this.ctx.strokeStyle = "rgb(100, 100, 100)";
        this.ctx.lineWidth = 1;

        // Dessinez des lignes horizontales
        for (let j = 0; j < this.rowCanvas; j++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, j * this.cellSize);
            this.ctx.lineTo(this.canvas.width, j * this.cellSize);
            this.ctx.stroke();
        }

        // Dessinez des lignes verticales
        for (let i = 0; i < this.columnCanvas; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
    }


    getColorFromIndex(value, j, i) {
        let color = 100 - 0.2 * this.myWindow.board.gridHistory[j][i];
        if (color < 10) color = 10;

        if (value === 0) {
            return `hsl(0, 0%, 0%)`; // Noir
        }
        if (value === 1) {
            return `hsl(200, ${color}%, 50%)`; // Bleu
        }
        else if (value === 2) {
            return `hsl(0, ${color}%, 50%)`; // Rouge
        }
        else if (value === 3) {
            return `hsl(100, ${color}%, 50%)`; // Vert
        }
        else if (value === 4) {
            return `hsl(60, ${color}%, 50%)`; // Jaune
        }
        else if (value === 9) {
            return `hsl(320, ${color}%, 100%)`; // Blanc
        }

    }
}
