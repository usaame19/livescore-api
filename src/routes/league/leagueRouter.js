import express from 'express';
import { createLeague, deleteLeague, getLeagueById, getLeagues, updateLeague } from '../../controllers/league/leagueController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';


const leaguesRouter = express.Router();

leaguesRouter.post('/create-league', authenticate,createLeague);
leaguesRouter.get('/get-league/:id', getLeagueById);
leaguesRouter.get('/get-leagues', getLeagues);
leaguesRouter.patch('/update-league/:id', authenticate,updateLeague);
leaguesRouter.delete('/delete-league/:id', authenticate,deleteLeague);


export default leaguesRouter;