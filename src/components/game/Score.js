import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import game from "../shared/models/Game";
import { Redirect } from "react-router-dom";

class Score extends React.Component {
  constructor() {
    super();
    this.state = {
      ID_game: null,
      ID_player: null,
      player: null,
      status: null,
      game: null,
      players: null,
    };
  }

  async componentDidMount() {
    try {
      //id aus url
      this.state.ID_game = this.props.match.params.gameId;

      //player id aus local storage, set in dahboard
      this.state.ID_player = localStorage.getItem("Id");

      //current player
      //set player and playerstatus
      const current_player = await api.get(
        `/games/players/${this.state.ID_player}`
      );

      //get all players sorted descendend
      const all_players = await api.get(`/games/${this.state.ID_game}/players?sort_by=score.desc`);

      //get the game and its status
      const get_game = await api.get(`/games/${this.state.ID_game}`);

      /*
            set and update state of:
            - current player
            - all players
            - game
            - game status
      
            then check if the game is ready to start
            */

      this.setState({
        players: all_players.data,
        player: current_player.data,
        status: current_player.data.status,
        game: get_game.data,
      });
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  createTable() {
    let table = [];
    // Outer loop to create parent
    for (let i = 0; i < this.state.players.length; i++) {
      let children = [];
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        if (j === 0) {
          children.push(<td>{i + 1}</td>);
        }
        if (j === 1) {
          children.push(<td>{this.state.players[i].name}</td>);
        }
        if (j === 2) {
          children.push(<td class="text-success">{this.state.players[i].score}</td>);
        }
      }
      table.push(<tr class="text-white">{children}</tr>);
    }
    //Create the parent and add the children
    return table;
  }

  teamScore() {
    let sum = 0;
    for (let i = 0; i < this.state.players.length; i++) {
      sum += this.state.players[i].score;
    }
    return sum;
  }

  async exitLobby() {
    /*
    if a user exits the lobby then:
    - change status to not ready
    - delete player from player list in game
    - redirect to dashboard
  
    */

    //need time to change player status
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let requestBody;

      //delete player from player list in game
      requestBody = JSON.stringify({
        player: this.state.player,
      });
      // send request body to the backend
      console.log(requestBody);
      await api.delete(
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
        requestBody
      );
      //change local storage
      localStorage.removeItem("status");
      localStorage.removeItem("gameId");
      localStorage.removeItem("role");
      localStorage.removeItem("Id");

      this.props.history.push("/dashboard");
      //who is resetting the game state
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }
  async saveChangePlayerStatus() {
    try {
      let requestBody;

      //send in the request body the user and its current status
      requestBody = JSON.stringify({
        status: this.state.status,
      });

      // send request body to the backend
      await api.put(
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
        requestBody
      );
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }


  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col xs="5" md="3">
              <img
                className="logoImgSmall"
                src={logo}
                alt="Just One Logo"
              ></img>
            </Col>
            <Col xs={{ span: 3, offset: 0 }} md={{ span: 2, offset: 2 }}>
              <Row></Row>
            </Col>
            <Col xs={{ span: 3, offset: 1 }} md={{ span: 2, offset: 3 }}>
              <Row className="d-flex justify-content-end">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  onClick={() => this.exitLobby()}
                >
                  Back to Lobby
                </Button>
              </Row>
              <Row className="d-flex justify-content-end">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                >
                  Rules
                </Button>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 2, offset: 2 }}></Col>
            <Col xs="7" md="3">
              <h1>Team Score: {this.teamScore()}</h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "6vw" }}>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 2, offset: 2 }}></Col>
            <Col xs="7" md="3">
              <Table striped bordered hover size="sm">
                <thead class="text-white">
                  <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>score</th>
                  </tr>
                </thead>
                <tbody class="text-white">{this.createTable()}</tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Score);
