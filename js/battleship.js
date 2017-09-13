// View
var view = {
    showMessage: function (msg) {
        document.getElementById("messageArea").innerHTML = msg;
    },

    showMiss: function (location) {
        document.getElementById(location).setAttribute("class", "miss");
    },

    showHit: function (location) {
        document.getElementById(location).setAttribute("class", "hit");
    }
};

// view.showMessage("Seabattle!");
// view.showMiss("05");
// view.showHit("34");

// Model
var model = {
    boardSize: 7,
    shipLength: 3,
    shipCount: 3,
    shipSinking: 0,

    ships: [
        {locations: ["01", "02", "03"], hit: ["", "", ""]},
        {locations: ["45", "55", "65"], hit: ["", "", ""]},
        {locations: ["21", "22", "23"], hit: ["", "", ""]}
    ],

    fire: function (shot) {
        for(var i = 0; i < this.shipCount; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(shot);
            if(index >= 0) {
                ship.hit[index] = "hit";
                view.showHit(shot);
                view.showMessage("There is a hit!");
                // проверка, потоплен ли корабль
                if(this.isSunk(ship)) {
                    view.showMessage("The ship sunk!!");
                    this.shipSinking++;
                }
                return true;
            }
        }
        view.showMiss(shot);
        view.showMessage("You missed!");
        return false;
    },
    
    isSunk: function (ship) {
        for(var i = 0; i < this.shipLength; i++) {
            if(ship.hit[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
};

// model.fire("01");
// model.fire("02");
// model.fire("03");

// Controller
var controller = {
    shotCount: 0,

    processShot: function (shot) {
        var location = parseShot(shot);
        if(location) {
            this.shotCount++;
            var hit = model.fire(location);
            if(hit && model.shipCount == model.shipSinking) {
                view.showMessage("All the ships sunk " + this.shotCount + " shots!");
                document.getElementsByTagName("form")[0].innerHTML =
                    "<a href=\"index.html\">New game</a>";
            }
        }
    }
};

// controller.processShot("A1");
// controller.processShot("A2");
// controller.processShot("A3");
//
// controller.processShot("E5");
// controller.processShot("F5");
// controller.processShot("G5");
//
// controller.processShot("C5");
//
// controller.processShot("C1");
// controller.processShot("C2");
// controller.processShot("C3");

// Helper functions
function parseShot(shot) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    var alphabetSmall = ["a", "b", "c", "d", "e", "f", "g"];
    if(shot === null || shot.length !== 2) {
        alert("Oops, please enter a valid number followed by stroke!");
    } else {
        var firstChar = shot.charAt(0);
        var row;
        if(alphabet.indexOf(firstChar) >= 0) row = alphabet.indexOf(firstChar);
        if(alphabetSmall.indexOf(firstChar) >= 0) row = alphabetSmall.indexOf(firstChar);
        var col = shot.charAt(1);
        // проверки row, col
        if(isNaN(row) || isNaN(col)) {
            alert("Oops, that isn't on the board..");
        } else if(row < 0 || row >= model.boardSize ||
                    col < 0 || col >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + col;
        }
    }
    return null;
}

function handleFireButton() {
    var shotInput = document.getElementById("guessInput");
    var shot = shotInput.value;

    controller.processShot(shot);
    shotInput.value = "";
    shotInput.focus();
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function init() {
    view.showMessage("Battleship! Your turn!");
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var shotInput = document.getElementById("guessInput");
    shotInput.onkeypress = handleKeyPress;
}

window.onload = init;