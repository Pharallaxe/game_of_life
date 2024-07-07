import {HTML} from "./HTML";
import patternsData from './patterns.json';


export class PatternManager {
    constructor(eventHandler) {
        this.eventHandler = eventHandler;
        this.patterns = patternsData.patterns;
    }

    init() {
        this.loadPatterns();
        this.setupEventListeners();
    }

    loadPatterns() {
        this.populateSelect();
    }

    populateSelect() {
        HTML.patternSelect.innerHTML = '<option selected>Choisir</option>';
        this.patterns.forEach((pattern, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = pattern.name;
            HTML.patternSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        HTML.patternSelect.addEventListener('change', (event) => this.handleSelectChange(event));
        HTML.applyPatternButton.addEventListener('click', () => this.handleApplyPattern());
    }

    handleSelectChange(event) {
        const selectedPattern = this.patterns[event.target.value];
        if (selectedPattern) {
            this.displayPattern(selectedPattern);
        }
    }

    displayPattern(pattern) {
        HTML.patternPreview.innerHTML = '';
        const pDescription = document.createElement('p');
        pDescription.textContent = pattern.description;

        const table = document.createElement('table');
        table.id = 'patternPreviewTable';
        table.style.width = `${100 * 0.6}%`;
        const columns = pattern.grid[0].length;
        const previewWidth = HTML.patternPreview.offsetWidth;

        const cellSize = previewWidth / columns;

        pattern.grid.forEach(row => {
            console.log(row)
            const tr = document.createElement('tr');
            tr.style.height = `${cellSize * 0.6}px`;
            row.forEach(cell => {
                const td = document.createElement('td');
                td.className = cell ? 'alive' : 'dead';
                td.style.width = `${cellSize}px`;
                if (cell === 1) {
                    td.style.backgroundColor = "hsl(200, 100%, 50%)"
                }
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        HTML.patternPreview.appendChild(pDescription);
        HTML.patternPreview.appendChild(table);
    }


    handleApplyPattern() {
        const selectedPattern = this.patterns[HTML.patternSelect.value];
        if (selectedPattern) {
            this.applyPatternToGame(selectedPattern);
        }
    }

    applyPatternToGame(pattern) {
        console.log('Appliquer le pattern : \n', pattern.grid);
        this.eventHandler.updateStartButton(true);
        this.eventHandler.getApp().cleanGrid();
        this.eventHandler.getApp().formatGrid(pattern.grid.length, pattern.grid[0].length, this.eventHandler.getApp().getCellSize());
        this.eventHandler.getApp().getBoard().initializeGrids(pattern.grid);
        this.eventHandler.getApp().getBoardCanvas().setDimensionsCanvas();
        this.eventHandler.getApp().getBoardCanvas().drawGrid();
    }
}

