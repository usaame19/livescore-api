import express from 'express';
import { createMatch, deleteMatch, getMatchById, getMatches, updateMatch } from '../../controllers/matches/matchesController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const matchesRouter = express.Router();

matchesRouter.post('/create-match', authenticate,createMatch);
matchesRouter.get('/get-match/:id', getMatchById);
matchesRouter.get('/get-matches', getMatches);
matchesRouter.patch('/update-match/:id', authenticate,updateMatch);
matchesRouter.delete('/delete-match/:id', authenticate,deleteMatch);


export default matchesRouter;