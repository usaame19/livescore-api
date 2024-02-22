import express from 'express';
import { createMatch, deleteMatch, getMatchById, getMatches, getMatchesCompleted, getMatchesLive, getMatchesPause, getMatchesPostponed, getMatchesSchedule, updateMatch, updateStatus } from '../../controllers/matches/matchesController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const matchesRouter = express.Router();

matchesRouter.post('/create-match', authenticate,createMatch);
matchesRouter.get('/get-matches', getMatches);
matchesRouter.get('/get-match/:id', getMatchById);
matchesRouter.get('/get-matches-live', getMatchesLive);
matchesRouter.get('/get-matches-schedule', getMatchesSchedule);
matchesRouter.get('/get-matches-postponed', getMatchesPostponed);
matchesRouter.get('/get-matches-completed', getMatchesCompleted);
matchesRouter.get('/get-matches-pause', getMatchesPause);
matchesRouter.patch('/update-match/:id', authenticate,updateMatch);
matchesRouter.patch('/update-match-event/:id', authenticate, updateStatus);
matchesRouter.delete('/delete-match/:id', authenticate,deleteMatch);


export default matchesRouter;