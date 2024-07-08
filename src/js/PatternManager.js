import {HTML} from "./HTML";
import patternsData from './patterns.json';


export class PatternManager {

    #eventHandler;
    #patterns;
    #config;

    constructor(eventHandler) {
        this.#eventHandler = eventHandler;
        this.#patterns = patternsData.patterns;
        this.#config = {};
        this._eventHandler = eventHandler;
    }


    getEventHandler() {
        return this._eventHandler;
    }

    setEventHandler(value) {
        this._eventHandler = value;
    }

    getPatterns() {
        return this.#patterns;
    }

    setPatterns(value) {
        this.#patterns = value;
    }

    getConfig() {
        return this.#config;
    }

    setConfig(value) {
        this.#config = value;
    }

    init() {
        this.populateSelect();
        this.setupEventListeners();
    }

    populateSelect() {
        HTML.patternSelect.innerHTML = '<option selected>Choisir</option>';
        this.getPatterns().forEach((pattern, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = pattern.name;
            HTML.patternSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        HTML.patternSelect.addEventListener('change', () => this.addBorder());
        HTML.applyPatternButton.addEventListener('click', () => this.handleApplyPattern());

        HTML.patternInput.forEach(input => {
            input.addEventListener('change', () => this.addBorder());
        });
    }

    updateConfig() {
        this.setConfig({
            "T": Number(HTML.topPatternInput.value),
            "B": Number(HTML.bottomPatternInput.value),
            "L": Number(HTML.leftPatternInput.value),
            "R": Number(HTML.rightPatternInput.value)
        })
    }

    createGridWithBorder(grid) {
        const {T, B, L, R} = this.getConfig();
        const width = grid[0].length + L + R;

        return [
            ...Array(T).fill().map(() => Array(width).fill(0)),
            ...grid.map(row => [...Array(L).fill(0), ...row, ...Array(R).fill(0)]),
            ...Array(B).fill().map(() => Array(width).fill(0))
        ];
    }

    renderGrid(grid) {
        HTML.patternTable.innerHTML = '';
        HTML.patternTable.style.width = `${100 * 0.6}%`;

        const columns = grid[0].length;
        const previewWidth = HTML.patternPreview.offsetWidth;
        const cellSize = previewWidth / columns;

        grid.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.height = `${cellSize * 0.6}px`;
            row.forEach(cell => {
                const td = document.createElement('td');
                td.style.width = `${cellSize}px`;
                if (cell === 1) {
                    td.style.backgroundColor = "hsl(200, 100%, 50%)";
                }
                tr.appendChild(td);
            });
            HTML.patternTable.appendChild(tr);
        });
    }

    addBorder() {
        this.updateConfig();
        const selectedGrid = this.getSelectedGrid();
        if (!selectedGrid) return;

        const newGrid = this.createGridWithBorder(selectedGrid);
        this.renderGrid(newGrid);

        return newGrid;
    }

    handleApplyPattern() {
        const newGrid = this.addBorder();
        if (!newGrid) return;

        const selectedPattern = this.getSelectedPattern();
        if (selectedPattern) {
            this.applyPatternToGame(newGrid);
        }
    }

    // Nouvelles méthodes d'aide
    getSelectedGrid() {
        const selectedIndex = HTML.patternSelect.selectedIndex - 1;
        if (selectedIndex < 0) return null;

        const selectedPattern = this.getPatterns()[selectedIndex];
        return selectedPattern.grid;
    }

    getSelectedPattern() {
        const selectedIndex = HTML.patternSelect.selectedIndex - 1;
        return selectedIndex >= 0 ? this.getPatterns()[selectedIndex] : null;
    }

    applyPatternToGame(grid) {
        this.getEventHandler().updateStartButton(true);
        this.getEventHandler().getApp().cleanGrid();
        this.getEventHandler().getApp().formatGrid(
            grid.length,
            grid[0].length,
            this.getEventHandler().getApp().getCellSize()
        );
        this.getEventHandler().getApp().getBoard().initializeGrids(grid);
        this.getEventHandler().getApp().getBoardCanvas().setDimensionsCanvas();
        this.getEventHandler().getApp().getBoardCanvas().drawGrid();
    }
}