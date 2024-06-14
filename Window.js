import { EventHandler } from "./EventHandler.js";
import { Board } from "./Board.js";
import { BoardCanvas } from "./BoardCanvas.js";

import {
    MIDDLE,
    NAME
} from "./Variables.js";

class Variable {
    constructor() {

    }
}

class Window {


    constructor() {
        this.MIN_CELL_SIZE = 2;
        this.MAX_CELL_SIZE = 50;

        this.MIN_COL = 2
        this.MAX_COL = 50

        this.gameOfLifeRules = {
            classic: {
                birthRule: [3],
                survivalRule: [2, 3]
            },
            highlife: {
                birthRule: [3, 6],
                survivalRule: [2, 3]
            },
            daynight: {
                birthRule: [3, 6, 7, 8],
                survivalRule: [3, 4, 6, 7, 8]
            },
            seeds: {
                birthRule: [2],
                survivalRule: []
            }
        };

        this.MIDDLE = [
            { name: 'N', x: 0, y: -1 },
            { name: 'NE', x: 1, y: -1 },
            { name: 'E', x: 1, y: 0 },
            { name: 'SE', x: 1, y: 1 },
            { name: 'S', x: 0, y: 1 },
            { name: 'SO', x: -1, y: 1 },
            { name: 'O', x: -1, y: 0 },
            { name: 'NO', x: -1, y: -1 }
        ],

        this.birth = new Set([2, 3]);
        this.survival = new Set([3]);
        this.verifyInputRules()

        this.board = undefined;
        this.boardCanvas = undefined;

        this.rowCanvas = 20;
        this.columnCanvas = 20;
        this.cellSize = 12;
        this.border = false;
        this.valueAdd = 0;
        this.typeAdd = "";
        this.move = false;
        this.lines = false;

        this.animation = 2;
        this.rhythm = "continue";
        this.isPlaying = false;

        this.isDrawing = false;

        this.eventHandler = this.createEventHandler();

        this.handleMoveArrowEvents()
        this.initialize();

        this.toggleDrawingEvents();
    }

    createEventHandler() {
        let eventHandler = new EventHandler(this);
        return eventHandler;
    }

    verifyInputRules() {
        for (let i = 0; i < 9 ; i++) {
            const birthCheckbox = document.getElementById(`birthRule${i}`);
            birthCheckbox.checked = this.birth.has(parseInt(birthCheckbox.value));

            const survivalCheckbox = document.getElementById(`survivalRule${i}`);
            survivalCheckbox.checked = this.survival.has(parseInt(survivalCheckbox.value));
        }
    }

    initialize() {
        this.createGame();
        this.createCanvas();
    }

    createGame() {
        this.board = new Board(this);
    }

    createCanvas() {
        const existingCanvases = document.querySelector("canvas");
        const parentCanvas = existingCanvases.parentNode
        parentCanvas.removeChild(existingCanvases)

        let canvas = document.createElement("canvas");

        parentCanvas.appendChild(canvas);
        this.boardCanvas = new BoardCanvas(this);
        this.boardCanvas.drawGrid();
    }

    displayGeneration() {
        let result = `${this.board.generation} (${this.board.isAlive})`;
    }

    calculateNextGeneration() {
        this.board.getNextGeneration();
        this.board.updateHistoryGrid();
        this.board.countAliveCells();
        this.boardCanvas.drawGrid();
        this.displayGeneration();
    }

    toggleAnimation() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startAnimation(this.animation);
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        const millisecondsPerAnimation = 1000 / this.animation;

        this.intervalId = setInterval(() => {
            this.calculateNextGeneration();
        }, millisecondsPerAnimation);
    }

    stopAnimation() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    toggleDrawingEvents() {
        if (this.add) {
            this.removeDrawingEvent();
        } else {
            this.addDrawingEvent();
        }
    }

    addDrawingEvent() {
        this.boardCanvas.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.boardCanvas.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.boardCanvas.canvas.addEventListener('mousemove', this.drawIfDrawing.bind(this));
    }

    removeDrawingEvent() {
        this.boardCanvas.canvas.removeEventListener('mousedown', this.startDrawing.bind(this));
        this.boardCanvas.canvas.removeEventListener('mouseup', this.stopDrawing.bind(this));
        this.boardCanvas.canvas.removeEventListener('mousemove', this.drawIfDrawing.bind(this));
    }

    startDrawing(event) {
        if (this.add) {
            this.isDrawing = true;
            this.draw(event);
        }
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    drawIfDrawing(event) {
        if (this.isDrawing) {
            this.draw(event);
        }
    }

    draw(event) {
        const i = Math.floor(event.offsetX / this.cellSize);
        const j = Math.floor(event.offsetY / this.cellSize);
        if (j >= 0 && j < this.board.gridEnableDraw.length && i >= 0 && i < this.board.gridEnableDraw[j].length) {

            if (!this.board.gridEnableDraw[j][i]) {
                this.writeInGrid(j, i);
                this.boardCanvas.drawGrid();

                this.board.gridEnableDraw[j][i] = true;
                setTimeout(() => {
                    this.board.gridEnableDraw = false;
                }, 1000);
            }
            this.writeInGrid(j, i);
            this.boardCanvas.drawGrid();
        }
    }

    writeInGrid(j, i) {
        if (this.board.grid[j][i] === this.valueAdd) {
            this.board.grid[j][i] = 0;
            this.board.gridHistory[j][i] = 0;
        }

        else {
            this.board.grid[j][i] = this.valueAdd
        };
    }

    clearGrid() {
        for (let j = 0; j < this.rowCanvas; j++) {
            for (let i = 0; i < this.columnCanvas; i++) {
                this.board.grid[j][i] = 0;
                this.board.gridHistory[j][i] = 0;
            }
        }
        console.log(2)
        this.boardCanvas.drawGrid();
    }

    showMoveArrow() {
        const moveArrows = document.querySelectorAll('.input-arrow');
        console.log(moveArrows)
        moveArrows.forEach(arrow => {
            arrow.style.display = "none";
        });
    }

    hideMoveArrow() {
        const moveArrows = document.querySelectorAll('.input-arrow');
        console.log(moveArrows)
        moveArrows.forEach(arrow => {
            arrow.style.display = "block";
        });
    }

    handleMoveArrowEvents() {
        const moveArrows = document.querySelectorAll('.input-arrow');
        moveArrows.forEach(arrow => {
            arrow.addEventListener("click", () => {
                let direction = arrow.classList[1].split("-")[1];
                if (direction === "top") {
                    this.board.moveTop();
                }
                else if (direction === "bottom") {
                    this.board.moveBottom();
                }
                else if (direction === "right") {
                    this.board.moveRight();
                }
                else if (direction === "left") {
                    this.board.moveLeft();
                }
                this.boardCanvas.drawGrid();
            })
        })
    }

}


const window = new Window();
window.initialize();