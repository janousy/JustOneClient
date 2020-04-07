import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import aLobby from "../../views/aLobby";
import Game from "../shared/models/Game";
import { Spinner } from "../../views/design/Spinner";

class Dashboard extends React.Component {
  constructor() {
    super();
    /*
    var game1 = new Game();
    game1.gameId = 1;
    game1.name = "Lobby1";
    game1.status = "LOBBY";
    game1.playerList = [];
    game1.correctCards = 0;

    var game2 = new Game();
    game2.gameId = 23;
    game2.name = "Lobby2";
    game2.status = "LOBBY";
    game2.playerList = [];
    game2.correctCards = 0;
    */

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
    };
    this.selectLobby = this.selectLobby.bind(this);
  }
  /*
({data:{id: 2, name: "Jonas", usernames: null, status: "not ready"}}),
this.setState({ games: {data:{id: 2, name: "Jonas", usernames: null, status: "not ready"}}.data });
*/
  async componentDidMount() {
    try {
      this.state.userId = this.props.match.params.id;

      const response = await api.get(`/users/${this.state.userId}`);

      // Get the returned users and update the state.
      this.setState({ user: new User(response.data) });
      console.log(this.state.user.username);

      this.getGames();

      //decreas timer
      this.timer = setInterval(() => this.getGames(), 10000);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  async getGames() {
    try {
      console.log("getting the games");
      const response = await api.get(`/games`);

      // Get the returned users and update the state.
      this.setState({ games: response.data });
      console.log(this.state.games);
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
      });
      console.log(requestBody2);

      const response2 = await api.post(
        `/games/${game.gameId}/players/${this.state.userId}`,
        requestBody2
      );
      //const game2 = new Game(response2.data);

      this.props.history.push(
        `/lobby/${game.gameId}/host/${this.state.userId}`
      );
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
      const requestBody = JSON.stringify({
        name: this.state.user.username,
      });

      const response = await api.post(
        `/games/${this.state.selectLobby}/players/${this.state.userId}`,
        requestBody
      );
      //const game = new Game(response.data);

      //TODO: get this to work
      this.props.history.push(
        `/lobby/${this.state.selectLobby}/guest/${this.state.userId}`
      );
    } catch (error) {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
    }
  }

  createSelectionList = () => {
    let selectionList = [];

    console.log(this.state.games);

    for (let i = 0; i < this.state.games.length; i++) {
      selectionList.push(
        <option value={this.state.games[i].gameId}>
          {this.state.games[i].name}
        </option>
      );
    }

    return selectionList;
  };

  /*{this.state.games.map(game => {
                    return (
                        
                        <Lobby game = {game}/>
                       
                    );
                    })} */

  render() {
    return (
      <Container fluid>
        <Row>
          <Col xs="5" md="3">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs={{ span: 3, offset: 4 }} md={{ span: 2, offset: 7 }}>
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
        <Row></Row>

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
        </Row>
        <p>{this.state.selectLobby}</p>
      </Container>
    );
  }
}

export default withRouter(Dashboard);