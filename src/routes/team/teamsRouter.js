import express from 'express';
import { createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from '../../controllers/teams/teamsController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const teamsRouter = express.Router();

teamsRouter.post('/create-team', authenticate,createTeam);
teamsRouter.get('/get-team/:id', getTeamById);
teamsRouter.get('/get-teams', getTeams);
teamsRouter.patch('/update-team/:id', authenticate,updateTeam);
teamsRouter.delete('/delete-team/:id', authenticate,deleteTeam);


export default teamsRouter;