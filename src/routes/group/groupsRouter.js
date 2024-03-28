import express from 'express';
import { createGroup, deleteGroup, getGroupById, getGroups, updateGroup } from '../../controllers/groups/groupsController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const groupsRouter = express.Router();

groupsRouter.post('/create-group', createGroup);
groupsRouter.get('/get-group/:id', getGroupById);
groupsRouter.get('/get-groups' ,getGroups);
groupsRouter.patch('/update-group/:id',updateGroup);
groupsRouter.delete('/delete-group/:id',deleteGroup);


export default groupsRouter;