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

// Model
var model = {
    boardSize: 7,
    shipLength: 3,
    shipCount: 3,
    shipSinking: 0,

    ships: [
        {locations: ["0", "0", "0"], hit: ["", "", ""]},
        {locations: ["0", "0", "0"], hit: ["", "", ""]},
        {locations: ["0", "0", "0"], hit: ["", "", ""]}
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
    },

    generateShipLocations: function () {
        var locations;
        for(var i = 0; i < this.shipCount; i++) {
            do {
                locations = this.generateShip();
            } while(this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if(direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }

        var newShipLocations = [];
        for(var i = 0; i < this.shipLength; i++) {
            if(direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for(var i =0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for(var j = 0; j < locations.length; j++) {
                if(ship.locations.indexOf(locations[j]) >= 0) return true;
            }
        }
    }
};

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

// Initialising game
function init() {
    view.showMessage("Battleship! Your turn!");
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var shotInput = document.getElementById("guessInput");
    shotInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

window.onload = init;