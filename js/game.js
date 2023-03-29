// -----------------------------------------------------------------------------------
// GLOBAL VARIABLES
// -----------------------------------------------------------------------------------


const boxes = document.querySelectorAll(".box")

let clicked = 0                 //diferenciador de primer y segundo click
let turn = "white"              //variable de turno    
let pieceSelection = null       //pieza selccionada
let boxSelection = null         //casilla a donde mover la pieza

let elementPos = null

let possibleMovesStyles = []    //informacion de los movimientos posibles
let possibleMoves = []

let lastMove = null             //informacion del ultimo movimiento efectuado
let lastMoveStyles = null


// -----------------------------------------------------------------------------------
// DISPLAY PIECES
// -----------------------------------------------------------------------------------


//funcion que carga las piezas en sus casillas iniciales en el tablero
function displayChessPieces(piecesObject) {
    boxes.forEach(box => {
        box.innerHTML = ""
    })
    piecesObject.pieces.lightpieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += 
            `<div class="piece white" style="pointer-events: none;" data-piece="${piece.piece}" data-points="${piece.points}" data-color="${piece.color}">
                <img id="prueba" src="${piece.icon}" alt="Chess Piece" >
            </div>`
    })
    piecesObject.pieces.blackpieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += 
        `<div class="piece black" style="pointer-events: none;" data-piece="${piece.piece}" data-points="${piece.points}" data-color="${piece.color}">
                <img src="${piece.icon}" alt="Chess Piece" >
            </div>`
    })
    //se añade el listener a todas las casillas
    boxListener()
}


// -----------------------------------------------------------------------------------
// MISCELANEUS
// -----------------------------------------------------------------------------------


//funcion que accede al fichero json con la definicion de las piezas
async function loadPieces(){
    const response = await fetch('../json/pieces.json');
    const data = await response.json();
    displayChessPieces(data)
}


//funcion que devuelve la posicion de la pieza seleccionada
function selectPiece(box, color) {
    let position = box.id;
    if (box.children[0].dataset.color == color) {
        return position
    } else {
        return null
    }
}


//funcion que añade el listener a todas las casillas del tablero
function boxListener() {
    boxes.forEach((box) => {
        box.addEventListener("click", boxClicked)        
    })
}


// -----------------------------------------------------------------------------------
// TURNS
// -----------------------------------------------------------------------------------


//funcion que actualiza el turno
function endTurn() {
    if (turn == "white") {
        turn = "black"
    } else {
        turn = "white"
    }
}


//funcion que guarda la informacion relativa al ultimo movimiento
function saveLastMove(position1, position2) {
    lastMove = {position1, position2}
}


// -----------------------------------------------------------------------------------
// MOVE LOGIC
// -----------------------------------------------------------------------------------


//funcion de implementacion de movimiento. Dada dos posiciones del tablero, intercambia sus contenidos y reproduce el sonido correspondiente
function move(position1, position2) {
    if(document.getElementById(position2).hasChildNodes()){
        var audio = new Audio('sounds/capture.mp3');
    } else {
        var audio = new Audio('sounds/move-Self.mp3');
    }
    audio.play()
    document.getElementById(position2).innerHTML = document.getElementById(position1).innerHTML
    document.getElementById(position1).innerHTML = ""
    document.getElementById(position2).children[0].children[0].style.top = 0
    document.getElementById(position2).children[0].children[0].style.left = 0
    document.getElementById(position2).children[0].children[0].style.position = "relative";
    
    if(!playing){
        startTimer()
    }

}

//funcion que devuelve la lista de posibles movimientos en forma de array de posiciones
function getMoves(box) {
    possibleMoves = []
    let piece = box.children[0].dataset.piece
    if (piece == "pawn"){
         getPawnMoves(box.id, box.children[0].dataset.color)
    }else if (piece == "bishop"){
        getBishopMoves(box.id, box.children[0].dataset.color)
    }else if (piece == "knight"){
        getKingMoves(box.id, box.children[0].dataset.color)
    }else if (piece == "rook"){
        getRookMoves(box.id, box.children[0].dataset.color)
    }else if (piece == "queen"){
        getQueenMoves(box.id, box.children[0].dataset.color)
    }else if (piece == "king"){
        getKingMoves(box.id, box.children[0].dataset.color)
    }
}


function isCheck(){

}


// -----------------------------------------------------------------------------------
// PAWN MOVES
// -----------------------------------------------------------------------------------


//funcion que devuelve los posibles movimientos de un peon
function getPawnMoves(position, color) {
    let p = position.split('-')
    let x = p[0]
    let y = p[1]
    if (color == "white") {
        let nextY = parseInt(y) + 1
        let nextY2 = parseInt(y) + 2
        if (y < 8) {
            if (!document.getElementById(x.concat('-', nextY)).hasChildNodes()){
                if (y == 2 && !document.getElementById(x.concat('-', nextY2)).hasChildNodes()){
                possibleMoves.push(x.concat('-', nextY2))
            }
            possibleMoves.push(x.concat('-', nextY))
            }

            getPawnCaptures(nextY, x)
            
        }
    } else {
        let nextY = parseInt(y) - 1
        let nextY2 = parseInt(y) - 2
        if (y > 1 ) {

            if (!document.getElementById(x.concat('-', nextY)).hasChildNodes()) {
                if (y == 7 && !document.getElementById(x.concat('-', nextY2)).hasChildNodes()){
                possibleMoves.push(x.concat('-', nextY2))
            }
            possibleMoves.push(x.concat('-', nextY))
            }

            getPawnCaptures(nextY, x)
            
        }
    }
}


//funcion que devuelve las posibles capturas de un peon
function getPawnCaptures(nextY, x){
    if (x < 'H' && document.getElementById(String.fromCharCode(x.charCodeAt(0) + 1).concat('-',nextY)).hasChildNodes() && document.getElementById(String.fromCharCode(x.charCodeAt(0) + 1).concat('-',nextY)).children[0].dataset.color != turn){
        possibleMoves.push(String.fromCharCode(x.charCodeAt(0) + 1).concat('-',nextY))
    }

    if (x > 'A' && document.getElementById(String.fromCharCode(x.charCodeAt(0) - 1).concat('-',nextY)).hasChildNodes() && document.getElementById(String.fromCharCode(x.charCodeAt(0) - 1).concat('-',nextY)).children[0].dataset.color != turn){
        possibleMoves.push(String.fromCharCode(x.charCodeAt(0) - 1).concat('-',nextY))
    }
}


// -----------------------------------------------------------------------------------
// PIECES MOVES
// -----------------------------------------------------------------------------------


function checkAndGetCaptures(x, y, color){
    if(document.getElementById(x + "-" + y).hasChildNodes()){
        if(document.getElementById(x + "-" + y).children[0].dataset.color != color){
            possibleMoves.push(x + "-" + y)
        }
        return 1
    } else {
        return 0
    }
}


//funcion que devuelve los movimientos posibles de un alfil
function getBishopMoves(position, color){
    let p = position.split('-')
    let x = p[0]
    let y = p[1]
    let x_aux = x
    let y_aux = parseInt(y)

    while (x_aux < 'H' && y_aux < 8){
        x_aux = String.fromCharCode(x_aux.charCodeAt(0) + 1)
        y_aux++
        if(checkAndGetCaptures(x_aux, y_aux, color)){
            break
        } else {
            possibleMoves.push(x_aux + "-" + y_aux)
        }
    }
    x_aux = x
    y_aux = parseInt(y)

    while (x_aux < 'H' && y_aux > 1){
        x_aux = String.fromCharCode(x_aux.charCodeAt(0) + 1)
        y_aux--
        if(checkAndGetCaptures(x_aux, y_aux, color)){
            break
        } else {
            possibleMoves.push(x_aux + "-" + y_aux)
        }
    }

    x_aux = x
    y_aux = parseInt(y)

    while (x_aux > 'A' && y_aux > 1){
        x_aux = String.fromCharCode(x_aux.charCodeAt(0) - 1)
        y_aux--
        if(checkAndGetCaptures(x_aux, y_aux, color)){
            break
        } else {
            possibleMoves.push(x_aux + "-" + y_aux)
        }
    }

    x_aux = x
    y_aux = parseInt(y)

    while (x_aux > 'A' && y_aux < 8){
        x_aux = String.fromCharCode(x_aux.charCodeAt(0) - 1)
        y_aux++
        if(checkAndGetCaptures(x_aux, y_aux, color)){
            break
        } else {
            possibleMoves.push(x_aux + "-" + y_aux)
        }
    }

}


//funcion que devuelve los movimientos posibles de una torre
function getRookMoves(position, color){
    let p = position.split('-')
    let x = p[0]
    let y = p[1]
    let x_aux = x
    let y_aux = parseInt(y)

    while (x_aux < 'H'){
        x_aux = String.fromCharCode(x_aux.charCodeAt(0) + 1)
        if(checkAndGetCaptures(x_aux, y, color)){
            break
        } else {
            possibleMoves.push(x_aux + "-" + y)
        }
    }
    x_aux = x
    while (x_aux > 'A'){
        x_aux = String.fromCharCode(x_aux.charCodeAt(0) - 1)

        if(checkAndGetCaptures(x_aux, y, color)){
            break
        } else {
            possibleMoves.push(x_aux + "-" + y)
        }
        
    }

    while(y_aux < 8){
        y_aux++
        if(checkAndGetCaptures(x, y_aux, color)){
            break
        } else {
            possibleMoves.push(x + "-" + y_aux)
        }
    }
    y_aux = parseInt(y)
    while(y_aux > 1){
        y_aux--
        if(checkAndGetCaptures(x, y_aux, color)){
            break
        } else {
            possibleMoves.push(x + "-" + y_aux)
        }
    }
}


//funcion que devuelve los movimientos posibles de un caballo
function getKnightMoves(position, color){
    possibleMoves = []
}


//funcion que devuelve los movimientos posibles de una reina
function getQueenMoves(position, color){
    getBishopMoves(position, color)
    getRookMoves(position, color)
}


//funcion que devuelve los movimientos posibles de un rey
function getKingMoves(position, color){
    possibleMoves = []
}


// -----------------------------------------------------------------------------------
// HIGHLIGHT MOVES
// -----------------------------------------------------------------------------------


//funcion que destaca los movimientos posibles
function highlightPossibleMoves() {
    if (possibleMoves != []) {
        possibleMoves.forEach(move => {
            possibleMovesStyles.push(document.getElementById(move).style.backgroundColor)
            document.getElementById(move).style.backgroundColor = "red"
        })
    }
}


//funcion que devuelve las casillas de los movimientos posibles a sus colores originales
function unHighlightPossibleMoves() {
    possibleMoves.forEach(move => {
        document.getElementById(move).style.backgroundColor = possibleMovesStyles.shift()
    })
}


//funcion que hace que las casillas del ultimo movimiento se resalten
function highlightLastMove(lastMove) {
    let previousFirstPositionStyle = document.getElementById(lastMove.position1).style.backgroundColor
    let previousSecondPositionStyle = document.getElementById(lastMove.position2).style.backgroundColor
    lastMoveStyles = {previousFirstPositionStyle,previousSecondPositionStyle}
    document.getElementById(lastMove.position1).style.backgroundColor = "grey"
    document.getElementById(lastMove.position2).style.backgroundColor = "darkgrey"
}


//funcion que devuelve las casillas del ultimo movimiento a sus colores originales
function unHighlight(lastMove) {
    document.getElementById(lastMove.position1).style.backgroundColor = lastMoveStyles.previousFirstPositionStyle
    document.getElementById(lastMove.position2).style.backgroundColor = lastMoveStyles.previousSecondPositionStyle
}


// -----------------------------------------------------------------------------------
// MOVEMENT ANIMATIONS
// -----------------------------------------------------------------------------------


//funcion para la animacion de movimiento de las piezas
function moveAnimation(firstBox, secondBox) {
    var id = null;
    var posX = 0
    var posY = 0
    first = firstBox.children[0].children[0]
    firstBoxPos = firstBox.getBoundingClientRect();
    secondBoxPos = secondBox.getBoundingClientRect();
    topDiff = secondBoxPos.top - firstBoxPos.top
    leftDiff = secondBoxPos.left - firstBoxPos.left
    clearInterval(id);
    id = setInterval(frame, 0);
    let Ydone = 0
    let Xdone = 0
    function frame() {
        if (topDiff < 0 && !Ydone) {
            if (posY <= topDiff){
                Ydone = 1
            }
            posY = posY + (topDiff / 20)
            first.style.top = posY + 'px'
        } else if (topDiff > 0 && !Ydone) {
            if (posY >= topDiff){
                Ydone = 1
            }
            posY = posY + (topDiff / 20)
            first.style.top = posY + 'px'
        } else if (topDiff == 0) {
            Ydone = 1
        }
        if (leftDiff < 0 && !Xdone) {
            if (posX <= leftDiff){
                Xdone = 1
            }
            posX = posX + (leftDiff / 20)
            first.style.left = posX + 'px'
        } else if (leftDiff > 0 && !Xdone) {
            if (posX >= leftDiff){
                Xdone = 1
            }
            posX = posX + (leftDiff / 20)
            first.style.left = posX + 'px'
        } else if (leftDiff == 0) {
            Xdone = 1
        }

        if (Ydone && Xdone){
            clearInterval(id)
            move(firstBox.id, secondBox.id)
        }
    } 
}
loadPieces()


// -----------------------------------------------------------------------------------
// TIMER
// -----------------------------------------------------------------------------------


const addZero = (number) => {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}


let playing = false;
let time = localStorage.getItem("time")
document.getElementById('min1').textContent = addZero(time);
document.getElementById('min2').textContent = addZero(time);


const startTimer = () => {
    playing = true;
    let clock1_secs = 60;
    let clock2_secs = 60;

    let timerId = setInterval(function() {
        if (turn == "black") {
            if (playing) {
                clock1_mins = parseInt(document.getElementById("min1").textContent);
                if (clock1_secs == 60) {
                    clock1_mins = clock1_mins - 1;
                }
                clock1_secs = clock1_secs - 1;
                document.getElementById('sec1').textContent = addZero(clock1_secs);
                document.getElementById('min1').textContent = addZero(clock1_mins);
                if (clock1_secs == 0) {
                    if (clock1_secs == 0 && clock1_mins == 0) {
                        clearInterval(timerId);
                        playing = false;
                    }
                    clock1_secs = 60;
                }
            }
        } else {
            if (playing) {
                clock2_mins = parseInt(document.getElementById("min2").textContent);
                if (clock2_secs == 60) {
                    clock2_mins = clock2_mins - 1;
                }
                clock2_secs = clock2_secs - 1;
                document.getElementById('sec2').textContent = addZero(clock2_secs);
                document.getElementById('min2').textContent = addZero(clock2_mins);
                if (clock2_secs == 0) {
                    if (clock2_secs == 0 && clock2_mins == 0) {
                        clearInterval(timerId);
                        playing = false;
                    }
                    clock2_secs = 60;
                }
            }
        }
    }, 1000);
}


// -----------------------------------------------------------------------------------
// PIECES EVENT LISTENERS
// -----------------------------------------------------------------------------------


//listener de clicks en las casillas
/*
 *  Implementa un contador para diferenciar dos tipos de clicks:
 *      1. Selecciona la pieza a mover
 *      2. Selecciona la casilla objetivo
 */
function boxClicked(e) {
    let element = e.target.closest(".box")
    if ((clicked == 0) && element.hasChildNodes()) {
        if ((firstSelection = selectPiece(element, turn)) != null) {
            if (possibleMoves != null) {
            unHighlightPossibleMoves()
        }
            getMoves(element)
            highlightPossibleMoves()
            clicked = 1
        }
    } else if((clicked == 1) && (firstSelection != element.id)){
        if (possibleMoves != null) {
            unHighlightPossibleMoves()
        }
        if (element.hasChildNodes() && element.children[0].dataset.color == turn) {
            firstSelection = selectPiece(element, turn)
            getMoves(element)
            highlightPossibleMoves()
        } else {
            //FORMA PROVISIONAL DE ASEGURARSE DE QUE LOS PEONES SOLO SE MUEVAN A LAS CASILLAS QUE ES LEGAL QUE SE MUEVAN
            if (document.getElementById(firstSelection).children[0].dataset.piece != "king" && document.getElementById(firstSelection).children[0].dataset.piece != "knight"){
                if (possibleMoves.includes(element.id)){
                    clicked = 0
                    firstBox = document.getElementById(firstSelection)
                    firstBox.children[0].children[0].style.position = "absolute";
                    moveAnimation(firstBox, element)
                    if (lastMove != null) {
                        unHighlight(lastMove)
                    }
                    saveLastMove(firstSelection, element.id)
                    endTurn()
                    highlightLastMove(lastMove)
                } else {
                    clicked = 0
                    return
                }

            } else { //CODIGO QUE SE APLICA A LAS DEMAS PIEZAS QUE NO SEAN PEONES PARA QUE PUEDAN MOVERSE A CUALQUIER CASILLA EN FALTA DE IMPLEMENTAR LA FUNCIÓN DE MOVIMIENTOS POSIBLES DEL RESTO DE PIEZAS
                clicked = 0
                firstBox = document.getElementById(firstSelection)
                firstBox.children[0].children[0].style.position = "absolute";
                moveAnimation(firstBox, element)
                if (lastMove != null) {
                    unHighlight(lastMove)
                }

                saveLastMove(firstSelection, element.id)
                endTurn()
                highlightLastMove(lastMove)
            }
        }
    }
}


//variables para calcular el offset de una pieza al ser draggeada
let l = null
let t = null

//variable para comprobar si se debe ignorar el evento mouseup en caso de que se produzca en una situacion nula
let skip_mouseup = 0

//variable para gestionar que pieza se está draggeando
let dragged_box_id

//funcion que gestiona el movimiento de una pieza mientras se draggea
$(".chess-board").mousemove(function (e) {
    var pointer = document.getElementsByClassName('pointer');
    if(pointer.length > 0){
        $(".pointer").css({ left: e.pageX - l - 25, top: e.pageY - t - 15 });
    }

});


//funcion que gestiona el evento mousedown al draggear una pieza
$(".chess-board").mousedown(function(e){
    let element = e.target.closest(".box") //element == pieza a ser arrastrada
    if (element.hasChildNodes() && element.children[0].dataset.color == turn){  //comprobacion de element tiene una pieza valida
        dragged_box_id = element.id
        element.children[0].children[0].style.position = "relative"
        element.children[0].children[0].classList.add("pointer")
        l = $(".pointer").offset().left
        t = $(".pointer").offset().top

        if ((firstSelection = selectPiece(element, turn)) != null) {
            if (possibleMoves != []) {
                unHighlightPossibleMoves()
            }
            getMoves(element)
            highlightPossibleMoves()
        }
    } else { //si element no tiene una pieza valida, se salta el siguiente evento mouseup
        skip_mouseup = 1
    }

})


// TODO: TENER EN CUENTA EL CASO DE QUE EL MOUSEUP OCURRA FUERA DEL TABLERO
//funcion que gestiona el evento mouseup, aka el soltar una pieza draggeada en una casilla
$(".chess-board").mouseup(function (evento) {
    if (!skip_mouseup){
        let element = evento.target.closest(".box")
        let dragged = document.getElementById(dragged_box_id)


        if ((element.hasChildNodes() && element.children[0].dataset.color == turn) || dragged.id == element.id){
            if (possibleMoves != null) {
                unHighlightPossibleMoves()
            }
            getMoves(dragged)
            highlightPossibleMoves()
            
            
            dragged.children[0].children[0].classList.remove("pointer")
            document.getElementById(dragged.id).children[0].children[0].style.top = 0
            document.getElementById(dragged.id).children[0].children[0].style.left = 0
            dragged.children[0].children[0].style.position = "relative"
            
        } else {
            if(dragged.children[0].dataset.piece != "king" && dragged.children[0].dataset.piece != "knight"){
                if(possibleMoves.includes(element.id)){
                    if (possibleMoves != null) {
                        unHighlightPossibleMoves()
                    }
                    if(document.getElementById(dragged_box_id).hasChildNodes()){
                        document.getElementById(dragged_box_id).children[0].children[0].classList.remove("pointer")
                    }
                    
                    move(dragged_box_id, element.id)
                    if (lastMove != null) {
                        unHighlight(lastMove)
                    }
                    saveLastMove(dragged_box_id, element.id)
                    endTurn()
                    highlightLastMove(lastMove)
                } else {
                    dragged.children[0].children[0].classList.remove("pointer")
                    document.getElementById(dragged.id).children[0].children[0].style.top = 0
                    document.getElementById(dragged.id).children[0].children[0].style.left = 0
                    dragged.children[0].children[0].style.position = "relative"

                    if (possibleMoves != null) {
                        unHighlightPossibleMoves()
                    }
                }
            } else {
                if (possibleMoves != null) {
                    unHighlightPossibleMoves()
                }
                if(document.getElementById(dragged_box_id).hasChildNodes()){
                    document.getElementById(dragged_box_id).children[0].children[0].classList.remove("pointer")
                }
                
                move(dragged_box_id, element.id)
                if (lastMove != null) {
                    unHighlight(lastMove)
                }
                saveLastMove(dragged_box_id, element.id)
                endTurn()
                highlightLastMove(lastMove)
            }
        }
    } else {
        skip_mouseup = 0
    }
})