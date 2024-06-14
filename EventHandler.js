export class EventHandler {
    constructor(myWindow) {
        this.myWindow = myWindow;

        // Initialisation globale
        this.initialize();
    }

    validateInput(inputElement, minValue, maxValue) {
        let value = parseInt(inputElement.value, 10);

        if (isNaN(value)) {
            inputElement.value = minValue;
        } else if (value > maxValue) {
            inputElement.value = maxValue;
        } else if (value < minValue) {
            inputElement.value = minValue;
        }
    }

    // Fonction principale pour initialiser tous les événements
    initialize() {
        this.initializeConfigurerModal();
        this.initializeChargerModal();
        this.initializeEnregistrerModal();
        this.initializeDefinirReglesModal();
        this.initializePredefiniesModal();
        this.initializeAjoutRapideModal();
        this.initializePasAPasModal();
        this.initializeVitesseModal();
        this.initializeIconEvents();
        this.initializeCanvasEvents();
    }

    // Initialiser les événements pour la modale Configurer Plateau
    initializeConfigurerModal() {
        const rowsInput = document.querySelector('#configurerModal #rows');
        const columnsInput = document.querySelector('#configurerModal #columns');
        const cellSizeInput = document.querySelector('#configurerModal #cellSize');
        const applyButton = document.querySelector('#configurerModal .btn-primary');

        applyButton.addEventListener('click', () => {
            this.validateInput(
                rowsInput, this.myWindow.MIN_COL, this.myWindow.MAX_COL);
            this.validateInput(
                columnsInput, this.myWindow.MIN_COL, this.myWindow.MAX_COL);
            this.validateInput(
                cellSizeInput, this.myWindow.MIN_CELL_SIZE, this.myWindow.MAX_CELL_SIZE);

            this.myWindow.columnCanvas = rowsInput.value;
            this.myWindow.rowCanvas = columnsInput.value;
            this.myWindow.cellSize = cellSizeInput.value;

            // this.myWindow.removeDrawingEvent();
            this.myWindow.initialize();
            // this.myWindow.addDrawingEvent();
        });
    }

    // Initialiser les événements pour la modale Charger Plateau
    initializeChargerModal() {
        const loadConfigSelect = document.querySelector('#chargerModal #loadConfig');
        const loadButton = document.querySelector('#chargerModal .btn-primary');

        loadButton.addEventListener('click', () => {
            // Fonction à remplir
        });
    }

    // Initialiser les événements pour la modale Enregistrer Plateau
    initializeEnregistrerModal() {
        const saveNameInput = document.querySelector('#enregistrerModal #saveName');
        const saveButton = document.querySelector('#enregistrerModal .btn-primary');

        saveButton.addEventListener('click', () => {
            const saveName = saveNameInput.value;

            this.myWindow.saves[saveName] = this.myWindow.board.grid;
            saveNameInput.input = "";

            const loadConfig = document.getElementById('loadConfig');
            loadConfig.innerHTML = '';

            Object.keys(this.myWindow.saves).forEach(save => {
                const option = document.createElement('option');
                option.value = save;
                option.textContent = save;
                loadConfig.appendChild(option);
            });

        });
    }

    // Initialiser les événements pour la modale Définir Règles
    initializeDefinirReglesModal() {
        const birthRulesCheckboxes = document.querySelectorAll('#definirReglesModal .birth-rules .form-check-input');
        const survivalRulesCheckboxes = document.querySelectorAll('#definirReglesModal .survival-rules .form-check-input');
        const applyButton = document.querySelector('#definirReglesModal .btn-primary');

        applyButton.addEventListener('click', () => {
            this.myWindow.alive = new Set(Array.from(birthRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))
            );
            this.myWindow.dead = new Set(Array.from(survivalRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))
            );
        });
    }

    // Initialiser les événements pour la modale Règles Prédéfinies
    initializePredefiniesModal() {
        const predefinedRulesSelect = document.querySelector('#predefiniesModal #predefinedRules');
        const applyButton = document.querySelector('#predefiniesModal .btn-primary');

        applyButton.addEventListener('click', () => {
            [this.myWindow.birth, this.myWindow.survival] = predefinedRulesSelect.value
                .split("/")
                .map(valeurs => new Set(valeurs.split("").map(Number)));
            this.myWindow.verifyInputRules()
        });
    }

    // Initialiser les événements pour la modale Ajout Rapide
    initializeAjoutRapideModal() {
        const colorRadios = document.querySelectorAll('#ajoutRapideModal input[name="colorOptions"]');
        const addSquareRadio = document.querySelector('#ajoutRapideModal #addSquare');
        const addPatternRadio = document.querySelector('#ajoutRapideModal #addPattern');
        const sizeRadios = document.querySelectorAll('#ajoutRapideModal input[name="squareSize"]');
        const patternSelect = document.querySelector('#ajoutRapideModal #patternSelect');
        const addButton = document.querySelector('#ajoutRapideModal .btn-primary');

        addButton.addEventListener('click', () => {
        });
    }

    // Initialiser les événements pour la modale Pas à Pas
    initializePasAPasModal() {
        const okButton = document.querySelector('#pasAPasModal .btn-primary');

        okButton.addEventListener('change', () => {
            // Fonction à remplir
        });
    }


    // Initialiser les événements pour la modale Vitesse
    initializeVitesseModal() {
        const speedRange = document.querySelector('#vitesseModal #animationSpeed');
        const applyButton = document.querySelector('#vitesseModal .btn-primary');

        applyButton.addEventListener('click', () => {
            // Fonction à remplir
        });
    }

    updateStartButton() {
        const playIcon = document.getElementById('startIcon');
        const pauseIcon = document.getElementById('pauseIcon');

        if (playIcon.style.display === 'none') {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            this.title = 'Démarrer';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            this.title = 'Pause';
        }
    }

    // Initialiser les événements pour les icônes de la barre d'outils
    initializeIconEvents() {
        const newSimulationButton = document.querySelector('.icon-bar .btn[title="Nouvelle Simulation"]');
        const startButton = document.querySelector('.icon-bar .btn[title="Démarrer"]');
        const stepButton = document.querySelector('.icon-bar .btn[title="Pas à Pas"]');
        const slowButton = document.querySelector('.icon-bar .btn[title="Décélération"]');
        const fastButton = document.querySelector('.icon-bar .btn[title="Accélération"]');
        const trashButton = document.querySelector('.icon-bar .btn[title="Corbeille"]');
        const gridButton = document.querySelector('.icon-bar .btn[title="Grille"]');
        const arrowsButton = document.querySelector('.icon-bar .btn[title="Flèches"]');
        const historyButton = document.querySelector('.icon-bar .btn[title="Historique"]');

        newSimulationButton.addEventListener('click', () => {
            // Fonction à remplir
        });

        startButton.addEventListener('click', () => {
            this.myWindow.toggleAnimation();
            this.updateStartButton();
        });

        stepButton.addEventListener('click', () => {
            this.myWindow.stopAnimation();
            this.myWindow.calculateNextGeneration();
        });

        slowButton.addEventListener('click', () => {
            this.myWindow.animation -= 1;
            if (this.myWindow.animation < 1) this.myWindow.animation = 1;
            this.myWindow.stopAnimation();
            this.myWindow.startAnimation();
        });

        fastButton.addEventListener('click', () => {
            this.myWindow.animation += 1;
            if (this.myWindow.animation > 100) this.myWindow.animation = 100;
            this.myWindow.stopAnimation();
            this.myWindow.startAnimation();
        });

        trashButton.addEventListener("click", () => {
            this.myWindow.clearGrid();
            this.myWindow.stopAnimation();
            this.updateStartButton();
        });

        gridButton.addEventListener('click', () => {
            gridButton.classList.toggle('active');
            this.myWindow.lines = !this.myWindow.lines;
            if (!this.myWindow.lines) {
                this.myWindow.boardCanvas.clearCanvas();
            }
            this.myWindow.boardCanvas.drawGrid();

        });

        arrowsButton.addEventListener('click', () => {
            arrowsButton.classList.toggle('active');
            this.myWindow.move = !this.myWindow.move;
            this.myWindow[this.myWindow.move ?
                'hideMoveArrow' :
                'showMoveArrow']();
        });

        historyButton.addEventListener('click', () => {
            historyButton.classList.toggle('active');
            this.myWindow.history = !this.myWindow.history;
            if (!this.myWindow.history) {
                this.myWindow.boardCanvas.clearCanvas();
            }
            this.myWindow.boardCanvas.drawGrid();

        });
    }

    // Initialiser les événements pour le canvas
    initializeCanvasEvents() {
        const canvas = document.querySelector('#gameCanvas');

        canvas.addEventListener('click', (event) => {
            // Fonction à remplir
        });

        canvas.addEventListener('mousemove', (event) => {
            // Fonction à remplir
        });

        canvas.addEventListener('mousedown', (event) => {
            // Fonction à remplir
        });

        canvas.addEventListener('mouseup', (event) => {
            // Fonction à remplir
        });
    }
}
