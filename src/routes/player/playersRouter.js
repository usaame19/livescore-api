import express from 'express';
import { createPlayer, deletePlayer, getPlayerById, getPlayers, updatePlayer } from '../../controllers/players/playersController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const playersRouter = express.Router();

playersRouter.post('/create-player', authenticate,createPlayer);
playersRouter.get('/get-player/:id', getPlayerById);
playersRouter.get('/get-players', getPlayers);
playersRouter.patch('/update-player/:id', authenticate,updatePlayer);
playersRouter.delete('/delete-player/:id', authenticate,deletePlayer);


export default playersRouter;