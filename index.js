const boxes = document.querySelectorAll(".box")

let clicked = 0                 //diferenciador de primer y segundo click
let turn = "white"              //variable de turno    
let pieceSelection = null       //pieza selccionada
let boxSelection = null         //casilla a donde mover la pieza

let possibleMovesStyles = []
let possibleMoves = []

let lastMove = null             //informacion del ultimo movimiento efectuado
let lastMoveStyles = null

//funcion que carga las piezas en sus casillas iniciales en el tablero
function displayChessPieces() {
    boxes.forEach(box => {
        box.innerHTML = ""
    })
    lightPieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += `
            <div class="piece light" data-piece="${piece.piece}" data-points="${piece.points}" data-color="${piece.color}">
                <img src="${piece.icon}" alt="Chess Piece" >
            </div>
        `
    })
    blackPieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += `
            <div class="piece black" data-piece="${piece.piece}" data-points="${piece.points}" data-color="${piece.color}">
                <img src="${piece.icon}" alt="Chess Piece" >
            </div>
        `
    })
    boxListener()
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
            possibleMoves = getMoves(element)
            highlightPossibleMoves()
            clicked = 1
        }
    } else if((clicked == 1) && (firstSelection != element.id)){
        if (lastMove != null) {
            unHighlight(lastMove)
        }
        if (possibleMoves != null) {
            unHighlightPossibleMoves()
        }
        if (element.hasChildNodes() && element.children[0].dataset.color == turn) {
            firstSelection = selectPiece(element, turn)
            possibleMoves = getMoves(element)
            highlightPossibleMoves()
        } else {
            clicked = 0
            move(firstSelection,element.id)
            saveLastMove(firstSelection, element.id)
            endTurn()
            highlightLastMove(lastMove)
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

//funcion de implementacion de movimiento. Dada dos posiciones del tablero, intercambia sus contenidos
function move(position1, position2) {
    document.getElementById(position2).innerHTML = document.getElementById(position1).innerHTML
    document.getElementById(position1).innerHTML = ""
}

//funcion que devuelve la lista de posibles movimientos en forma de array de posiciones
function getMoves(box) {
    let piece = box.children[0].dataset.piece
    if (piece == "pawn"){
         return getPawnMoves(box.id, box.children[0].dataset.color)
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
        if (y < 8 && !document.getElementById(x.concat('-', nextY)).hasChildNodes()) {
            if (y == 2 && !document.getElementById(x.concat('-', nextY2)).hasChildNodes()){
                possibleMoves.push(x.concat('-', nextY2))
            }
            possibleMoves.push(x.concat('-', nextY))
        } 
    } else {
        let nextY = parseInt(y) - 1
        let nextY2 = parseInt(y) - 2
        if (y > 1 && !document.getElementById(x.concat('-', nextY)).hasChildNodes()) {
            if (y == 7 && !document.getElementById(x.concat('-', nextY2)).hasChildNodes()){
                possibleMoves.push(x.concat('-', nextY2))
            }
            possibleMoves.push(x.concat('-', nextY))
        }
    }
    return possibleMoves
}

function highlightPossibleMoves() {
    if (possibleMoves != []) {
        possibleMoves.forEach(move => {
            possibleMovesStyles.push(document.getElementById(move).style.backgroundColor)
            document.getElementById(move).style.backgroundColor = "red"
        })
    }
}

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

displayChessPieces()