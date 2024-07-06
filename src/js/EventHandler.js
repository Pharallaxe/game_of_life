import {Config} from './Config.js';
import {$} from './utils.js';
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

    /**
     * Met à jour l'état du bouton de démarrage.
     *
     * @param {boolean} [forceStop=false] - Si vrai, force l'arrêt de l'animation même si elle n'est pas en cours.
     * @returns {void}
     */
    updateStartButton(forceStop = false) {
        const playIcon = $('#startIcon');
        const pauseIcon = $('#pauseIcon');

        const isPlaying = playIcon.style.display === 'none';

        if (forceStop && !isPlaying) return;

        playIcon.style.display = isPlaying ? 'block' : 'none';
        pauseIcon.style.display = isPlaying ? 'none' : 'block';
        HTML.startPrincipalButton.title = isPlaying ? 'Démarrer' : 'Pause';

        // Appelle toggleAnimation si l'état change
        this.getApp().toggleAnimation();
    }

    /**
     * Met à jour les poids des entrées aléatoires.
     *
     * @param {HTMLInputElement} changedInput - L'entrée dont la valeur a changé.
     * @returns {void}
     */
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

    /**
     * Valide une grille donnée.
     *
     * @param {string[]} grid - La grille à valider, représentée sous forme d'un tableau de chaînes de caractères.
     * @returns {boolean} - Vrai si la grille est valide, faux sinon.
     */
    validateGrid(grid) {
        const rowLength = grid[0].length;
        for (const row of grid) {
            if (row.length !== rowLength || !/^[012349]+$/.test(row)) return false;
        }
        return true;
    }

    /**
     * Affiche les boutons d'une div avec un délai de masquage.
     *
     * @param {HTMLDivElement} div - La div contenant les boutons à afficher.
     * @param {HTMLElement} principalButton - Le bouton principal qui déclenche l'affichage de la div.
     * @param {HTMLElement} parent - L'élément parent de la div et du bouton principal.
     * @returns {void}
     */
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

    /**
     * Met à jour l'état du bouton de dessin.
     *
     * @returns {void}
     */
    updateDrawButton() {
        HTML.drawPrincipalButton.classList.toggle('active');
        this.getApp().setEnableDraw(!this.getApp().getEnableDraw());
        this.getApp().toggleDrawingEvents();
    }

    /**
     * Bascule la visibilité d'un élément avec un délai.
     *
     * @param {HTMLElement} element - L'élément dont la visibilité doit être basculée.
     * @param {boolean} show - Si vrai, affiche l'élément, sinon le masque.
     * @param {number} delay - Le délai en millisecondes avant de masquer l'élément.
     * @param {number|null} timeoutId - L'identifiant du timeout précédent, s'il existe.
     * @returns {number|null} - L'identifiant du nouveau timeout, ou null si l'élément est affiché.
     */
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
        // ICONES
        this.initializeSimulationIcon();
        this.initializeSaveButton();
        this.initializeLoadModal();
        this.initiatilizeEnterButton();
        this.initializeCopyIcon();
        this.initializeStepIcon();
        this.initializeJumpIcon();
        this.initializeStartIcon();
        this.initializeRapidityIcon();
        this.initializeColorIcon();
        this.initializeDrawIcon();
        this.initializeTrashIcon();
        this.initializeGridIcon();
        this.initializeBordureIcon();
        this.initializeHistoryIcon();
        this.initializeArrowsButton();
        this.initializeZoomButton()
        this.initializeDefineRulesButton();
        this.initializePredefineRulesButton();
        this.initializeDocButton();
        this.initializeKeyboard();
    }

    /******************************************
     * INITIALISATION SIMULATION
     ******************************************/

    /**
     * Initialise l'icône de simulation en ajoutant un gestionnaire d'événements au
     * bouton principal. Lorsque le bouton est cliqué, la fonction met à jour l'état du
     * bouton de démarrage en forçant l'arrêt de l'animation.
     *
     * @returns {void}
     */
    initializeSimulationIcon() {
        HTML.simulationPrincipalButton.addEventListener('click', () => {
            this.updateStartButton(true)
        });

        this.initializeConfigurerModal();
        this.initializeWeightModal();
    }

    /**
     * Initialise le modal de configuration en définissant un gestionnaire d'événements sur
     * le bouton "Appliquer". Lorsque le bouton est cliqué, la fonction valide les valeurs
     * d'entrée pour le nombre de lignes, de colonnes et la taille des cellules en utilisant
     * la fonction interne `validateInput`. Elle initialise ensuite une nouvelle grille en
     * nettoyant la grille actuelle, en formatant la nouvelle grille avec les valeurs validées,
     * en créant une nouvelle grille aléatoire, en initialisant les grilles, en définissant les
     * dimensions du canvas et en dessinant la nouvelle grille.
     *
     * La fonction `validateInput` est une fonction interne qui valide une valeur d'entrée en
     * fonction d'une valeur minimale et maximale autorisées. Elle convertit la valeur d'entrée
     * en un entier, vérifie si elle est dans la plage autorisée et retourne la valeur validée.
     *
     * @returns {void}
     */
    initializeConfigurerModal() {
        function validateInput(inputElement, minValue, maxValue) {
            let value = parseInt(inputElement.value, 10);

            if (isNaN(value)) return minValue; else if (value > maxValue) return maxValue; else if (value < minValue) return minValue; else return value;
        }

        HTML.applyConfigureButton.addEventListener('click', () => {
            // Corriger les input
            let rowsInput = validateInput(HTML.rowsConfigureInput, Config.MIN_COL, Config.MAX_COL);
            let columnsInput = validateInput(HTML.columnsConfigureInput, Config.MIN_COL, Config.MAX_COL);
            let cellSizeInput = validateInput(HTML.cellSizeConfigureInput, Config.MIN_CELL_SIZE, Config.MAX_CELL_SIZE);

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

    /**
     * Initialise le modal des poids en affichant les valeurs initiales des poids et en ajoutant
     * des gestionnaires d'événements aux entrées de poids et au bouton "Appliquer". Lorsqu'une
     * valeur d'entrée change, la fonction `updateWeights` est appelée avec l'entrée modifiée comme
     * argument, et la fonction interne `displayWeights` est appelée pour mettre à jour l'affichage
     * des poids dans les spans associés.
     *
     * Lorsque le bouton "Appliquer" est cliqué, la fonction crée un tableau des valeurs de poids
     * actuelles, y compris la valeur de la dernière entrée calculée. Elle appelle `setWeights` sur
     * l'application avec le tableau de poids converti en nombres, et coche la case à cocher "Hasard"
     * du modal de configuration.
     *
     * La fonction `displayWeights` est une fonction interne qui affiche les valeurs actuelles des
     * poids dans les spans associés.
     *
     * @returns {void}
     */
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

    /******************************************
     * INITIALISATION SAUVEGARDE
     ******************************************/

    initializeSaveButton() {
        HTML.savePrincipalButton.addEventListener('click', () => {

            // Mettre en pause l'animation
            this.getApp().stopAnimation();
            this.updateStartButton(true);
        })

        this.initializeSaveModal();
    }

    /**
     * Initialise le modal de sauvegarde en ajoutant un gestionnaire d'événements au bouton
     * "Sauvegarder". Lorsque le bouton est cliqué, la fonction met en pause l'animation, met
     * à jour le bouton de démarrage et récupère le nom de sauvegarde entré dans l'input. Si
     * le champ est vide, elle demande à l'utilisateur d'entrer un nom.
     *
     * La fonction vérifie ensuite s'il existe déjà une sauvegarde avec le même nom. Si c'est
     * le cas, elle affiche une boîte de dialogue de confirmation pour remplacer la sauvegarde
     * existante. Enfin, elle enregistre la grille actuelle dans le localStorage sous le nom de
     * sauvegarde et met à jour la liste des noms de sauvegarde.
     *
     * @returns {void}
     */
    initializeSaveModal() {
        HTML.applySaveButton.addEventListener('click', () => {
            let saveName = HTML.nameSaveInput.value.toLowerCase().trim();
            while (!saveName) {
                saveName = prompt("Veuillez entrer un nom pour la sauvegarde.").toLowerCase().trim();
            }
            const saveData = this.getApp().getBoard().getGrid();

            // Vérifier s'il existe déjà une sauvegarde avec le même nom
            let saveNames = JSON.parse(localStorage.getItem('saveNames')) || [];
            let saves = JSON.parse(localStorage.getItem('savesLifeGame')) || {};

            if (saves[saveName]) {
                if (!confirm(`Une sauvegarde portant le même nom existe déjà. Voulez-vous la remplacer ?`)) {
                    return;
                }
            } else { saveNames.push(saveName);}

            saves[saveName] = saveData;
            localStorage.setItem('saveNames', JSON.stringify(saveNames));
            localStorage.setItem('savesLifeGame', JSON.stringify(saves));
            HTML.nameSaveInput.value = '';
        });
    }

    /******************************************
     * INITIALISATION CHARGEMENT
     ******************************************/

    /**
     * Initialise le modal de chargement en ajoutant un gestionnaire d'événements au bouton
     * "Charger". Lorsque le bouton est cliqué, la fonction met en pause l'animation, met à
     * jour le bouton de démarrage, efface les options du select de chargement et remplit le
     * select avec les noms de sauvegarde récupérés à partir du localStorage.
     *
     * Lorsque le bouton "Appliquer" du modal de chargement est cliqué, la fonction récupère
     * la grille sauvegardée correspondant à l'option sélectionnée dans le select, initialise
     * une nouvelle grille en nettoyant la grille actuelle, en formatant la nouvelle grille
     * avec les dimensions de la grille sauvegardée, en initialisant les grilles avec les
     * valeurs sauvegardées, en définissant les dimensions du canvas et en dessinant la nouvelle
     * grille.
     *
     * @returns {void}
     */
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

    /******************************************
     * INITIALISATION INSERTION ET COPIE
     ******************************************/

    initiatilizeEnterButton() {
        this.initializeEnterModal();
    }

    /**
     * Initialise le modal d'entrée de grille en ajoutant un gestionnaire d'événements à la zone
     * de texte d'entrée de grille. Lorsque la valeur de la zone de texte change, la fonction
     * valide la grille en utilisant la méthode `validateGrid`. Si la grille est valide, elle
     * ajoute la classe CSS "valid" à la zone de texte et masque le message d'erreur. Sinon,
     * ell ajoute la classe CSS "invalid" à la zone de texte et affiche le message d'erreur. Le
     * bouton "Appliquer" est également désactivé tant que la grille n'est pas valide.
     *
     * Lorsque le bouton "Appliquer" est cliqué, si la grille est valide, la fonction initialise
     * une nouvelle grille en nettoyant la grille actuelle, en formatant la nouvelle grille avec
     * les dimensions de la grille entrée, en initialisant les grilles avec les valeurs entrées,
     * en définissant les dimensions du canvas et en dessinant la nouvelle grille.
     *
     * @returns {void}
     */
    initializeEnterModal() {
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


    /**
     * Initialise l'icône de copie en ajoutant un gestionnaire d'événements au bouton principal.
     * Lorsque le bouton est cliqué, la fonction récupère la valeur de la grille actuelle, la
     * convertit en une chaîne de caractères et la copie dans le presse-papier à l'aide de l'API
     * Clipboard. Un message d'alerte est affiché en cas de succès ou d'échec de la copie.
     *
     * @returns {void}
     */
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
                .finally(() => {
                    document.body.removeChild(textArea);
                });
        });
    }

    /******************************************
     * INITIALISATION PAS A PAS
     ******************************************/

    /**
     * Initialise l'icône d'étape en ajoutant un gestionnaire d'événements au bouton principal.
     * Lorsque le bouton est cliqué, la fonction calcule la prochaine génération de la grille
     * en appelant la méthode `calculateNextGeneration` de l'application.
     *
     * @returns {void}
     */
    initializeStepIcon() {
        HTML.stepPrincipalButton.addEventListener('click', () => {
            this.getApp().calculateNextGeneration();
        });
    }

    /**
     * Initialise l'icône de saut en ajoutant un gestionnaire d'événements aux boutons de saut. Lorsqu'un
     * bouton de saut est cliqué, la fonction met à jour les classes CSS des boutons pour indiquer la
     * sélection, définit la valeur de saut dans l'application, ferme immédiatement la div des boutons
     * de saut et met à jour l'état du bouton de démarrage.
     *
     * La fonction `displayDivButtons` est appelée pour afficher et masquer la div des boutons de saut
     * avec un délai.
     *
     * @returns {void}
     */
    initializeJumpIcon() {
        this.displayDivButtons(HTML.jumpDiv, HTML.jumpPrincipalButton, HTML.jumpParent);

        // Gèrer le clic sur les boutons du saut
        HTML.jumpButtons.forEach(jumpButton => {
            jumpButton.addEventListener('click', () => {
                // Mettre à jour les classes des boutons pour indiquer la sélection
                HTML.jumpButtons.forEach(button => button.classList.remove('bg-success', 'text-light'));
                jumpButton.classList.add('bg-success', 'text-light');

                // Mettre à jour la vitesse dans app
                this.getApp().setStep(jumpButton.dataset.jump);

                // Fermer la div immédiatement après le clic
                HTML.jumpDiv.style.display = 'none';

                // Apeller updateStartButton pour mettre à jour l'état
                this.updateStartButton(true);
            });
        });
    }

    /******************************************
     * INITIALISATION ANIMATION
     ******************************************/

    /**
     * Initialise l'icône de démarrage en ajoutant un gestionnaire d'événements au bouton
     * principal. Lorsque le bouton est cliqué, la fonction met à jour l'état du bouton de
     * démarrage sans forcer l'arrêt de l'animation.
     *
     * @returns {void}
     */
    initializeStartIcon() {
        HTML.startPrincipalButton.addEventListener('click', () => {
            this.updateStartButton(false);
        });
    }

    /**
     * Initialise l'icône de rapidité en ajoutant un gestionnaire d'événements aux boutons de rapidité.
     * Lorsqu'un bouton de rapidité est cliqué, la fonction met à jour les classes CSS des boutons pour
     * indiquer la sélection, définit la valeur de rapidité dans l'application, ferme immédiatement la
     * div des boutons de rapidité et met à jour l'état du bouton de démarrage.
     *
     * La fonction `displayDivButtons` est appelée pour afficher et masquer la div des boutons de
     * rapidité avec un délai.
     *
     * @returns {void}
     */
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

    /******************************************
     * INITIALISATION COULEUR ET DESSIN
     ******************************************/
    /**
     * Initialise l'icône de couleur en ajoutant un gestionnaire d'événements aux boutons de couleur.
     * Lorsqu'un bouton de couleur est cliqué, la fonction met à jour la classe CSS du bouton principal
     * de couleur, définit la valeur d'ajout dans l'application, ferme immédiatement la div des boutons
     * de couleur et met à jour l'affichage des icônes de couleur et de mur en fonction de la couleur
     * sélectionnée.
     *
     * La fonction `displayDivButtons` est appelée pour afficher et masquer la div des boutons de
     * couleur avec un délai.
     *
     * @returns {void}
     */
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

    /**
     * Initialise l'icône de dessin en ajoutant un gestionnaire d'événements au bouton principal.
     * Lorsque le bouton est cliqué, la fonction met à jour l'état du bouton de démarrage en
     * forçant l'arrêt de l'animation, puis appelle la méthode `updateDrawButton` pour mettre à
     * jour l'état du mode de dessin.
     *
     * @returns {void}
     */
    initializeDrawIcon() {
        HTML.drawPrincipalButton.addEventListener('click', () => {
            this.getApp().stopAnimation();
            this.updateStartButton(true);
            this.updateDrawButton();
        });
    }

    /******************************************
     * INITIALISATION CORB, GRILLE, BORD, HIST
     ******************************************/

    /**
     * Initialise l'icône de corbeille en ajoutant un gestionnaire d'événements au bouton
     * principal. Lorsque le bouton est cliqué, la fonction nettoie la grille en appelant
     * la méthode `cleanGrid` de l'application.
     *
     * @returns {void}
     */
    initializeTrashIcon() {
        HTML.trashPrincipalButton.addEventListener('click', () => {
            this.getApp().cleanGrid();
            this.getApp().stopAnimation();
            this.updateStartButton(true);
        });
    }

    /**
     * Initialise l'icône de grille en ajoutant un gestionnaire d'événements au bouton principal.
     * Lorsque le bouton est cliqué, la fonction bascule l'état de l'affichage des lignes de la
     * grille dans l'application en appelant les méthodes `setLines` et `getLines`. Si les lignes
     * sont désactivées, elle efface le canvas en appelant `clearCanvas`.
     * Enfin, elle redessine la grille en appelant `drawGrid`.
     *
     * @returns {void}
     */
    initializeGridIcon() {
        HTML.gridPrincipalButton.addEventListener('click', () => {
            HTML.gridPrincipalButton.classList.toggle('active');
            this.getApp().setLines(!this.getApp().getLines());
            if (!this.getApp().getLines()) this.getApp().getBoardCanvas().clearCanvas();
            this.getApp().getBoardCanvas().drawGrid();

        });
    }

    /**
     * Initialise l'icône de bordure en ajoutant un gestionnaire d'événements au bouton principal.
     * Lorsque le bouton est cliqué, la fonction bascule l'état de l'affichage de la bordure du
     * canvas dans l'application en appelant les méthodes `setBorder` et `getBorder`. Elle ajoute
     * ou supprime également la classe CSS "canvas-border" sur le canvas.
     *
     * @returns {void}
     */
    initializeBordureIcon() {
        HTML.borderPrincipalButton.addEventListener('click', () => {
            HTML.borderPrincipalButton.classList.toggle('active');

            this.getApp().setBorder(!this.getApp().getBorder());
            $('canvas').classList.toggle('canvas-border');
        });
    }

    /**
     * Initialise l'icône d'historique en ajoutant un gestionnaire d'événements au bouton
     * principal. Lorsque le bouton est cliqué, la fonction bascule l'état de l'historique
     * dans l'application en appelant les méthodes `setHistory` et `getHistory`. Si l'historique
     * est désactivé, elle efface le canvas en appelant `clearCanvas`.
     * Enfin, elle redessine la grille en appelant `drawGrid`.
     *
     * @returns {void}
     */
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

    /******************************************
     * INITIALISATION DEPLACEMENT
     ******************************************/

    /**
     * Initialise les boutons de déplacement en ajoutant un gestionnaire d'événements aux boutons
     * de déplacement. Lorsqu'un bouton de déplacement est cliqué, la fonction appelle la méthode
     * `updateArrows` avec la direction correspondante.
     *
     * La fonction `displayDivButtons` est appelée pour afficher et masquer la div des boutons de
     * déplacement avec un délai.
     *
     * @returns {void}
     */
    initializeArrowsButton() {
        this.displayDivButtons(HTML.moveDiv, HTML.movePrincipalButton, HTML.moveParent);

        HTML.moveButtons.forEach(moveButton => {
            moveButton.addEventListener('click', () => {
                this.updateArrows(moveButton.dataset.direction);
            });
        });
    }

    /**
     * Met à jour la position de la grille dans une direction donnée en appelant la méthode
     * correspondante de la grille, puis redessine la grille.
     *
     * @param {string} direction - La direction dans laquelle déplacer la grille ('Up', 'Down',
     * 'Left' ou 'Right').
     * @returns {void}
     */
    updateArrows(direction) {
        const buttonName = direction.charAt(0).toUpperCase() + direction.slice(1);
        this.getApp().getBoard()[`move${buttonName}`]();
        this.getApp().getBoardCanvas().drawGrid();
    }

    /******************************************
     * INITIALISATION ZOOM
     ******************************************/

    /**
     * Initialise le bouton de zoom en ajoutant un gestionnaire d'événements aux boutons de zoom.
     * Lorsqu'un bouton de zoom est cliqué, la fonction appelle la méthode `updateZoom` avec la
     * valeur de zoom correspondante.
     *
     * La fonction `displayDivButtons` est appelée pour afficher et masquer la div des boutons de
     * zoom avec un délai.
     *
     * @returns {void}
     */
    initializeZoomButton() {
        this.displayDivButtons(HTML.zoomDiv, HTML.zoomPrincipalButton, HTML.zoomParent);

        HTML.zoomButtons.forEach(zoomButton => {
            zoomButton.addEventListener('click', () => {
                this.updateZoom(zoomButton.dataset.value)
            });
        });
    }

    /**
     * Met à jour le zoom de la grille en appelant la méthode correspondante de l'application.
     *
     * @param {string} zoom - La valeur de zoom à appliquer ('in' ou 'out').
     * @returns {void}
     */
    updateZoom(zoom) {
        const buttonName = zoom.charAt(0).toUpperCase() + zoom.slice(1)
        this.getApp()[`setCellSizeZoom${buttonName}`]();
    }

    /******************************************
     * INITIALISATION REGLES
     ******************************************/

    initializeDefineRulesButton() {
        HTML.defineRulesPrincipalButton.addEventListener('click', () => {
            // Mettre en pause l'animation
            this.getApp().stopAnimation();
            this.updateStartButton(true);
        })

        this.initializeDefineRulesModal();
    }

    /**
     * Initialise le modal de définition des règles en ajoutant un gestionnaire d'événements au
     * bouton "Appliquer". Lorsque le bouton est cliqué, la fonction récupère les cases à cocher
     * cochées pour les règles de naissance et de survie, les convertit en ensembles de nombres
     * et les définit dans l'application en utilisant les méthodes `setBirth` et `setSurvival`.
     *
     * @returns {void}
     */
    initializeDefineRulesModal() {
        HTML.applyDefineRulesButton.addEventListener('click', () => {
            this.getApp().setBirth(new Set(Array.from(HTML.birthDefineRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))));
            this.getApp().setSurvival(new Set(Array.from(HTML.survivalDefineRulesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.value))));
        });
    }

    initializePredefineRulesButton() {
        HTML.predefineRulesPrincipalButton.addEventListener('click', () => {
            // Mettre en pause l'animation
            this.getApp().stopAnimation();
            this.updateStartButton(true);
        })

        this.initializePredefineRulesModal();
    }

    /**
     * Initialise le modal des règles prédéfinies en ajoutant un gestionnaire d'événements au
     * bouton "Appliquer". Lorsque le bouton est cliqué, la fonction récupère les règles sélection-
     * nées dans le select, les convertit en ensembles de nombres pour les règles de naissance et
     * de survie, vérifie la validité des règles entrées et les définit dans l'application en
     * utilisant les méthodes `setBirth` et `setSurvival`.
     *
     * @returns {void}
     */
    initializePredefineRulesModal() {
        HTML.applyPredefineRulesButton.addEventListener('click', () => {
            this.getApp().verifyInputRules();
            const [births, survivals] = HTML.predefineRulesSelect.value
                .split('/')
                .map(valeurs => new Set(valeurs.split('').map(Number)));
            this.getApp().setBirth(births);
            this.getApp().setSurvival(survivals);
            this.getApp().verifyInputRules();
        });
    }

    /******************************************
     * INITIALISATION CLAVIER
     ******************************************/

    /**
     * Initialise les gestionnaires d'événements clavier pour le zoom et le déplacement de la
     * grille.
     *
     * Lorsque les touches Ctrl++ ou Ctrl+- sont enfoncées, la fonction appelle la méthode
     * `updateZoom` avec la valeur de zoom correspondante.
     *
     * Lorsque les touches fléchées sont enfoncées, la fonction appelle la méthode `updateArrows`
     * avec la direction correspondante.
     *
     * @returns {void}
     */
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

    /******************************************
     * INITIALISATION DOCUMENTATION
     ******************************************/

    /**
     * Initialise le bouton de basculement entre la fenêtre du jeu et la fenêtre de documentation.
     *
     * Lorsque le bouton est cliqué, la fonction bascule les classes CSS des fenêtres pour les
     * afficher ou les masquer, et met à jour l'icône du bouton en fonction de l'état actuel.
     *
     * @returns {void}
     */
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
}