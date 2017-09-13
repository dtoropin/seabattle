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