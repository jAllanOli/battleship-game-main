var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById('messageArea')
        messageArea.innerHTML = msg
    },

    displayHit: function (location) {
        var cell = document.getElementById(location)
        cell.setAttribute('class', 'hit')
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location)
        cell.setAttribute('class', 'miss')
    }
}

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsShunk: 0,
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2)
        var row;
        var col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)))
        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)))
            col = Math.floor(Math.random() * this.boardSize)
        }

        var newShipLocations = []
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i))
            } else {
                newShipLocations.push((row + i) + "" + col)
            }
        }
        return newShipLocations
    },

    generateShipLocations: function() {
        var locations
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations));
            this.ships[i].locations = locations
        }
    },

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            var index = ship.locations.indexOf(guess)
            if (index >= 0) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("HIT!!")
                if (this.isSunk(ship)) {
                    this.shipsShunk++
                    view.displayMessage("You sank my battleship!")
                }
                return true
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.")
        return false
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }
        return true
    }
}

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess)
        if (location) {
            this.guesses++
            var hit = model.fire(location)
            if (hit && model.shipsShunk === model.numShips) {
                view.displayMessage(`You sank all my battleships, in ${this.guesses} guesses`)
            }
        }
    }
}

function parseGuess(guess) {
    var letters = ["A", "B", "C", "D", "E", "F", "G"]

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.")
    } else {
        var firstChar = guess.charAt(0)
        var row = letters.indexOf(firstChar)
        var column = guess.charAt(1)

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.")
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!")
        } else {
            return row + column
        }
    }
    return null
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput")
    var guess = guessInput.value
    controller.processGuess(guess)
    guessInput.value = ""
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton")
    if (e.keyCode === 13) {
        fireButton.click()
        return false
    }
}

function init() {
    var fireButton = document.getElementById("fireButton")
    fireButton.onclick = handleFireButton
    var guessInput = document.getElementById("guessInput")
    guessInput.onkeypress = handleKeyPress

    model.generateShipLocations()
}

window.onload = init