import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Modal,
  Table,
} from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import aLobby from "../../views/aLobby";
import Game from "../shared/models/Game";
import { Spinner } from "../../views/design/Spinner";

class Dashboard extends React.Component {
  constructor() {
    super();
   
    this.state = {
      // games stores only the games with status
      //games: [game1, game2],
      games: [],
      newGame: null,
      toLong: null,
      selectLobby: null,
      userId: null,
      user: null,
      timer: null,
      timerScoarboard: null,
      noLobby: null,
      token: null,
      alarm: null,
      rules: false,
      scoarboard: null,
      scoarboardList: null,
      creatScoarboardList: null,
      readyToRender: null,
      score: null,
    };

    this.selectLobby = this.selectLobby.bind(this);
  }

  async componentDidMount() {
    try {
      //change local storage
      localStorage.removeItem("status");
      localStorage.removeItem("gameId");
      localStorage.removeItem("role");
      localStorage.removeItem("Id");

      this.state.userId = localStorage.getItem("userId");
      this.state.token = localStorage.getItem("token");

      const response = await api.get(`/users/${this.state.userId}`);
      console.log(response);
      // Get the returned users and update the state.
      this.setState({ user: new User(response.data) });
      console.log(this.state.user.username);

      this.getGames();
      this.timer = setInterval(() => this.getGames(), 1000);

      this.getScoarboard();
      //decreas timer
      this.timerScoarboard = setInterval(() => this.getScoarboard(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
      /*this.setState({alarm: `Something went wrong while fetching the users: \n${handleError(error)}` })
      console.log(this.state.alarm)
      */
    }
  }
  async getScoarboard() {
    try {
      console.log("getting the scoarboard");
      const response = await api.get(`/users?sort_by=score.desc`);

      this.setState({ scoarboard: response.data }, () =>
        this.creatScoarboardList()
      );

      console.log(response);
    } catch (error) {
      alert(
        `Something went wrong while fetching the scoarboard: \n${handleError(
          error
        )}`
      );
    }
  }

  creatScoarboardList() {
    let list = [];
    console.log(this.state.userId);
    this.state.scoarboard.forEach((player) => {
      list.push({
        username: player.username,
        score: player.overallScore,
      });
      if (player.id === this.state.userId) {
        this.setState({ score: player.overallScore });
      }
    });
    this.setState({ scoarboardList: list }, () =>
      this.setState({ readyToRender: true })
    );
    console.log(list);
  }

  async getGames() {
    try {
      const response = await api.get(`/games`);

      // Get the returned users and update the state.
      this.setState({ games: response.data });
      if (this.state.games.length != 0) {
        for (let i = 0; i < this.state.games.length; i++) {
          if (this.state.games[i].status == "LOBBY") {
            this.setState({ selectLobby: this.state.games[i].gameId });
            break;
          }
        }
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    if (value.length > 15) {
      this.setState({ ["toLong"]: "YES" });
      this.setState({ [key]: null });
    } else {
      this.setState({ ["toLong"]: null });
      this.setState({ [key]: value });
    }
    console.log(this.state.newGame);
  }

  async creatLobby() {
    try {
      console.log("you reached CREATE LOBBY");
      const requestBody = JSON.stringify({
        name: this.state.newGame,
      });
      console.log(this.state.newGame);
      const response = await api.post("/games", requestBody);

      const game = new Game(response.data);
      console.log(game.gameId);
      //add put to add player to the lobby that we got back

      //TODO: get this to work this.props.history.push(`/lobby/host/${game.id}`);
      const requestBody2 = JSON.stringify({
        name: this.state.user.username,
        userToken: this.state.token,
      });
      console.log(requestBody2);

      const response2 = await api.post(
        `/games/${game.gameId}/players`,
        requestBody2
      );
      //const game2 = new Game(response2.data);
      localStorage.setItem("gameId", game.gameId);
      localStorage.setItem("role", "HOST");
      localStorage.setItem("Id", response.data.id);
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerScoarboard);
      this.timerScoarboard = null;
      this.props.history.push(`/lobby/${game.gameId}/host`);
    } catch (error) {
      alert(`Couldnt creat the lobby: \n${handleError(error)}`);
    }
  }

  async logout() {
    try {
      const requestBody = JSON.stringify({
        token: localStorage.getItem("token"),
      });
      // Get the returned user and update a new object.

      const response = await api.put("/logout", requestBody);

      //gets igonred
      const user = new User(response.data);

      localStorage.removeItem("token");
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerScoarboard);
      this.timerScoarboard = null;
      this.props.history.push("/login");
    } catch (error) {
      alert(`Something went wrong during logout \n${handleError(error)}`);

      //maybe take this out
      this.props.history.push("/login");
    }
  }

  selectLobby(event) {
    this.setState({ selectLobby: event.target.value });
  }

  async joinLobby() {
    try {
      console.log("you reached JOIN LOBBY");
      console.log(this.state.selectLobby);
      const requestBody = JSON.stringify({
        name: this.state.user.username,
        userToken: this.state.token,
      });
      console.log(requestBody);
      const response = await api.post(
        `/games/${this.state.selectLobby}/players`,
        requestBody
      );
      //const game = new Game(response.data);
      localStorage.setItem("gameId", this.state.selectLobby);
      localStorage.setItem("role", "GUEST");
      console.log(response);
      console.log(response.data.id);
      localStorage.setItem("Id", response.data.id);
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerScoarboard);
      this.timerScoarboard = null;
      this.props.history.push(`/lobby/${this.state.selectLobby}/guest`);
    } catch (error) {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
    }
  }

  createSelectionList = () => {
    let selectionList = [];

    if (this.state.games === undefined || this.state.games.length === 0) {
      return selectionList;
    } else {
      for (let i = 0; i < this.state.games.length; i++) {
        if (this.state.games[i].status == "LOBBY") {
          selectionList.push(
            <option value={this.state.games[i].gameId}>
              {this.state.games[i].name}
            </option>
          );
        }
      }
    }
    return selectionList;
  };

  createTable = () => {
    let table = [];
    // Outer loop to create parent
    this.state.scoarboardList.forEach((player, index) => {
      table.push(
        <tr className="scoardboard-text">
          <td>{index + 1}</td>
          <td>{player.username}</td>
          <td>{player.score}</td>
        </tr>
      );
    });
    return table;
  };

  /*<Alert variant="info" isOpen={!this.state.alarm} toggle={this.toggle.bind(this)}>
  {this.state.alarm}
  </Alert> */
  render() {
    return (
      <Container fluid>
        {!this.state.readyToRender ? (
          <div>
            <Row>
              <Col xs="5" md="3">
                <img
                  className="logoImgSmall"
                  src={logo}
                  alt="Just One Logo"
                ></img>
              </Col>
            </Row>
            <div
              class="row justify-content-center"
              style={{ marginTop: "5vw" }}
            >
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">
                Getting the data from a secure endpoint
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Row>
              <Col xs="5" md="3">
                <img
                  className="logoImgSmall"
                  src={logo}
                  alt="Just One Logo"
                ></img>
              </Col>
              <Col xs={{ span: 7 }} md={{ span: 9 }}>
                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                  >
                    Edit Profil
                  </Button>
                </Row>
                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    onClick={() => this.setState({ rules: true })}
                  >
                    Rules
                  </Button>
                </Row>
                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    onClick={() => {
                      this.logout();
                    }}
                  >
                    Logout
                  </Button>
                </Row>
              </Col>
            </Row>

            <Modal
              size="lg"
              show={this.state.rules}
              onHide={() => this.setState({ rules: false })}
              aria-labelledby="rules-dashboard"
            >
              <Modal.Header closeButton className="rules-header">
                <Modal.Title
                  id="rules-dashboard-title"
                  className="rules-header"
                >
                  Rules
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="rules-text">
                <p className="rules-text-title">Game Overview</p>
                <p className="rules-text-s-title">Choose the mystery word</p>
                <p className="rules-text">
                  The aktive player chooses a number between 1 and 5 to tel
                  which word he wants
                </p>
              </Modal.Body>
            </Modal>

            <Row>
              <Form className="DashboardForm">
                <Form.Row>
                  <p style={{ color: "red" }} hidden={!this.state.toLong}>
                    Lobbyname is to long
                  </p>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="Lobbys">
                    <Form.Control
                      placeholder="Enter a Lobbyname"
                      onChange={(e) => {
                        this.handleInputChange("newGame", e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="Lobbys">
                    <Button
                      variant="outline-light"
                      className="outlineWhite-Form"
                      disabled={!this.state.newGame}
                      onClick={() => {
                        this.creatLobby();
                      }}
                    >
                      Create Lobby
                    </Button>
                  </Form.Group>
                </Form.Row>

                <Form.Row class="row align-items-end">
                  <Form.Group as={Col} controlId="Lobbys">
                    <Form.Label style={{ fontSize: "calc(0.9em + 0.45vw)" }}>
                      Select a Lobby
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.selectLobby}
                      onChange={this.selectLobby}
                    >
                      {this.createSelectionList()}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="Lobbys">
                    <Button
                      disabled={this.state.games.length == 0}
                      variant="outline-light"
                      className="outlineWhite-Form"
                      onClick={() => {
                        this.joinLobby();
                      }}
                    >
                      Join Lobby
                    </Button>
                  </Form.Group>
                </Form.Row>
              </Form>

              <Col
                xs={{ span: 10, offset: 1 }}
                md={{ span: 5, offset: 0 }}
                lg={{ span: 5, offset: 2 }}
                className="scoarboard"
              >
                <div style={{ fontSize: "calc(1.5em + 1vw)" }}>Leaderboard</div>
                <Table striped bordered size="sm">
                  <thead class="text-white">
                    <tr>
                      <th>#</th>
                      <th>username</th>
                      <th>score</th>
                    </tr>
                  </thead>
                  <tbody>{this.createTable()}</tbody>
                </Table>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Dashboard);
