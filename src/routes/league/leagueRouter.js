import express from 'express';
import { createLeague, deleteLeague, getLeagueById, getLeagues, updateLeague } from '../../controllers/league/leagueController.js';

const leaguesRouter = express.Router();

leaguesRouter.post('/create-league', createLeague);
leaguesRouter.get('/get-league/:id', getLeagueById);
leaguesRouter.get('/get-leagues', getLeagues);
leaguesRouter.patch('/update-league/:id', updateLeague);
leaguesRouter.delete('/delete-league/:id', deleteLeague);


export default leaguesRouter;