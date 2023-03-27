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
console.log(typeof xmlContent)

function loadTable() {
    let games = xmlContent.getElementsByTagName("partida")
    let table = document.getElementsByTagName("tbody")
    for (let i = 0; i < games.length; i++) {
        const tr = table[0].insertRow()
        for (let j = 0; j < 5; j++) {
            const td = tr.insertCell();
            if (j == 1){
                td.appendChild(document.createTextNode(games[i].children[j].textContent))
                td.appendChild(document.createElement('br'))
                td.appendChild(document.createTextNode(games[i].children[j+1].textContent))
                j++
            } else {
                td.appendChild(document.createTextNode(games[i].children[j].textContent))
            }

        }
    }
}

