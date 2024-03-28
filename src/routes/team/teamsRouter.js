import express from 'express';
import { addPoints, createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from '../../controllers/teams/teamsController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const teamsRouter = express.Router();

teamsRouter.post('/create-team',createTeam);
teamsRouter.get('/get-team/:id', getTeamById);
teamsRouter.get('/get-teams', getTeams);
teamsRouter.patch('/update-team/:id',updateTeam);
teamsRouter.delete('/delete-team/:id',deleteTeam);
teamsRouter.post('/add-points', addPoints);



export default teamsRouter;