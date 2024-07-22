import {HTML} from "./HTML";
import patternsData from './patterns.json';


export class PatternManager {

    #eventHandler;
    #patterns;
    #config;

    constructor(eventHandler) {
        this.#eventHandler = eventHandler;
        this.#patterns = patternsData.patterns;
        this.#config = {
            "T": 5,
            "B": 5,
            "L": 5,
            "R": 5
        };
    }


    getEventHandler() {
        return this.#eventHandler;
    }

    setEventHandler(value) {
        this.#eventHandler = value;
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

    /**
     * Remplit le sélecteur de motifs avec les options disponibles.
     * Ajoute une option "Choisir" par défaut, suivie de tous les motifs disponibles.
     * Chaque option a comme valeur l'index du motif et comme texte le nom du motif.
     */
    populateSelect() {
        HTML.patternSelect.innerHTML = '<option selected>Choisir</option>';
        this.getPatterns().forEach((pattern, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = pattern.name;
            HTML.patternSelect.appendChild(option);
        });
    }

    /**
     * Configure les écouteurs d'événements pour les éléments interactifs de l'interface utilisateur.
     * - Ajoute un écouteur 'change' au sélecteur de motifs pour appeler addBorder().
     * - Ajoute un écouteur 'click' au bouton d'application de motif pour appeler handleApplyPattern().
     * - Ajoute des écouteurs 'change' à tous les champs de saisie de motif pour appeler addBorder().
     */
    setupEventListeners() {
        HTML.patternSelect.addEventListener('change', () => this.addBorder());
        HTML.applyPatternButton.addEventListener('click', () => this.handleApplyPattern());

        HTML.patternInput.forEach(input => {
            input.addEventListener('change', () => this.addBorder());
        });
    }

    /**
     * Met à jour la configuration avec les valeurs actuelles des champs de saisie.
     * Lit les valeurs des champs de saisie pour le haut (T), le bas (B), la gauche (L) et la droite (R),
     * les convertit en nombres et les stocke dans la configuration.
     */
    updateConfig() {
        this.setConfig({
            "T": Number(HTML.topPatternInput.value),
            "B": Number(HTML.bottomPatternInput.value),
            "L": Number(HTML.leftPatternInput.value),
            "R": Number(HTML.rightPatternInput.value)
        })
    }

    /**
     * Crée une nouvelle grille avec une bordure autour de la grille donnée.
     * Utilise les valeurs de configuration T, B, L, R pour déterminer la taille de la bordure.
     *
     * @param {number[][]} grid - La grille d'origine à laquelle ajouter une bordure.
     * @returns {number[][]} Une nouvelle grille avec la bordure ajoutée.
     */
    createGridWithBorder(grid) {
        const {T, B, L, R} = this.getConfig();
        const width = grid[0].length + L + R;

        return [
            ...Array(T).fill().map(() => Array(width).fill(0)),
            ...grid.map(row => [...Array(L).fill(0), ...row, ...Array(R).fill(0)]),
            ...Array(B).fill().map(() => Array(width).fill(0))
        ];
    }

    /**
     * Rend la grille donnée dans l'élément HTML de prévisualisation.
     * Crée un tableau HTML où chaque cellule représente un élément de la grille.
     * Les cellules avec une valeur de 1 sont colorées en bleu.
     *
     * @param {number[][]} grid - La grille à rendre dans l'interface utilisateur.
     */
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

    /**
     * Ajoute une bordure à la grille sélectionnée et la rend dans l'interface.
     * Met d'abord à jour la configuration, puis récupère la grille sélectionnée.
     * Si une grille est sélectionnée, crée une nouvelle grille avec bordure et la rend.
     *
     * @returns {number[][]|undefined} La nouvelle grille avec bordure, ou undefined si aucune
     * grille n'est sélectionnée.
     */
    addBorder() {
        this.updateConfig();
        const selectedGrid = this.getSelectedGrid();
        if (!selectedGrid) return;

        const newGrid = this.createGridWithBorder(selectedGrid);
        this.renderGrid(newGrid);

        return newGrid;
    }

    /**
     * Gère l'application du motif sélectionné au jeu.
     * Ajoute d'abord une bordure à la grille sélectionnée, puis applique cette nouvelle grille au jeu
     * si un motif est effectivement sélectionné.
     */
    handleApplyPattern() {
        const newGrid = this.addBorder();
        if (!newGrid) return;

        const selectedPattern = this.getSelectedPattern();
        if (selectedPattern) {
            this.applyPatternToGame(newGrid);
        }
    }

    /**
     * Récupère la grille du motif actuellement sélectionné dans le sélecteur.
     *
     * @returns {number[][]|null} La grille du motif sélectionné, ou null si aucun motif n'est sélectionné.
     */
    getSelectedGrid() {
        const selectedIndex = HTML.patternSelect.selectedIndex - 1;
        if (selectedIndex < 0) return null;

        const selectedPattern = this.getPatterns()[selectedIndex];
        // return selectedPattern.grid;
        return this.transformJsonToGrid(selectedPattern);
    }

    transformJsonToGrid(selectedPattern) {
        const length = selectedPattern.length;
        const grid = selectedPattern.grid;
        const gridHeight = grid.length;

        const result = [];
        for (let j = 0; j < gridHeight; j++) {
            const line = new Array(length).fill(0);
            const gridWidth = grid[j].length;
            for (let i = 0; i < gridWidth; i++) {
                let [index, number] = grid[j][i];
                for (let k = 0; k < number; k++) {
                    line[k + index] = 1;
                }
            }
            result.push(line);
        }
        return result;
    }

    /**
     * Récupère l'objet complet du motif actuellement sélectionné dans le sélecteur.
     *
     * @returns {Object|null} L'objet du motif sélectionné, ou null si aucun motif n'est sélectionné.
     */
    getSelectedPattern() {
        const selectedIndex = HTML.patternSelect.selectedIndex - 1;
        return selectedIndex >= 0 ? this.getPatterns()[selectedIndex] : null;
    }

    displayPrincipalAutomate() {
        this.getPatterns().forEach(pattern => {
            if (pattern.name === this.getEventHandler().getApp().getDepartAutomate()) {
                let grid = this.transformJsonToGrid(pattern);
                grid = this.createGridWithBorder(grid);
                this.applyPatternToGame(grid);
            }
        })
        return 3;
    }

    /**
     * Applique la grille donnée au jeu.
     * Met à jour le bouton de démarrage, nettoie la grille existante, formate la nouvelle grille,
     * initialise les grilles du jeu, ajuste les dimensions du canvas et redessine la grille.
     *
     * @param {number[][]} grid - La grille à appliquer au jeu.
     */
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