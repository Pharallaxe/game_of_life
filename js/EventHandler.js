import {conf} from './configuration.js';
import {$, $All} from './utils.js';
import {HTML} from './HTML.js';

export class EventHandler {

    #app;

    getApp() {
        return this.#app;
    }

    constructor(app) {
        this.#app = app;
        this.initialize();
    }

    updateStartButton(forceStop = false) {
        const playIcon = $('#startIcon');
        const pauseIcon = $('#pauseIcon');

        const isPlaying = playIcon.style.display === 'none';

        if (forceStop && !isPlaying) return;

        playIcon.style.display = isPlaying ? 'block' : 'none';
        pauseIcon.style.display = isPlaying ? 'none' : 'block';
        this.title = isPlaying ? 'Démarrer' : 'Pause';

        // Appelle toggleAnimation si l'état change
        this.getApp().toggleAnimation();
    }

    updateWeights(changedInput) {
        const total = Array.from(HTML.weightFullRandomInputs).reduce((acc, input) => acc + parseFloat(input.value), 0);

        let totalZero = (1 - total).toFixed(2);
        if (totalZero < 0) totalZero = 0;

        HTML.weightRandomSpan0.textContent = totalZero;
        HTML.weightRandomInput0.value = totalZero;

        if (total > 1) {
            const decreaseAmount = (total - 1) / (HTML.weightFullRandomInputs.length - 1);
            HTML.weightFullRandomInputs.forEach(input => {
                if (input !== changedInput) {
                    input.value = Math.max(parseFloat(input.value) - decreaseAmount, 0);
                }
            });
        }
    }

    validateGrid(grid) {
        const rowLength = grid[0].length;
        for (const row of grid) {
            if (row.length !== rowLength || !/^[012349]+$/.test(row)) return false;
        }
        return true;
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

    updateDrawButton() {
        HTML.drawPrincipalButton.classList.toggle('active');
        this.getApp().setEnableDraw(!this.getApp().getEnableDraw());
        this.getApp().toggleDrawingEvents();
    }

    toggleVisibilityWithDelay(element, show, delay, timeoutId) {
        // Annuler tout timeout précédent
        clearTimeout(timeoutId);

        if (show) {
            element.style.display = 'flex'; // Affiche immédiatement
            return null; // Pas de nouveau timeout à gérer pour l'affichage
        } else {
            return setTimeout(() => {
                element.style.display = 'none';
            }, delay); // Masque avec délai
        }
    }

    // Fonction principale pour initialiser tous les événements
    initialize() {
        // MODALES
        this.initializeConfigurerModal();
        this.initializeWeightModal();
        this.initializeLoadModal();
        this.initializeInputModal();
        this.initializeSaveModal();
        this.initializeDefineRulesModal();
        this.initializePredefiniesModal();
        this.initializeAddModal();
        this.initializeStepModal();

        // ICONES
        this.initializeSimulationIcon();
        this.initializeCopyIcon();
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

        this.initializeDocButton()

        // CLAVIER
        this.initializeKeyboard();
    }

    /******************************************
     *
     * EVENEMENTS POUR LES MODALES
     *
     *******************************************/

    // Initialiser les événements pour la modale Configurer Plateau
    initializeConfigurerModal() {
        function validateInput(inputElement, minValue, maxValue) {
            let value = parseInt(inputElement.value, 10);

            if (isNaN(value)) return minValue;
            else if (value > maxValue) return maxValue;
            else if (value < minValue) return minValue;
            else return value;
        }

        HTML.applyConfigureButton.addEventListener('click', () => {
            // Corriger les input
            let rowsInput = validateInput(HTML.rowsConfigureInput, conf.MIN_COL, conf.MAX_COL);
            let columnsInput = validateInput(HTML.columnsConfigureInput, conf.MIN_COL, conf.MAX_COL);
            let cellSizeInput = validateInput(HTML.cellSizeConfigureInput, conf.MIN_CELL_SIZE, conf.MAX_CELL_SIZE);

            let hasardInput = HTML.hasardConfigureCheckbox;

            // Initialiser une nouvelle grille
            this.updateStartButton(true);
            this.getApp().cleanGrid();
            this.getApp().formatGrid(rowsInput, columnsInput, cellSizeInput);
            let grid = this.getApp().getBoard().createGridRandom();
            this.getApp().getBoard().initializeGrids(grid);
            this.getApp().getBoardCanvas().setDimensionsCanvas();
            this.getApp().getBoardCanvas().drawGrid();

        });
    }

    initializeWeightModal() {
        const displayWeights = () => {
            HTML.weightFullRandomInputs.forEach((input, index) => {
                HTML.weightRandomSpans[index].textContent = `(${input.value})`;
            });
        }

        // Affiche la valeur initiale des poids
        HTML.weightFullRandomInputs.forEach((input, index) => {
            HTML.weightRandomSpans[index].textContent = `(${input.value})`;
        });

        HTML.weightFullRandomInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateWeights(input);
                displayWeights();
            });
        });

        HTML.applyRandombutton.addEventListener('click', () => {
            const weights = [];
            weights.push(HTML.weightRandomInput0.value);
            HTML.weightFullRandomInputs.forEach(weight => {
                weights.push(weight.value);
            });
            this.getApp().setWeights(weights.map(Number));
            HTML.hasardConfigureCheckbox.checked = true;
        })
    }

    initializeInputModal() {
        let isValidatedGrid;
        let grid;

        HTML.arrayGridEnterInput.addEventListener('input', () => {
            grid = HTML.arrayGridEnterInput.value.trim().split('\n')
            isValidatedGrid = this.validateGrid(grid);
            if (isValidatedGrid) {
                HTML.arrayGridEnterInput.classList.add('valid');
                HTML.arrayGridEnterInput.classList.remove('invalid');
                HTML.errorGridEnterP.classList.add('d-none');
            } else {
                HTML.arrayGridEnterInput.classList.add('invalid');
                HTML.arrayGridEnterInput.classList.remove('valid');
                HTML.errorGridEnterP.classList.remove('d-none');
            }

            HTML.applyGridEnterButton.disabled = !isValidatedGrid;
        });

        HTML.applyGridEnterButton.addEventListener("click", () => {
            if (isValidatedGrid) {
                grid = grid.map(row => Array.from(row, Number));

                // Initialiser une nouvelle grille
                this.updateStartButton(true);
                this.getApp().cleanGrid();
                this.getApp().formatGrid(grid.length, grid[0].length, this.getApp().getCellSize());
                this.getApp().getBoard().initializeGrids(grid);
                this.getApp().getBoardCanvas().setDimensionsCanvas();
                this.getApp().getBoardCanvas().drawGrid();
            }
        });
    }

    initializeLoadModal() {

        HTML.loadPrincipalButton.addEventListener('click', () => {

            // Mettre en pause l'animation
            this.getApp().stopAnimation();
            this.updateStartButton(true);

            // Effacer le select
            HTML.configLoadSelect.innerHTML = '';

            // Récupérer les noms des sauvegardes à partir de l'objet 'saveNames'
            let saveNames = JSON.parse(localStorage.getItem('saveNames')) || [];

            // Créer le select
            saveNames.forEach(saveName => {
                const option = document.createElement('option');
                option.value = saveName;
                option.textContent = saveName;
                HTML.configLoadSelect.appendChild(option);
            });
        });

        HTML.applyLoadButton.addEventListener('click', () => {
            const selectedSave = HTML.configLoadSelect.value;

            // Récupérer les sauvegardes à partir de l'objet 'savesLifeGame'
            let saves = JSON.parse(localStorage.getItem('savesLifeGame')) || {};
            const savedGrid = saves[selectedSave];

            // Initialiser une nouvelle grille
            this.updateStartButton(true);
            this.getApp().cleanGrid();
            this.getApp().formatGrid(savedGrid.length, savedGrid[0].length, this.getApp().getCellSize());
            this.getApp().getBoard().initializeGrids(savedGrid);
            this.getApp().getBoardCanvas().setDimensionsCanvas();
            this.getApp().getBoardCanvas().drawGrid();
        });
    }

    initializeSaveModal() {
        HTML.applySaveButton.addEventListener('click', () => {

            this.getApp().stopAnimation();
            this.updateStartButton(true);

            let saveName = HTML.nameSaveInput.value.toLowerCase().trim();

            // Vérifier si le champ de nom est vide
            while (!saveName) {
                saveName = prompt("Veuillez entrer un nom pour la sauvegarde.").toLowerCase().trim();
            }

            const saveData = this.getApp().getBoard().getGrid();

            // Vérifier s'il existe déjà une sauvegarde avec le même nom
            let saveNames = JSON.parse(localStorage.getItem('saveNames')) || [];
            let saves = JSON.parse(localStorage.getItem('savesLifeGame')) || {};

            if (saves[saveName]) {
                // Afficher une boîte de dialogue de confirmation
                if (!confirm(`Une sauvegarde portant le même nom existe déjà. Voulez-vous la remplacer ?`)) {
                    return;
                }
            } else {
                saveNames.push(saveName);
            }

            saves[saveName] = saveData;
            localStorage.setItem('saveNames', JSON.stringify(saveNames));
            localStorage.setItem('savesLifeGame', JSON.stringify(saves));
            HTML.nameSaveInput.value = '';
        });
    }


    // Initialiser les événements pour la modale Définir Règles
    initializeDefineRulesModal() {
        HTML.applyDefineRulesButton.addEventListener('click', () => {
            this.getApp().setBirth(new Set(Array.from(HTML.birthDefineRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))
            ));
            this.getApp().setSurvival(new Set(Array.from(HTML.survivalDefineRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))
            ));
        });
    }

    // Initialiser les événements pour la modale Règles Prédéfinies
    initializePredefiniesModal() {
        HTML.applyPredefineButton.addEventListener('click', () => {
            const [births, survivals] = HTML.rulesPredefineSelect.value
                .split('/')
                .map(valeurs => new Set(valeurs.split('').map(Number)));
            this.getApp().verifyInputRules();
            this.getApp().setBirth(births);
            this.getApp().setSurvival(survivals);
        });
    }

    // Initialiser les événements pour la modale Ajout Rapide
    initializeAddModal() {
    }

    // Initialiser les événements pour la modale Pas à Pas
    initializeStepModal() {
        HTML.stepApplyModal.addEventListener('click', () => {
            this.getApp().setStep(HTML.stepSelectModal.value);
        });
    }

    /******************************************
     *
     * EVENEMENTS POUR LES ICONES
     *
     *******************************************/

    initializeSimulationIcon() {
        HTML.simulationPrincipalButton.addEventListener('click', () => {
            this.updateStartButton(true)
        });
    }

    initializeCopyIcon() {
        HTML.copyPrincipalButton.addEventListener('click', () => {
            const gridValue = this.getApp()
                .getBoard()
                .getGrid()
                .map(row => row.join(''))
                .join('\n');

            // Créer un text area pour effectuer la copie
            const textArea = document.createElement('textarea');
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            textArea.value = gridValue;

            // Ajouter le textarea au document
            document.body.appendChild(textArea);

            // Sélectionner le texte
            textArea.select();
            textArea.setSelectionRange(0, textArea.value.length); // Pour les appareils mobiles

            navigator.clipboard.writeText(gridValue)
                .then(() => {
                    alert('Le texte a été copié dans le presse-papier.');
                })
                .catch(err => {
                    alert('Échec de la copie du texte dans le presse-papier.');
                })
                .finally(() => {
                    document.body.removeChild(textArea);
                });
        });
    }

    initializeStepIcon() {
        HTML.stepPrincipalButton.addEventListener('click', () => {
            this.getApp().calculateNextGeneration();
        });
    }

    initializeStartIcon() {
        HTML.startPrincipalButton.addEventListener('click', () => {
            this.updateStartButton(false);
        });
    }

    initializeTrashIcon() {
        HTML.trashPrincipalButton.addEventListener('click', () => {
            this.cleanGrid();
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

        // Gèrer le clic sur les boutons de couleur
        HTML.colorButtons.forEach(colorButton => {
            colorButton.addEventListener('click', () => {

                HTML.colorPrincipalButton.classList.remove('blue', 'green', 'yellow', 'red');
                let className = colorButton.dataset.color;
                this.getApp().setValueAdd(parseInt(colorButton.dataset.value));

                HTML.colorPrincipalButton.classList.add(className);

                // Fermer la div immédiatement après le clic
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

    initializeRapidityIcon() {
        this.displayDivButtons(HTML.rapidityDiv, HTML.rapidityPrincipalButton, HTML.rapidityParent);

        // Gèrer le clic sur les boutons de rapidité
        HTML.rapidityButtons.forEach(rapidityButton => {
            rapidityButton.addEventListener('click', () => {
                // Mettre à jour les classes des boutons pour indiquer la sélection
                HTML.rapidityButtons.forEach(button => button.classList.remove('bg-success', 'text-light'));
                rapidityButton.classList.add('bg-success', 'text-light');

                // Mettre à jour la vitesse dans app
                this.getApp().setRapidity(rapidityButton.dataset.rapidity);

                // Fermer la div immédiatement après le clic
                HTML.rapidityDiv.style.display = 'none';

                // Apeller updateStartButton pour mettre à jour l'état
                this.updateStartButton(true);
            });
        });
    }

    updateZoom(zoom) {
        const buttonName = zoom.charAt(0).toUpperCase() + zoom.slice(1)
        this.getApp()[`setCellSizeZoom${buttonName}`]();
    }

    initializeZoomButton() {
        this.displayDivButtons(HTML.zoomDiv, HTML.zoomPrincipalButton, HTML.zoomParent);

        HTML.zoomButtons.forEach(zoomButton => {
            zoomButton.addEventListener('click', () => {
                console.log(zoomButton.dataset.value)
                this.updateZoom(zoomButton.dataset.value)
            });
        });
    }

    updateArrows(direction) {
        const buttonName = direction.charAt(0).toUpperCase() + direction.slice(1);
        this.getApp().getBoard()[`move${buttonName}`]();
        this.getApp().getBoardCanvas().drawGrid();
    }

    initializeArrowsButton() {
        this.displayDivButtons(HTML.moveDiv, HTML.movePrincipalButton, HTML.moveParent);

        HTML.moveButtons.forEach(moveButton => {
            moveButton.addEventListener('click', () => {
                this.updateArrows(moveButton.dataset.direction);
            });
        });
    }

    initializeKeyboard() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && ['+', '-'].includes(event.key)) {
                event.preventDefault();
                this.updateZoom(event.key === '+' ? 'In' : 'Out')
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                this.updateArrows(event.key.slice(5));
            }
        });
    }

    initializeDocButton() {
        HTML.toggleDocButton.addEventListener('click', function () {
            if (HTML.gameWindow.classList.contains('desactivate')) {
                HTML.gameWindow.classList.remove('desactivate');
                HTML.docWindow.classList.add('desactivate')
                HTML.toggleDocIcon.className = 'bi bi-question-circle-fill';
            } else {
                HTML.gameWindow.classList.add('desactivate');
                HTML.docWindow.classList.remove('desactivate')
                HTML.toggleDocIcon.className = 'bi bi-controller';
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
