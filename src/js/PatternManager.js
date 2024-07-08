import { HTML } from "./HTML";
import patternsData from './patterns.json';


export class PatternManager {
    constructor(eventHandler) {
        this.eventHandler = eventHandler;
        this.patterns = patternsData.patterns;
        this.config = {
            "T": 5, "B": 5, "L": 5, "R": 5
        }
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
            console.log(pattern.name)
            option.textContent = pattern.name;
            HTML.patternSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        HTML.patternSelect.addEventListener('change', (event) => this.handleSelectChange(event));
        HTML.applyPatternButton.addEventListener('click', () => this.handleApplyPattern());

        HTML.topPatternInput.addEventListener('change', (event) => {
            this.addBorder(event.target);
        });

        HTML.bottomPatternInput.addEventListener('change', (event) => {
            this.addBorder(event.target);
        });

        HTML.leftPatternInput.addEventListener('change', (event) => {
            this.addBorder(event.target);
        });

        HTML.rightPatternInput.addEventListener('change', (event) => {
            this.addBorder(event.target);
        });
    }


    addBorder(target) {
        this.config = {
            "T": HTML.topPatternInput.value,
            "B": HTML.bottomPatternInput.value,
            "L": HTML.leftPatternInput.value,
            "R": HTML.rightPatternInput.value
        }

        const selectedIndex = HTML.patternSelect.selectedIndex - 1;
        if (selectedIndex < 0) return;

        const selectedPattern = this.patterns[selectedIndex];
        const seletedGrid = selectedPattern.grid
        console.log(target.dataset.direction);

        // Récupérez les dimensions de la grille
        const gridRows = seletedGrid.length;
        const gridCols = seletedGrid[0].length;

        // Créez une nouvelle grille avec les lignes et colonnes supplémentaires
        let newGrid = [];

        // Ajoutez les lignes du haut
        for (let i = 0; i < this.config.T; i++) {
            const row = new Array(gridCols).fill(0);
            newGrid.push(row);
        }

        newGrid = [...newGrid, ...seletedGrid]

        for (let i = 0; i < this.config.B; i++) {
            const row = new Array(gridCols).fill(0);
            newGrid.push(row);
        }

        console.log(newGrid)

        HTML.patternTable.innerHTML = '';
        HTML.patternTable.style.width = `${100 * 0.6}%`;

        const columns = newGrid[0].length;
        const previewWidth = HTML.patternPreview.offsetWidth;
        const cellSize = previewWidth / columns;

        newGrid.forEach(row => {
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


    handleSelectChange(event) {
        this.config = {
            "T": 5, "B": 5, "L": 5, "R": 5
        }
        const selectedPattern = this.patterns[event.target.value];
        if (selectedPattern) {
            this.displayPattern1(selectedPattern);
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
            const tr = document.createElement('tr');
            tr.style.height = `${cellSize * 0.6}px`;
            row.forEach(cell => {
                const td = document.createElement('td');
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

    cloneGrid(gridData) {
        return gridData.map(row => row.slice());
    }

    displayPattern1(pattern) {
        HTML.patternTable.innerHTML = '';
        HTML.patternTable.style.width = `${100 * 0.6}%`;

        const columns = pattern.grid[0].length;
        const previewWidth = HTML.patternPreview.offsetWidth;
        const cellSize = previewWidth / columns;
        const grid = pattern.grid;

        pattern.grid.forEach(row => {
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

    apply() {
        // const newGrid = addBorder(pattern.grid, borderConfig);

        // const borderConfig = {
        //     top: 3,
        //     right: 3,
        //     bottom: 3,
        //     left: 3
        //   };

        // function addBorder(grid, borderConfig) {
        //   const { top, right, bottom, left } = borderConfig;
        //   const columns = grid[0].length;
        //   const rows = grid.length;

        //   const maxDimension = Math.max(columns + left + right, rows + top + bottom);
        //   const newColumns = maxDimension;
        //   const newRows = maxDimension;

        //   const topOffset = Math.floor((newRows - rows) / 2);
        //   const leftOffset = Math.floor((newColumns - columns) / 2);

        //   const newGrid = Array.from({ length: newRows }, (_, y) =>
        //     Array.from({ length: newColumns }, (_, x) => {
        //       if (y < topOffset || y >= topOffset + rows || x < leftOffset || x >= leftOffset + columns) {
        //         return 0;
        //       } else {
        //         return grid[y - topOffset][x - leftOffset];
        //       }
        //     })
        //   );

        //   return newGrid;
        // }
    }


    handleApplyPattern() {
        const selectedPattern = this.patterns[HTML.patternSelect.value];
        if (selectedPattern) {
            this.applyPatternToGame(selectedPattern);
        }
    }

    applyPatternToGame(pattern) {
        this.eventHandler.updateStartButton(true);
        this.eventHandler.getApp().cleanGrid();
        this.eventHandler.getApp().formatGrid(pattern.grid.length, pattern.grid[0].length, this.eventHandler.getApp().getCellSize());
        this.eventHandler.getApp().getBoard().initializeGrids(pattern.grid);
        this.eventHandler.getApp().getBoardCanvas().setDimensionsCanvas();
        this.eventHandler.getApp().getBoardCanvas().drawGrid();
    }
}

