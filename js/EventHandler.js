import { conf } from './configuration.js';
import { $, $All } from './utils.js';
import { HTML } from './HTML.js';

export class EventHandler {

    #app;

    getApp() { return this.#app; }

    constructor(app) {
        this.#app = app;

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

    updateStartButton(forceStop = false) {
        const playIcon = $('#startIcon');
        const pauseIcon = $('#pauseIcon');

        const isPlaying = playIcon.style.display === 'none';

        if (forceStop && !isPlaying) {
            return;
        }

        playIcon.style.display = isPlaying ? 'block' : 'none';
        pauseIcon.style.display = isPlaying ? 'none' : 'block';
        this.title = isPlaying ? 'Démarrer' : 'Pause';

        // Appelle toggleAnimation si l'état change
        this.getApp().toggleAnimation();
    }

    // Fonction principale pour initialiser tous les événements
    initialize() {
        // MODALES
        this.initializeConfigurerModal();
        this.initializeWeightModal();
        this.initializeChargerModal();
        this.initializeInputModal();
        this.initializeOutputModal();
        this.initializeEnregistrerModal();
        this.initializeDefinirReglesModal();
        this.initializePredefiniesModal();
        this.initializeAjoutRapideModal();
        this.initializeStepModal();
        this.initializeVitesseModal();

        // ICONES
        this.initializeSimulationIcon();
        this.initializeStepIcon();
        this.initializeStartIcon();
        this.initializeRapidityIcon();
        this.initializeTrashIcon();
        this.initializeGridIcon();
        this.initializeBordureIcon();
        this.initializeHistoryIcon();
        this.initializeColorIcon();
        this.initializeDrawIcon();
        this.initializeArrowsButton();
        this.initializeZoomButton()

        // CANVAS

        // CLAVIER
        this.initializeZoom();

    }

    /******************************************
     * 
     * EVENEMENTS POUR LES MODALES
     * 
    *******************************************/

    initializeZoom() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && (event.key === '+')) {
                event.preventDefault(); // Empêcher le comportement par défaut du navigateur
                // Action spécifique pour Ctrl + +
                this.getApp().setCellSizeZoomIn();
                console.log("+")
            }

            if (event.ctrlKey && (event.key === '-')) {
                event.preventDefault(); // Empêcher le comportement par défaut du navigateur
                this.getApp().setCellSizeZoomOut();
                // Appeler votre fonction ici
                console.log("-")
            }
        });
    }

    // Initialiser les événements pour la modale Configurer Plateau
    initializeConfigurerModal() {
        const hasardInput = $('#hasard');
        const rowsInput = $('#rows');
        const columnsInput = $('#columns');
        const cellSizeInput = $('#cellSize');
        const applyConfigureButton = $('#applyConfigure');

        applyConfigureButton.addEventListener('click', () => {
            this.validateInput(
                rowsInput, conf.MIN_COL, conf.MAX_COL);
            this.validateInput(
                columnsInput, conf.MIN_COL, conf.MAX_COL);
            this.validateInput(
                cellSizeInput, conf.MIN_CELL_SIZE, conf.MAX_CELL_SIZE);

            this.getApp().updateBottomNav(true);

            // Mise à jour de la taille des cellules en fonction de la largeur.   
            const currentMaxCellSize = Math.min(
                parseInt(($(".game-life").offsetWidth - 20) / rowsInput.value),
                conf.MAX_CELL_SIZE,
                cellSizeInput.value);


            this.getApp().setColumnCanvas(columnsInput.value);
            this.getApp().setRowCanvas(rowsInput.value);
            this.getApp().setCellSize(currentMaxCellSize);
            this.getApp().setRandomize(hasardInput.checked);
            this.getApp().initializeSimplely();
        });
    }

    initializeWeightModal() {
        const weightEmpty = $('#weight0');
        const weightsInput = $All('.weight');
        const applyWeightButton = $('#applyWeights');

        const weightsSpan = [
            $('#spanWeight1'),
            $('#spanWeight2'),
            $('#spanWeight3'),
            $('#spanWeight4')
        ];

        const updateWeights = (changedInput) => {
            const total = Array.from(weightsInput).reduce((acc, input) => acc + parseFloat(input.value), 0);

            let totalZero = (1 - total).toFixed(2);
            if (totalZero < 0) totalZero = 0;

            $('#spanWeight0').textContent = totalZero;
            $('#weight0').value = totalZero;

            if (total > 1) {
                const decreaseAmount = (total - 1) / (weightsInput.length - 1);

                weightsInput.forEach(input => {
                    if (input !== changedInput) {
                        const newValue = parseFloat(input.value) - decreaseAmount;
                        input.value = Math.max(newValue, 0);
                    }
                });
            }
        }

        const displayWeights = () => {
            weightsInput.forEach((input, index) => {
                weightsSpan[index].textContent = `(${input.value})`;
            });
        }

        // Affiche la valeur initiale des poids
        weightsInput.forEach((input, index) => {
            weightsSpan[index].textContent = `(${input.value})`;
        });

        weightsInput.forEach(input => {
            input.addEventListener('input', () => {
                updateWeights(input);
                displayWeights();
            });
        });

        applyWeightButton.addEventListener('click', () => {
            const weights = [];
            weights.push(weightEmpty.value);
            weightsInput.forEach(weight => {
                weights.push(weight.value);
            });
            this.getApp().setWeights(weights.map(Number));
            $('#hasard').checked = true;
        })

    }

    initializeInputModal() {
        const gridInput = $('#gridInput');
        const applyGridButton = $('#applyGrid');
        const gridError = $('#gridError');

        let isValidatedGrid;
        let grid;

        gridInput.addEventListener('input', function () {
            grid = gridInput.value.trim().split('\n')
            isValidatedGrid = validateGrid(grid);

            if (isValidatedGrid) {
                gridInput.classList.add('valid');
                gridInput.classList.remove('invalid');
                gridError.classList.add('d-none');
            } else {
                gridInput.classList.add('invalid');
                gridInput.classList.remove('valid');
                gridError.classList.remove('d-none');
            }

            applyGridButton.disabled = !isValidatedGrid;
        });

        applyGridButton.addEventListener("click", () => {
            if (isValidatedGrid) {
                grid = grid.map(row => Array.from(row, Number));
                this.getApp().initializeSimplely();
                this.getApp().setColumnCanvas(grid[0].length);
                this.getApp().setRowCanvas(grid.length);
                this.getApp().getBoard().setGrid(grid);
                this.getApp().getBoardCanvas().drawGrid();
            }

        })

        function validateGrid(grid) {
            const rowLength = grid[0].length;

            for (const row of grid) {
                if (row.length !== rowLength || !/^[012349]+$/.test(row)) return false;
            }

            return true;
        }
    }

    initializeOutputModal() {
        const gridDisplay = $("#gridDisplay");
        const gridOutput = $("#gridOutput");
        const copyGridButton = document.getElementById('copyGridButton');


        gridDisplay.addEventListener("click", () => {
            gridOutput.innerHTML = this.getApp().getBoard().getGrid().map(row => row.join('')).join('<br>\n');
        })

        const textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        textArea.value = gridOutput.textContent;

        // Ajouter le textarea au document
        document.body.appendChild(textArea);

        // Sélectionner le texte
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length); // Pour les appareils mobiles

        // Copier le texte dans le presse-papier
        copyGridButton.addEventListener('click', () => {
            navigator.clipboard.writeText(gridOutput.textContent)
                .then(() => { alert('Le texte a été copié dans le presse-papier.'); })
                .catch(err => { alert('Échec de la copie du texte dans le presse-papier.'); })
                .finally(() => { document.body.removeChild(textArea); });

        });
    }


    // Initialiser les événements pour la modale Charger Plateau
    initializeChargerModal() {
        const loadConfigSelect = $('#loadConfig');
        const loadButton = $('#chargerModal .btn-primary');

        loadButton.addEventListener('click', () => {
            // Fonction à remplir
        });
    }

    // Initialiser les événements pour la modale Enregistrer Plateau
    initializeEnregistrerModal() {
        const saveNameInput = $('#saveName');
        const saveButton = $('#enregistrerModal .btn-primary');

        saveButton.addEventListener('click', () => {
            const saveName = saveNameInput.value;

            this.getApp().setSaves([saveName], this.getApp().getBoard().getGrid());
            saveNameInput.input = '';

            const loadConfig = $('#loadConfig');
            loadConfig.innerHTML = '';

            Object.keys(this.getApp().getSaves()).forEach(save => {
                const option = document.createElement('option');
                option.value = save;
                option.textContent = save;
                loadConfig.appendChild(option);
            });

        });
    }

    // Initialiser les événements pour la modale Définir Règles
    initializeDefinirReglesModal() {
        const birthRulesCheckboxes = $All('#definirReglesModal .birth-rules .form-check-input');
        const survivalRulesCheckboxes = $All('#definirReglesModal .survival-rules .form-check-input');
        const applyButton = $('#definirReglesModal .btn-primary');

        applyButton.addEventListener('click', () => {
            this.getApp().setBirth(new Set(Array.from(birthRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))
            ));
            this.getApp().setSurvival(new Set(Array.from(survivalRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))
            ));
        });
    }

    // Initialiser les événements pour la modale Règles Prédéfinies
    initializePredefiniesModal() {
        const predefinedRulesSelect = $('#predefinedRules');
        const applyButton = $('#predefiniesModal .btn-primary');

        applyButton.addEventListener('click', () => {

            const [births, survivals] = predefinedRulesSelect.value
                .split('/')
                .map(valeurs => new Set(valeurs.split('').map(Number)));
            this.getApp().verifyInputRules();
            this.getApp().setBirth(births);
            this.getApp().setSurvival(survivals);
        });
    }

    // Initialiser les événements pour la modale Ajout Rapide
    initializeAjoutRapideModal() {
        const colorRadios = $All('#ajoutRapideModal input[name="colorOptions"]');
        const addSquareRadio = $('#addSquare');
        const addPatternRadio = $('#addPattern');
        const sizeRadios = $All('#ajoutRapideModal input[name="squareSize"]');
        const patternSelect = $('#patternSelect');
        const addButton = $('#ajoutRapideModal .btn-primary');

        addButton.addEventListener('click', () => {
        });
    }

    // Initialiser les événements pour la modale Pas à Pas
    initializeStepModal() {
        HTML.stepApplyModal.addEventListener('click', () => {
            this.getApp().setStep(HTML.stepSelectModal.value);
        });
    }

    // Initialiser les événements pour la modale Vitesse
    initializeVitesseModal() {
        const animationSpeedInput = $('#animationSpeed');
        const speedValueLabel = $('#speedValueLabel');
        const applyButton = $('#vitesseModal .btn-primary');


        animationSpeedInput.addEventListener('input', () => {
            speedValueLabel.textContent = animationSpeedInput.value;
        });

        applyButton.addEventListener('click', () => {
            const speedValue = animationSpeedInput.value;
            this.getApp().setSpeed(speedValue);
        });
    }

    /******************************************
     * 
     * EVENEMENTS POUR LES ICONES
     * 
    *******************************************/

    initializeSimulationIcon() {
        HTML.simulationPrincipalButton.addEventListener('click', () => { this.updateStartButton(true) });
    }

    initializeStepIcon() {
        HTML.stepPrincipalButton.addEventListener('click', () => { this.getApp().calculateNextGeneration(); });
    }

    initializeStartIcon() {
        HTML.startPrincipalButton.addEventListener('click', () => { this.updateStartButton(); });
    }

    initializeTrashIcon() {
        HTML.trashPrincipalButton.addEventListener('click', () => {
            this.getApp().clearGrid();
            this.getApp().stopAnimation();
            this.updateStartButton(true);
            this.getApp().updateBottomNav();
        });
    }

    initializeBordureIcon() {
        HTML.borderPrincipalButton.addEventListener('click', () => {
            HTML.borderPrincipalButton.classList.toggle('active');

            this.getApp().setBorder(!this.getApp().getBorder());
            $('canvas').classList.toggle('canvas-border');
        });
    }

    initializeGridIcon() {
        HTML.gridPrincipalButton.addEventListener('click', () => {
            HTML.gridPrincipalButton.classList.toggle('active');
            this.getApp().setLines(!this.getApp().getLines());
            if (!this.getApp().getLines()) this.getApp().getBoardCanvas().clearCanvas();
            this.getApp().getBoardCanvas().drawGrid();

        });
    }

    initializeHistoryIcon() {
        HTML.historyPrincipalButton.addEventListener('click', () => {
            HTML.historyPrincipalButton.classList.toggle('active');
            this.getApp().setHistory(!this.getApp().getHistory());
            if (!this.getApp().getHistory()) {
                this.getApp().getBoardCanvas().clearCanvas();
            }
            this.getApp().getBoardCanvas().drawGrid();

        });
    }

    initializeColorIcon() {
        this.displayDivButtons(HTML.colorDiv, HTML.colorPrincipalButton, HTML.colorParent);

        // Gère le clic sur les boutons de couleur
        HTML.colorButtons.forEach(colorButton => {
            colorButton.addEventListener('click', () => {

                HTML.colorPrincipalButton.classList.remove('blue', 'green', 'yellow', 'red');
                let className = colorButton.dataset.color;
                this.getApp().setValueAdd(parseInt(colorButton.dataset.value));

                HTML.colorPrincipalButton.classList.add(className);

                // Ferme la div immédiatement après le clic
                HTML.colorDiv.style.display = 'none';

                const isWall = colorButton.dataset.color === 'wall';
                HTML.colorIcon.style.display = isWall ? 'none' : 'block';
                HTML.wallIcon.style.display = isWall ? 'block' : 'none';
            });
        });
    }

    initializeDrawIcon() {
        HTML.drawPrincipalButton.addEventListener('click', () => {
            this.updateStartButton(true);
            this.updateDrawButton();
        });
    }

    updateDrawButton(forced = false) {
        HTML.drawPrincipalButton.classList.toggle('active');
        this.getApp().setEnableDraw(!this.getApp().getEnableDraw());
        this.getApp().toggleDrawingEvents();
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

    initializeRapidityIcon() {
        this.displayDivButtons(HTML.rapidityDiv, HTML.rapidityPrincipalButton, HTML.rapidityParent);

        // Gère le clic sur les boutons de rapidité
        HTML.rapidityButtons.forEach(rapidityButton => {
            rapidityButton.addEventListener('click', () => {
                // Met à jour les classes des boutons pour indiquer la sélection
                HTML.rapidityButtons.forEach(button => button.classList.remove('bg-success', 'text-light'));
                rapidityButton.classList.add('bg-success', 'text-light');

                // Met à jour la vitesse dans app
                this.getApp().setRapidity(rapidityButton.dataset.rapidity);

                // Ferme la div immédiatement après le clic
                HTML.rapidityDiv.style.display = 'none';

                // Appelle updateStartButton pour mettre à jour l'état
                this.updateStartButton(true);
            });
        });
    }

    initializeZoomButton() {
        this.displayDivButtons(HTML.zoomDiv, HTML.zoomPrincipalButton, HTML.zoomParent);

        HTML.zoomButtons.forEach(zoomButton => {
            zoomButton.addEventListener('click', () => {

            });
        });
    }

    initializeArrowsButton() {
        this.displayDivButtons(HTML.moveDiv, HTML.movePrincipalButton, HTML.moveParent);

        HTML.moveButtons.forEach(moveButton => {
            moveButton.addEventListener('click', () => {
                let direction = moveButton.dataset.direction;
                switch (direction) {
                    case "top":
                        this.getApp().getBoard().moveTop();
                        this.getApp().getBoardCanvas().drawGrid();
                        break;
                    case 'bottom':
                        this.getApp().getBoard().moveBottom();
                        this.getApp().getBoardCanvas().drawGrid();
                        break;
                    case 'right':
                        this.getApp().getBoard().moveRight();
                        this.getApp().getBoardCanvas().drawGrid();
                        break;
                    case 'left':
                        this.getApp().getBoard().moveLeft();
                        this.getApp().getBoardCanvas().drawGrid();
                        break;
                };
            });
        });
    }

    displayDivButtons(div, principalButton, parent) {
        let moveHideTimeout; // Variable pour stocker le timeout

        // Fonction pour afficher ou masquer la div des boutons avec un délai
        const toggleDiv = (show) => {
            moveHideTimeout = this.toggleVisibilityWithDelay(div, show, 300, moveHideTimeout);
        };

        // Affiche la div lorsque le bouton est survolé
        principalButton.addEventListener('mouseover', () => toggleDiv(true));

        // Affiche la div lorsque la souris est sur la div entière
        parent.addEventListener('mouseover', () => toggleDiv(true));

        // Ferme la div avec un délai lorsque la souris quitte la div entière
        parent.addEventListener('mouseout', (event) => {
            if (!parent.contains(event.relatedTarget)) {
                toggleDiv(false);
            }
        });
    }


    /******************************************
     * 
     * EVENEMENTS POUR LES CANVAS
     * 
    *******************************************/

    /******************************************
     * 
     * EVENEMENTS POUR LE DESSIN
     * 
    *******************************************/
}
