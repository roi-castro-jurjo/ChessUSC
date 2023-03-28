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

//funcion que carga las piezas en sus casillas iniciales en el tablero
function displayChessPieces(piecesObject) {
    boxes.forEach(box => {
        box.innerHTML = ""
    })
    piecesObject.pieces.lightpieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += 
            `<div class="piece light" style="pointer-events: none;" data-piece="${piece.piece}" data-points="${piece.points}" data-color="${piece.color}">
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

//funcion que accede al fichero json con la definicion de las piezas
async function loadPieces(){
    const response = await fetch('../json/pieces.json');
    const data = await response.json();
    displayChessPieces(data)
}



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
            if (document.getElementById(firstSelection).children[0].dataset.piece == "pawn"){
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
    let piece = box.children[0].dataset.piece
    if (piece == "pawn"){
         getPawnMoves(box.id, box.children[0].dataset.color)
    }else if (piece == "bishop"){
        possibleMoves = []
    }else if (piece == "knight"){
        possibleMoves = []
    }else if (piece == "rook"){
        possibleMoves = []
    }else if (piece == "queen"){
        possibleMoves = []
    }else if (piece == "king"){
        possibleMoves = []
    }
}

//funcion que devuelve los posibles movimientos de un peon
function getPawnMoves(position, color) {
    possibleMoves = []
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



/************************************************** TIMER ********************************* */

let playing = false;

const addZero = (number) => {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

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

$(".chess-board").mousemove(function (e) {
    var pointer = document.getElementsByClassName('pointer');
    if(pointer.length > 0){
        $(".pointer").css({ left: e.pageX - l - 25, top: e.pageY - t - 15 });
    }

});



let l = null
let t = null
let skip_mouseup = 0

let dragged_box_id

$(".chess-board").mousedown(function(e){
    let element = e.target.closest(".box")
    if (element.hasChildNodes() && element.children[0].dataset.color == turn){
        dragged_box_id = element.id
        element.children[0].children[0].style.position = "relative"
        element.children[0].children[0].classList.add("pointer")
        l = $(".pointer").offset().left
        t = $(".pointer").offset().top

        if ((firstSelection = selectPiece(element, turn)) != null) {
            if (possibleMoves != null) {
                unHighlightPossibleMoves()
            }
            getMoves(element)
            highlightPossibleMoves()
            clicked = 1
        }
    } else {
        skip_mouseup = 1
    }

})

// TODO: TENER EN CUENTA EL CASO DE QUE EL MOUSEUP OCURRA FUERA DEL TABLERO

$(".chess-board").mouseup(function (evento) {
    if (!skip_mouseup){
        let element = evento.target.closest(".box")
        let dragged = document.getElementById(dragged_box_id)


        if (element.hasChildNodes() && element.children[0].dataset.color == turn || dragged.id == element.id){
            if (possibleMoves != null) {
                unHighlightPossibleMoves()
            }
            getMoves(dragged)
            highlightPossibleMoves()
            clicked = 1
            
            dragged.children[0].children[0].classList.remove("pointer")
            document.getElementById(dragged.id).children[0].children[0].style.top = 0
            document.getElementById(dragged.id).children[0].children[0].style.left = 0
            dragged.children[0].children[0].style.position = "relative"
            
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
    } else {
        skip_mouseup = 0
    }
    

    


})