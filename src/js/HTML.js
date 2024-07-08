import {$, $All} from './utils.js';


export class HTML {

    // Simulation
    static simulationPrincipalButton = $('#simulationPrincipalButton');

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
    static weightRandomSpan0 = $('#weightRandomSpan0');
    static weightRandomSpans = [
        $('#weightRandomSpan1'),
        $('#weightRandomSpan2'),
        $('#weightRandomSpan3'),
        $('#weightRandomSpan4')
    ];

    // Save Modal
    static savePrincipalButton = $('#savePrincipalButton');
    static nameSaveInput = $('#nameSaveInput');
    static applySaveButton = $('#applySaveButton');

    // Load Modal
    static loadPrincipalButton = $('#loadPrincipalButton');
    static configLoadSelect = $('#configLoadSelect');
    static applyLoadButton = $('#applyLoadButton');

    // Grid Enter modal
    static arrayGridEnterInput = $('#arrayGridEnterInput');
    static applyGridEnterButton = $('#applyGridEnterButton');
    static errorGridEnterP = $('#errorGridEnterP');

    // Doc
    static gameWindow = $('#gameWindow');
    static docWindow = $('#docWindow');
    static toggleDocIcon = $('#toggleDocIcon');
    static toggleDocButton = $('#toggleDocButton');

    // Copy
    static copyPrincipalButton = $('#copyPrincipalButton');

    // Step
    static stepPrincipalButton = $('#stepPrincipalButton');

    // Jump
    static jumpPrincipalButton = $('#jumpPrincipalButton');
    static jumpDiv = $('#jumpButtons');
    static jumpButtons = $All('#jumpButtons button');
    static jumpParent = $('#jumpParent');

    // Start
    static startPrincipalButton = $('#startPrincipalButton');

    // Rapidity
    static rapidityPrincipalButton = $('#rapidityPrincipalButton');
    static rapidityDiv = $('#rapidityButtons');
    static rapidityButtons = $All('#rapidityButtons button');
    static rapidityParent = $('#rapidityParent');

    // Trash
    static trashPrincipalButton = $('#trashPrincipalButton');

    // Grid
    static gridPrincipalButton = $('#gridPrincipalButton');

    // Border
    static borderPrincipalButton = $('#borderPrincipalButton');

    // Draw
    static drawPrincipalButton = $('#drawPrincipalButton');

    // History
    static historyPrincipalButton = $('#historyPrincipalButton');

    // Pattern
    static patternPrincipalButton = $('#patternPrincipalButton');
    static patternSelect = $('#patternSelect');
    static patternPreview = $("#patternPreview")
    static applyPatternButton = $('#applyPatternButton');
    static topPatternDiv = $('#topPatternDiv');
    static bottomPatternDiv = $('#bottomPatternDiv');
    static leftPatternDiv = $('#leftPatternDiv');
    static rightPatternDiv = $('#rightPatternDiv');
    static patternTable = $('#patternTable');
    static patternDescription = $('#patternDescription');
    static topPatternInput = $('#topPatternInput');
    static bottomPatternInput = $('#bottomPatternInput');
    static leftPatternInput = $('#leftPatternInput');
    static rightPatternInput = $('#rightPatternInput');

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

    // Define button
    static defineRulesPrincipalButton = $("#defineRulesPrincipalButton");

    // Define Rules modal
    static birthDefineRulesCheckboxes = $All('#birthDefineRulesCheckboxes input');
    static survivalDefineRulesCheckboxes = $All('#survivalDefineRulesCheckboxes input');
    static applyDefineRulesButton = $('#applyDefineRulesButton');

    // Predefine button
    static predefineRulesPrincipalButton = $("#predefineRulesPrincipalButton");

    // Predefine modal
    static predefineRulesSelect = $('#predefineRulesSelect');
    static applyPredefineRulesButton = $('#applyPredefineRulesButton');
    static cancelPredefineRulesButton = $('#cancelPredefineRulesButton');

    // Canvas
    static canvasContainer = $('#gameLife');
    static canvas = $('#gameCanvas');

    // Barre
    static generation = $('#generation');
    static livingCells = $('#livingCells');
    static totalCells = $('#totalCells');
}