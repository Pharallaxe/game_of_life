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

    toggleVisibilityWithDelay(element, show, delay, timeoutId) {
        clearTimeout(timeoutId); // Annule tout timeout précédent

        if (show) {
            element.style.display = 'flex'; // Affiche immédiatement
            return null; // Pas de nouveau timeout à gérer pour l'affichage
        } else {
            return setTimeout(() => {
                element.style.display = 'none';
            }, delay); // Masque avec délai
        }
    }

    updateStartButton(forceStop = false) {
        const playIcon = document.getElementById('startIcon');
        const pauseIcon = document.getElementById('pauseIcon');

        const isPlaying = playIcon.style.display === 'none';

        if (forceStop && !isPlaying) {
            return;
        }

        playIcon.style.display = isPlaying ? 'block' : 'none';
        pauseIcon.style.display = isPlaying ? 'none' : 'block';
        this.title = isPlaying ? 'Démarrer' : 'Pause';

        // Appelle toggleAnimation si l'état change
        this.myWindow.toggleAnimation();
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
        this.initializeIconRapidity();
        this.initializeIconColor();
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
        const predefinedRulesSelect = document.querySelector('#predefinedRules');
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
        const applyButton = document.querySelector('#pasAPasModal .btn-primary');
        const stepSelect = document.querySelector('#stepSelect');

        applyButton.addEventListener('click', () => {
            this.myWindow.step = stepSelect.value;
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

    initializeIconRapidity() {
        const rapidityButton = document.querySelector('.btn[title="Rapidité"]');
        const speedDiv = document.querySelector('#rapidityButtons');
        const speedButtons = document.querySelectorAll('#rapidityButtons button');
        const rapidityParent = document.querySelector('#rapidityParent');

        let speedHideTimeout; // Variable pour stocker le timeout

        // Fonction pour afficher ou masquer la div des boutons avec un délai
        const toggleSpeedDiv = (show) => {
            speedHideTimeout = this.toggleVisibilityWithDelay(speedDiv, show, 300, speedHideTimeout);
        };

        // Affiche la div lorsque le bouton "Rapidité" est survolé
        rapidityButton.addEventListener('mouseover', () => toggleSpeedDiv(true));

        // Affiche la div lorsque la souris est sur la div entière
        rapidityParent.addEventListener('mouseover', () => toggleSpeedDiv(true));

        // Ferme la div avec un délai lorsque la souris quitte la div entière
        rapidityParent.addEventListener('mouseout', (event) => {
            if (!rapidityParent.contains(event.relatedTarget)) {
                toggleSpeedDiv(false);
            }
        });

        // Gère le clic sur les boutons de rapidité
        speedButtons.forEach(speedButton => {
            speedButton.addEventListener('click', () => {
                // Met à jour les classes des boutons pour indiquer la sélection
                speedButtons.forEach(button => button.classList.remove('bg-success', 'text-light'));
                speedButton.classList.add('bg-success', 'text-light');

                // Met à jour la vitesse dans myWindow
                this.myWindow.speed = speedButton.dataset.speed;

                // Ferme la div immédiatement après le clic
                speedDiv.style.display = 'none';

                // Appelle updateStartButton pour mettre à jour l'état
                this.updateStartButton(true);
            });
        });
    }

    initializeIconColor() {
        const paletteButton = document.querySelector('.btn[title="Couleur"]');
        const colorDiv = document.querySelector('#colorButtons');
        const colorButtons = document.querySelectorAll('#colorButtons button');
        const paletteParent = document.querySelector('#colorParent');

        let colorHideTimeout; // Variable pour stocker le timeout

        const toggleColorDiv = (show) => {
            colorHideTimeout = this.toggleVisibilityWithDelay(colorDiv, show, 300, colorHideTimeout);
        };

        // Affiche la div lorsque le bouton "Couleur" est survolé
        paletteButton.addEventListener('mouseover', () => toggleColorDiv(true));

        // Affiche la div lorsque la souris est sur la div entière
        paletteParent.addEventListener('mouseover', () => toggleColorDiv(true));

        // Ferme la div avec un délai lorsque la souris quitte la div entière
        paletteParent.addEventListener('mouseout', (event) => {
            if (!paletteParent.contains(event.relatedTarget)) {
                toggleColorDiv(false);
            }
        });


        // Gère le clic sur les boutons de couleur
        colorButtons.forEach(colorButton => {
            colorButton.addEventListener('click', () => {
                paletteButton.classList.remove('blue', 'green', 'yellow', 'red');
                let className = colorButton.dataset.color;
                this.myWindow.typeAdd = colorButton.dataset.value;
                paletteButton.classList.add(className);

                // Ferme la div immédiatement après le clic
                colorDiv.style.display = 'none';
            });
        });

    }

    initializeIconStep() {
        const jumpButton = document.querySelector('.btn[title="Pas à Pas"]');
        const stepDiv = document.querySelector('#stepButtons');
        const stepButtons = document.querySelectorAll('#stepButtons button');
        const jumpParent = document.querySelector('#stepParent');

        let stepHideTimeout; // Variable pour stocker le timeout

        const toggleStepDiv = (show) => {
            stepHideTimeout = this.toggleVisibilityWithDelay(stepDiv, show, 300, stepHideTimeout);
        };

        // Affiche la div lorsque le bouton "Pas à Pas" est survolé
        jumpButton.addEventListener('mouseover', () => toggleStepDiv(true));

        // Affiche la div lorsque la souris est sur la div entière
        jumpParent.addEventListener('mouseover', () => toggleStepDiv(true));

        // Ferme la div avec un délai lorsque la souris quitte la div entière
        jumpParent.addEventListener('mouseout', (event) => {
            if (!jumpParent.contains(event.relatedTarget)) {
                toggleStepDiv(false);
            }
        });


        // Gère le clic sur les boutons de pas à pas.
        stepButtons.forEach(stepButton => {
            stepButton.addEventListener('click', () => {
                // Met à jour les classes des boutons pour indiquer la sélection
                stepButtons.forEach(button => button.classList.remove('bg-success', 'text-light'));
                stepButton.classList.add('bg-success', 'text-light');
                
                // Met à jour le pas dans myWindow
                this.myWindow.step = stepButton.dataset.step;

                // Ferme la div immédiatement après le clic
                stepDiv.style.display = 'none';
            });
        });

    }

    // Initialiser les événements pour les icônes de la barre d'outils
    initializeIconEvents() {

        const newSimulationButton = document.querySelector('.icon-bar .btn[title="Nouvelle Simulation"]');
        const startButton = document.querySelector('.icon-bar .btn[title="Démarrer"]');
        const trashButton = document.querySelector('.icon-bar .btn[title="Corbeille"]');
        const gridButton = document.querySelector('.icon-bar .btn[title="Grille"]');
        const arrowsButton = document.querySelector('.icon-bar .btn[title="Flèches"]');
        const historyButton = document.querySelector('.icon-bar .btn[title="Historique"]');

        const drawButton = document.querySelector('.icon-bar .btn[title="Dessiner"]');

        newSimulationButton.addEventListener('click', () => {
            this.updateStartButton(true)
        });

        startButton.addEventListener('click', () => {
            this.updateStartButton();
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
