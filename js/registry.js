var path = '../xml/games.xml';
var xmlText = null;

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

xmlContent = loadFile(path)

function loadTable() {
    let games = xmlContent.getElementsByTagName("partida")
    let table = document.getElementsByTagName("tbody")
    for (let i = 0; i < games.length; i++) {
        const tr = table[0].insertRow()
        for (let j = 0; j < 6; j++) {
            const td = tr.insertCell();
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
    tableStyle()
}

function tableStyle() {
    let rows = document.getElementsByTagName('tr')
    for (let i = 0; i < rows.length - 1; i++) {
        if (rows[i+1].childNodes[2].childNodes[0].textContent == '1') {
            rows[i+1].onmouseover = function() {
                this.style.backgroundColor = 'green'
                this.style.filter = 'brightness(80%)'
            }
            rows[i+1].onmouseleave = function() {
                this.style.backgroundColor = 'black'
            }
        } else {
            rows[i+1].onmouseover = function() {
                this.style.backgroundColor = 'red'
                this.style.filter = 'brightness(80%)'
            }
            rows[i+1].onmouseleave = function() {
                this.style.backgroundColor = 'black'
            }
        }
    }
}
