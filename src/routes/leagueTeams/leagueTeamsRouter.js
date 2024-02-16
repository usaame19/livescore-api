import express from 'express';
import { createLeagueTeam, deleteLeagueTeam, getLeagueTeamById, getLeagueTeams, updateLeagueTeam } from '../../controllers/leagueTeams/leagueTeamsController.js';

const leagueteamsRouter = express.Router();

leagueteamsRouter.post('/create-leagueteam', createLeagueTeam);
leagueteamsRouter.get('/get-leagueteam/:id', getLeagueTeamById);
leagueteamsRouter.get('/get-leagueteams', getLeagueTeams);
leagueteamsRouter.patch('/update-leagueteam/:id', updateLeagueTeam);
leagueteamsRouter.delete('/delete-leagueteam/:id', deleteLeagueTeam);


export default leagueteamsRouter;