import express from 'express';
import { createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from '../../controllers/teams/teamsController.js';

const teamsRouter = express.Router();

teamsRouter.post('/create-team', createTeam);
teamsRouter.get('/get-team/:id', getTeamById);
teamsRouter.get('/get-teams', getTeams);
teamsRouter.patch('/update-team/:id', updateTeam);
teamsRouter.delete('/delete-team/:id', deleteTeam);


export default teamsRouter;