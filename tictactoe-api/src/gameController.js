const { json } = require("body-parser");
const express = require("express");
// const User = require('../models/Game.js');
const fs = require("fs");


const router = express.Router();

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function setFirstPlayer() {
    const firstPlayerNumber = Math.floor(Math.random() * 2);
    if (firstPlayerNumber === 1) return "X";
    else return "O";
}

function checkGameState(game, player, position) {
    let error;
    if (game.winner !== "Nobody") {
        error = "Partida Finalizada";
        throw error;
    }

    if (game.playerTurn !== player) {
        error = "Não é turno do jogador";
        throw error;
    }

    if (game.table[position.x][position.y] !== 0) {
        error = "Movimento inválido";
        throw error;
    }
}

function checkPlayerWin(game, player) {
    for (i = 0; i < 3; i++) {
        if (game.table[i][0] === game.table[i][1] && game.table[i][0] === game.table[i][2] && game.table[i][0] !== 0) {
            if (player === "X") return game.playerX;
            else return game.playerO;
        }
        if (game.table[0][i] === game.table[1][i] && game.table[0][i] === game.table[2][i] && game.table[0][i] !== 0) {
            if (player === "X") return game.playerX;
            else return game.playerO;
        }
    }
    if (game.table[0][0] === game.table[1][1] && game.table[0][0] === game.table[2][2] && game.table[0][0] !== 0) {
        if (player === "X") return game.playerX;
            else return game.playerO;
    }
    if (game.table[0][2] === game.table[1][1] && game.table[0][2] === game.table[2][0] && game.table[1][1] !== 0) {
        if (player === "X") return game.playerX;
            else return game.playerO;
    }
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (game.table[i][j] === 0) {
                return "Nobody";
            }
        }
    }
    return "Draw";
}

function writeGameFile (game) {
    const jsonData = JSON.stringify(game);
    fs.writeFile("./game_files/" + game.id + ".json", jsonData, (err) => {
        if (err) {
            throw err;
        }
    });
}

router.post("/", async (req, res) => { 
    const id = uuidv4();
    const firstPlayer = setFirstPlayer();
    const table = [[0,0,0],[0,0,0],[0,0,0]];
    const game = {
        "id" : id,
        "playerTurn" : firstPlayer,
        "table" : table,
        "winner": "Nobody",
        "message": "Primeiro Jogador: " + firstPlayer,
        "playerX": "player X",
        "playerO": "player O"
    };
    
    writeGameFile(game);
    return res.send({ game });
});

router.post("/:id/movement", async (req, res) => {
    const id = req.params.id;
    const player = req.body.player;
    const position = req.body.position;
    const actualTable = req.body.table;

    let jsonData;
    let game = {
        "id" : id,
        "playerTurn" : player,
        "table" : actualTable,
        "winner": "Nobody",
        "message": "",
        "playerX": "player X",
        "playerO": "player O"
    };
    
    try {
        jsonData = fs.readFileSync("./game_files/" + id + ".json", "utf-8");
    } catch {
        game.message = "Partida não encontrada";
        return res.send({ game });
    }
    game = JSON.parse(jsonData.toString());
    
    try{
        checkGameState(game, player, position);
    } catch (error) {
        game.message = error;
        return res.send({ game });
    }

    if (player === "X") game.table[position.x][position.y] = 1;
    else game.table[position.x][position.y] = 2;

    if (player === "X") game.playerTurn = "O";
    else game.playerTurn = "X";

    game.winner = checkPlayerWin(game, player)
    writeGameFile(game);

    if (game.winner != "Nobody") {
        if (game.winner === "Draw") {
            game.message = "Partida Finalizada: EMPATE!"
        }
        else {
            game.message = "Partida Finalizada: " + game.winner + " é o ganhador!" 
        }
        writeGameFile(game);
        return res.send({ game });
    }


    return res.send({ game });
});

router.put("/:id/players", async (req, res) => { 
    const id = req.params.id;
    const playerX = req.body.playerNameX;
    const playerO = req.body.playerNameO;
    const player = req.body.player;
    const actualTable = req.body.table;

    console.log(player);
    console.log(id)

    let jsonData;
    let game = {
        "id" : id,
        "playerTurn" : player,
        "table" : actualTable,
        "winner": "Nobody",
        "message": "",
        "playerX": "player X",
        "playerO": "player O"
    };
    
    try {
        jsonData = fs.readFileSync("./game_files/" + id + ".json", "utf-8");
    } catch {
        game.message = "Partida não encontrada";
        return res.send({ game });
    }
    game = JSON.parse(jsonData.toString());
    game.message = "";

    game.playerX = playerX;
    game.playerO = playerO;
    writeGameFile(game);
    console.log(game);
    return res.send({ game });
});




module.exports = app => app.use("/game", router);