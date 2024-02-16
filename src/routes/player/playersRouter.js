import express from 'express';
import { createPlayer, deletePlayer, getPlayerById, getPlayers, updatePlayer } from '../../controllers/players/playersController.js';

const playersRouter = express.Router();

playersRouter.post('/create-player', createPlayer);
playersRouter.get('/get-player/:id', getPlayerById);
playersRouter.get('/get-players', getPlayers);
playersRouter.patch('/update-player/:id', updatePlayer);
playersRouter.delete('/delete-player/:id', deletePlayer);


export default playersRouter;