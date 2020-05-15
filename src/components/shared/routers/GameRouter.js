import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import GiveClue from "../../GiveClue/GiveClue";
import Evalution from "../../Evalution/Evalution";
import Validation from "../../validation/Validation";
import EnterGuess from "../../game/EnterGuess";
import Score from "../../game/Score";
import Number from "../../number/Number";
import ReportWord from "../../ReportWord/ReportWord";
import {ClueGiverGuard} from "../routeProtectors/ClueGiverGuard";
import {GuesserGuard} from "../routeProtectors/GuesserGuard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/game/:id" because as been passed as a prop in the parent of GameRouter,
     * add a guard each for active player actions and clue giver actions
     *  render={() => (
            <GuesserGuard>
              
            </GuesserGuard>
          )}
          render={() => (
            <ClueGiverGuard>
              
            </ClueGiverGuard>
          )}
     */

    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/giveClue`}
          render={() => (
            <ClueGiverGuard>
              <GiveClue />
            </ClueGiverGuard>
          )}
        />
        <Route
          exact
          path={`${this.props.base}/enterGuess`}
          render={() => (
            <GuesserGuard>
              <EnterGuess />
            </GuesserGuard>
          )}
        />
        <Route
          exact
          path={`${this.props.base}/reportWord`}
          render={() => (
            <ClueGiverGuard>
              <ReportWord />
            </ClueGiverGuard>
          )}
        />
        <Route
          exact
          path={`${this.props.base}/evalution`}
          render={() => <Evalution />}
        />
        <Route
          exact
          path={`${this.props.base}/validation`}
          render={() => (
            <ClueGiverGuard>
              <Validation />
            </ClueGiverGuard>
          )}
         
        />

        <Route
          exact
          path={`${this.props.base}/number`}
          render={() => (
            <GuesserGuard>
              <Number />
            </GuesserGuard>
          )}
        />

        <Route
          exact
          path={`${this.props.base}/score`}
          render={() => <Score />}
        />
      </Container>
    );
  }
}
/*
 * Don't forget to export your component!
 */
export default GameRouter;
