import { $, $All } from './utils.js';


export class HTML {

    // Configure modal
    static hasardConfigureCheckbox = $('#hasardConfigureCheckbox');
    static rowsConfigureInput = $('#rowsConfigureInput');
    static columnsConfigureInput = $('#columnsConfigureInput');
    static cellSizeConfigureInput = $('#cellSizeConfigureInput');
    static applyConfigureButton = $('#applyConfigureButton');

    // Random Modal
    static weightRandomInput0 = $('#weightRandomInput0');
    static weightFullRandomInputs = $All('#weightRandomInputs .weight');
    static applyRandombutton = $('#applyRandombutton');

    static weightRandomSpans = [
        $('#weightRandomSpan1'),
        $('#weightRandomSpan2'),
        $('#weightRandomSpan3'),
        $('#weightRandomSpan4')
    ];
    static weightRandomSpan0 = $('#weightRandomSpan0');

    // Grid Enter modal
    static arrayGridEnterInput = $('#arrayGridEnterInput');
    static applyGridEnterButton = $('#applyGridEnterButton');
    static errorGridEnterP = $('#errorGridEnterP');

    // Grid Exit modal
    static tabGridExitButton = $("#tabGridExitButton");
    static arraygridExitP = $("#arraygridExitP");
    static copyGridExitButton = $('#copyGridExitButton');

    // Load Modal
    static configLoadSelect = $('#configLoadSelect');
    static applyLoadButton = $('#applyLoadButton');

    // Save Modal
    static nameSaveInput = $('#nameSaveInput');
    static applySaveButton = $('#applySaveButton');

    // Define Rules modal
    static birthDefineRulesCheckboxes = $All('#birthDefineRulesCheckboxes input');
    static survivalDefineRulesCheckboxes = $All('#survivalDefineRulesCheckboxes input');
    static applyDefineRulesButton = $('#applyDefineRulesButton'); 

    // Predefine modal
    static rulesPredefineSelect = $('#rulesPredefineSelect');
    static applyPredefineButton = $('#applyPredefineButton');

    // Step modal
    static stepApplyModal = $('#stepApplyModal');
    static stepSelectModal = $('#stepSelectModal');

    // Canvas
    static canvasContainer = $('#gameLife');
    static canvas = $('#gameCanvas');

    // Barre
    static generation = $('#generation');
    static livingCells = $('#livingCells');
    static totalCells = $('#totalCells');

    // Doc
    static gameWindow = $('#gameWindow');
    static docWindow = $('#docWindow');
    static toggleDocIcon = $('#toggleDocIcon');
    static toggleDocButton = $('#toggleDocButton');

    // Simulation
    static simulationPrincipalButton = $('#simulationPrincipalButton');
    
    // Save
    static savePrincipalButton = $('#savePrincipalButton');
    
    // Load
    static loadPrincipalButton = $('#loadPrincipalButton');

    // Copy
    static copyPrincipalButton = $('#copyPrincipalButton');


    // Start
    static startPrincipalButton = $('#startPrincipalButton');

    //Trash
    static trashPrincipalButton = $('#trashPrincipalButton');

    // Step
    static stepPrincipalButton = $('#stepPrincipalButton');

    // Grid
    static gridPrincipalButton = $('#gridPrincipalButton');

    // Border
    static borderPrincipalButton = $('#borderPrincipalButton');

    // Draw
    static drawPrincipalButton = $('#drawPrincipalButton');

    // History
    static historyPrincipalButton = $('#historyPrincipalButton');

    // Color
    static colorIcon = $('#colorIcon');
    static wallIcon = $('#wallIcon');
    static colorPrincipalButton = $('#colorPrincipalButton');
    static colorDiv = $('#colorButtons');
    static colorButtons = $All('#colorButtons button');
    static colorParent = $('#colorParent');

    // Move
    static movePrincipalButton = $('#movePrincipalButton');
    static moveDiv = $('#moveButtons');
    static moveButtons = $All('#moveButtons button');
    static moveParent = $('#moveParent');

    // Zoom
    static zoomPrincipalButton = $('#zoomPrincipalButton');
    static zoomDiv = $('#zoomButtons');
    static zoomButtons = $All('#zoomButtons button');
    static zoomParent = $('#zoomParent');

    // Rapidity
    static rapidityPrincipalButton = $('#rapidityPrincipalButton');
    static rapidityDiv = $('#rapidityButtons');
    static rapidityButtons = $All('#rapidityButtons button');
    static rapidityParent = $('#rapidityParent');
}