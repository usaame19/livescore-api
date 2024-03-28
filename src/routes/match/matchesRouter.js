import express from 'express';
import { createMatch, deleteMatch, getMatchById, getMatches, getMatchesCompleted, getMatchesLive, getMatchesPause, getMatchesPostponed, getMatchesSchedule, updateMatch, updateScore, updateStatus } from '../../controllers/matches/matchesController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import { createMatchLineUpWithFormation } from '../../controllers/matches/lineup/lineupController.js';

const matchesRouter = express.Router();

matchesRouter.post('/create-match',createMatch);
matchesRouter.get('/get-matches', getMatches);
matchesRouter.get('/get-match/:id', getMatchById);
matchesRouter.get('/get-matches-live', getMatchesLive);
matchesRouter.get('/get-matches-schedule', getMatchesSchedule);
matchesRouter.get('/get-matches-postponed', getMatchesPostponed);
matchesRouter.get('/get-matches-completed', getMatchesCompleted);
matchesRouter.get('/get-matches-pause', getMatchesPause);
matchesRouter.patch('/update-match/:id',updateMatch);
matchesRouter.patch('/update-match-status/:id', updateStatus);
matchesRouter.patch('/update-match-score/:id', updateScore);
matchesRouter.delete('/delete-match/:id',deleteMatch);


// Match LineUp routes
matchesRouter.post('/lineup/create-lineup', createMatchLineUpWithFormation);

export default matchesRouter;