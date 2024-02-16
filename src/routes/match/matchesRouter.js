import express from 'express';
import { createMatch, deleteMatch, getMatchById, getMatches, updateMatch } from '../../controllers/matches/matchesController.js';

const matchesRouter = express.Router();

matchesRouter.post('/create-match', createMatch);
matchesRouter.get('/get-match/:id', getMatchById);
matchesRouter.get('/get-matches', getMatches);
matchesRouter.patch('/update-match/:id', updateMatch);
matchesRouter.delete('/delete-match/:id', deleteMatch);


export default matchesRouter;