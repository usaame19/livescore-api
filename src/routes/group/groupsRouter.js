import express from 'express';
import { createGroup, deleteGroup, getGroupById, getGroups, updateGroup } from '../../controllers/groups/groupsController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const groupsRouter = express.Router();

groupsRouter.post('/create-group', authenticate, createGroup);
groupsRouter.get('/get-group/:id', getGroupById);
groupsRouter.get('/get-groups' ,getGroups);
groupsRouter.patch('/update-group/:id', authenticate,updateGroup);
groupsRouter.delete('/delete-group/:id', authenticate,deleteGroup);


export default groupsRouter;