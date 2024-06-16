import { conf } from './configuration.js';
import { $, $All } from './utils.js';

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
        this.initializePasAPasModal();
        this.initializeVitesseModal();

        // ICONES
        this.initializeSimulationIcon();
        this.initializeStepIcon();
        this.initializeStartIcon();
        this.initializeRapidityIcon();
        this.initializeTrashIcon();
        this.initializeGridIcon();
        this.initializeBordureIcon();
        this.initializeArrowsIcon();
        this.initializeHistoryIcon();
        this.initializeColorIcon();
        this.initializeDrawIcon();

        // CANVAS
        this.initializeCanvasEvents();

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

            this.getApp().setColumnCanvas(rowsInput.value);
            this.getApp().setRowCanvas(columnsInput.value);
            this.getApp().setCellSize(cellSizeInput.value);

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
                const excess = total - 1;
                const decreaseAmount = excess / (weightsInput.length - 1);

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
                if (row.length !== rowLength || !/^[012349]+$/.test(row)) {
                    return false;
                }
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
                .then(() => {
                    alert('Le texte a été copié dans le presse-papier.');
                })
                .catch(err => {
                    console.error('Erreur lors de la copie dans le presse-papier :', err);
                    alert('Échec de la copie du texte dans le presse-papier.');
                })
                .finally(() => {
                    // Supprimer le textarea
                    document.body.removeChild(textArea);
                });

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
    initializePasAPasModal() {
        const applyButton = $('#pasAPasModal .btn-primary');
        const stepSelect = $('#stepSelect');

        applyButton.addEventListener('click', () => {
            this.getApp().setStep(stepSelect.value);
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
        const newSimulationButton = $('.icon-bar .btn[title="Nouvelle Simulation"]');

        newSimulationButton.addEventListener('click', () => {
            this.updateStartButton(true)
        });
    }

    initializeStepIcon() {
        const stepButton = $('.btn[title="Pas à Pas"]');

        stepButton.addEventListener('click', () => {
            this.getApp().calculateNextGeneration();
        });
    }

    initializeStartIcon() {
        const startButton = $('.btn[title="Démarrer"]');

        startButton.addEventListener('click', () => {
            this.updateStartButton();
        });
    }

    initializeRapidityIcon() {
        const rapidityButton = $('.btn[title="Rapidité"]');
        const speedDiv = $('#rapidityButtons');
        const speedButtons = $All('#rapidityButtons button');
        const rapidityParent = $('#rapidityParent');

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

                // Met à jour la vitesse dans app
                this.getApp().setSpeed(speedButton.dataset.speed);

                // Ferme la div immédiatement après le clic
                speedDiv.style.display = 'none';

                // Appelle updateStartButton pour mettre à jour l'état
                this.updateStartButton(true);
            });
        });
    }

    initializeTrashIcon() {
        const trashButton = $('.btn[title="Corbeille"]');

        trashButton.addEventListener('click', () => {
            this.getApp().clearGrid();
            this.getApp().stopAnimation();
            this.updateStartButton(true);
            this.getApp().updateBottomNav();
        });
    }

    initializeBordureIcon() {
        const borderButton = $('.btn[title="Bordures"]');

        borderButton.addEventListener('click', () => {
            borderButton.classList.toggle('active');
            this.getApp().setBorder(!this.getApp().getBorder());
            $('canvas').classList.toggle('canvas-border');
        });
    }

    initializeGridIcon() {
        const gridButton = $('.btn[title="Grille"]');

        gridButton.addEventListener('click', () => {
            gridButton.classList.toggle('active');
            this.getApp().setLines(!this.getApp().getLines());
            if (!this.getApp().getLines()) {
                this.getApp().getBoardCanvas().clearCanvas();
            }
            this.getApp().getBoardCanvas().drawGrid();

        });
    }

    initializeArrowsIcon() {
        const arrowsButton = $('.btn[title="Flèches"]');
        arrowsButton.addEventListener('click', () => {
            arrowsButton.classList.toggle('active');
            this.getApp().move = !this.getApp().move;
            this.getApp()[this.getApp().move ?
                'hideMoveArrow' :
                'showMoveArrow']();
        });
    }

    initializeHistoryIcon() {
        const historyButton = $('.btn[title="Historique"]');

        historyButton.addEventListener('click', () => {
            historyButton.classList.toggle('active');
            this.getApp().setHistory(!this.getApp().getHistory());
            if (!this.getApp().getHistory()) {
                this.getApp().getBoardCanvas().clearCanvas();
            }
            this.getApp().getBoardCanvas().drawGrid();

        });
    }

    initializeColorIcon() {
        const paletteIcon = $('#paletteIcon');
        const wallIcon = $('#wallIcon');
        const paletteButton = $('.btn[title="Couleur"]');
        const colorDiv = $('#colorButtons');
        const colorButtons = $All('#colorButtons button');
        const paletteParent = $('#colorParent');

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
                this.getApp().setValueAdd(parseInt(colorButton.dataset.value));

                paletteButton.classList.add(className);

                // Ferme la div immédiatement après le clic
                colorDiv.style.display = 'none';

                if (colorButton.dataset.color === 'wall') {
                    paletteIcon.style.display = 'none'
                    wallIcon.style.display = 'block'
                }
                else {
                    paletteIcon.style.display = 'block'
                    wallIcon.style.display = 'none'
                }
            });
        });
    }

    initializeDrawIcon() {

        const drawButton = $('.icon-bar .btn[title="Dessiner"]');

        drawButton.addEventListener('click', () => {
            this.updateStartButton(true);
            this.updateDrawButton();
        });
    }

    updateDrawButton(forced = false) {
        const drawButton = $('.icon-bar .btn[title="Dessiner"]');
        drawButton.classList.toggle('active');
        this.getApp().setEnableDraw(!this.getApp().getEnableDraw());
        this.getApp().toggleDrawingEvents();
    }

    /******************************************
     * 
     * EVENEMENTS POUR LES CANVAS
     * 
    *******************************************/


    initializeCanvasEvents() {
        const canvas = $('#gameCanvas');

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


    /******************************************
     * 
     * EVENEMENTS POUR LE DESSIN
     * 
    *******************************************/


}
