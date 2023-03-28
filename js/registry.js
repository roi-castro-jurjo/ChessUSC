var path = '../xml/games.xml';
var xmlText = null;

//funcion que se encarga leer y devolver el contenido de un fichero xml
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseXML;
    }
    return result;
}

//carga del xml con el registro de partidas
xmlContent = loadFile(path)

//funcion de creacion de la tabla de historial de partidas en base al archivo xml
function loadTable() {
    let games = xmlContent.getElementsByTagName("partida")
    let table = document.getElementsByTagName("tbody")
    for (let i = 0; i < games.length; i++) {
        const tr = table[0].insertRow()
        for (let j = 0; j < 6; j++) {
            const td = tr.insertCell();
            //las celdas de jugadores y resultado ocupan dos lineas para corresponder cada jugador con su resultado
            if (j == 1){
                td.appendChild(document.createTextNode(games[i].children[j].textContent))
                td.appendChild(document.createElement('br'))
                td.appendChild(document.createTextNode(games[i].children[j+1].textContent))
                j++
            } else if (j == 3) {
                td.appendChild(document.createTextNode(games[i].children[j].textContent))
                td.appendChild(document.createElement('br'))
                td.appendChild(document.createTextNode(games[i].children[j+1].textContent))
                j++
            } else {
                td.appendChild(document.createTextNode(games[i].children[j].textContent))
            }
        }
    }

    //llamada a la funcion de estilos de la tabla
    tableStyle()
}

//funcion que asigna un color a cada fila en funcion del resultado del jugador de la primera fila
function tableStyle() {
    let pos = null
    var gif = document.getElementsByClassName('registry-gif')
    console.log(gif)
    let rows = document.getElementsByTagName('tr')
    for (let i = 1; i < rows.length; i++) {
        console.log(rows[i])
        if (rows[i].childNodes[2].childNodes[0].textContent == '1') {
            rows[i].onmouseover = function() {
                pos = rows[i].getBoundingClientRect()
                this.style.backgroundColor = 'green'
                gif[i-1].style.visibility = 'visible'
                gif[i-1].style.top = pos.top - 30
                gif[i-1].style.left = pos.right + 40
            }
            rows[i].onmouseleave = function() {
                this.style.backgroundColor = 'black'
                gif[i-1].style.visibility = 'hidden'
            }
        } else {
            rows[i].onmouseover = function() {
                pos = rows[i].getBoundingClientRect()
                this.style.backgroundColor = 'red'
                gif[i-1].style.visibility = 'visible'
                gif[i-1].style.top = pos.top - 30
                gif[i-1].style.left = pos.right + 40
            }
            rows[i].onmouseleave = function() {
                this.style.backgroundColor = 'black'
                gif[i-1].style.visibility = 'hidden'
            }
        }
    }    
}

