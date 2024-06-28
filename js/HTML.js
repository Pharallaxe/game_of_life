import { $, $All } from './utils.js';


export class HTML {

    // Configure modale
     

    // Step modale
    static stepApplyModal = $('#stepApplyModal');
    static stepSelectModal = $('#stepSelectModal');

    // Canvas
    static canvas = $('#gameCanvas');

    // Simulation
    static simulationPrincipalButton = $('#simulationPrincipalButton');

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