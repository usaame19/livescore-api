import express from 'express';
import { createLeagueTeam, deleteLeagueTeam, getLeagueTeamById, getLeagueTeams, updateLeagueTeam } from '../../controllers/leagueTeams/leagueTeamsController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const leagueteamsRouter = express.Router();

leagueteamsRouter.post('/create-leagueteam', authenticate,createLeagueTeam);
leagueteamsRouter.get('/get-leagueteam/:id', getLeagueTeamById);
leagueteamsRouter.get('/get-leagueteams', getLeagueTeams);
leagueteamsRouter.patch('/update-leagueteam/:id', authenticate,updateLeagueTeam);
leagueteamsRouter.delete('/delete-leagueteam/:id', authenticate,deleteLeagueTeam);


export default leagueteamsRouter;