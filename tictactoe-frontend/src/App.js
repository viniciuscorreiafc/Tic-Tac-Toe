import React, { Component } from 'react';
import axios from "axios";
import xImage from "./images/X.png"
import oImage from "./images/O.png"



import './App.css';

class App extends Component {
  state = {
    game: {
      "id" : "NULL",
      "playerTurn" : "NULL",
      "table" : [[0,0,0],[0,0,0],[0,0,0]],
      "winner": "Nobody",
      "message": "",
      playerX: "PlayerX",
      playerO: "PlayerO"
    },
    gameStart: false,
    submitPlayers: false,
    playerX: "PlayerX",
    playerO: "PlayerO"
  }

  async componentDidMount() {
    const message = this.state.game.message;
    if (localStorage.getItem("gameID") === null && !(message.includes("Partida Finalizada"))) {
      const response = await axios.post('http://localhost:8080/game');
      this.setState({game: response.data.game});
      localStorage.setItem("gameID", this.state.game.id);
    }
    console.log(this.state);
  }

  makeMove =  async (positionX, positionY) => {
    if (!this.state.submitPlayers) {
      const response = await axios.put("http://localhost:8080/game/" + localStorage.getItem("gameID") + "/players", {
        playerNameX: this.state.playerX,
        playerNameO: this.state.playerO,
        player: this.state.game.playerTurn,
        table: this.state.game.table
      });
      this.setState({
        game: response.data.game,
        submitPlayers: true
      });
    }

    console.log(this.state);
    this.setState({gameStart: true});
    let message = this.state.game.message;
    if (!message.includes("Partida Finalizada")) {
      const response = await axios.post("http://localhost:8080/game/" + localStorage.getItem("gameID") + "/movement", {
        player: this.state.game.playerTurn,
        position: {
          x: positionX,
          y: positionY
        },
        table: this.state.game.table
      });
      this.setState({game: response.data.game});
    }
    message = this.state.game.message;
    console.log(message);
    if (message.includes("Partida Finalizada")) localStorage.removeItem("gameID");
  }

  handleNamePlayerX = (event) => {
    this.setState({playerX: event.target.value})
  }

  handleNamePlayerO = (event) => {
    this.setState({playerO: event.target.value})
  }

  submitPlayers =  async () => {
    if (!this.state.submitPlayers) {
      const response = await axios.put("http://localhost:8080/game/" + localStorage.getItem("gameID") + "/players", {
        playerNameX: this.state.playerX,
        playerNameO: this.state.playerO,
        player: this.state.game.playerTurn,
        table: this.state.game.table
      });
      this.setState({
        game: response.data.game,
        submitPlayers: true
      });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="game-header">
          {this.state.game.message !== "" ? 
            <h1 className="title">{this.state.game.message}</h1> : <h1 className="title">TIC TAC TOE</h1>
          }
        </header> 

        {!this.state.gameStart && !this.state.submitPlayers ?
          <form>
            <label>Jogador X: </label>
            <input type="text" onChange={this.handleNamePlayerX}/><br/><br/>
            <label>Jogador O: </label>
            <input type="text" onChange={this.handleNamePlayerO}/><br/><br/>
          </form> : null
        }   

        <div className="game">
            <div className="row">

                <div className="board-space" id="board-space-20" onClick={() => this.makeMove(0, 2)}>
                  {this.state.game.table !== undefined && this.state.game.table[0][2] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[0][2] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

                <div className="board-space" id="board-space-21" onClick={() => this.makeMove(1, 2)}>
                  {this.state.game.table !== undefined && this.state.game.table[1][2] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[1][2] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

                <div className="board-space" id="board-space-23" onClick={() => this.makeMove(2, 2)}>
                  {this.state.game.table !== undefined && this.state.game.table[2][2] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[2][2] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

            </div>
            <div className="row">

                <div className="board-space" id="board-space-10" onClick={() => this.makeMove(0, 1)}>
                  {this.state.game.table !== undefined && this.state.game.table[0][1] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[0][1] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

                <div className="board-space" id="board-space-11" onClick={() => this.makeMove(1, 1)}>
                  {this.state.game.table !== undefined && this.state.game.table[1][1] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[1][1] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

                <div className="board-space" id="board-space-12" onClick={() => this.makeMove(2, 1)}>
                  {this.state.game.table !== undefined && this.state.game.table[2][1] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[2][1] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

            </div>
            <div className="row">

                <div className="board-space" id="board-space-00" onClick={() => this.makeMove(0, 0)}>
                  {this.state.game.table !== undefined && this.state.game.table[0][0] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[0][0] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

                <div className="board-space" id="board-space-01" onClick={() => this.makeMove(1, 0)}>
                  {this.state.game.table !== undefined && this.state.game.table[1][0] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[1][0] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>

                <div className="board-space" id="board-space-02" onClick={() => this.makeMove(2, 0)}>
                  {this.state.game.table !== undefined && this.state.game.table[2][0] === 1 ?
                    <img src={xImage} alt="X" /> : null
                  }
                  {this.state.game.table !== undefined && this.state.game.table[2][0] === 2 ?
                    <img src={oImage} alt="O" /> : null
                  }
                </div>
                
            </div>
        </div>
      </div>
    );
  }
}

export default App;
