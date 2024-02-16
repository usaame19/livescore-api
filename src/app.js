import express, { json } from 'express';
import teamsRouter from './routes/team/teamsRouter.js';
import leagueRouter from './routes/league/leagueRouter.js';
import leagueteamsRouter from './routes/leagueTeams/leagueTeamsRouter.js';
import playersRouter from './routes/player/playersRouter.js';
import groupsRouter from './routes/group/groupsRouter.js';
import matchesRouter from './routes/match/matchesRouter.js';
import { createServer } from 'http';
import { initIo } from './socket.js'; // Adjust the path as necessary


const app = express();
const httpServer = createServer(app);
initIo(httpServer);



const PORT = 8000;
app.use(express.json());
app.use('/api/v1/players', playersRouter);
app.use('/api/v1/teams', teamsRouter);
app.use('/api/v1/leagues', leagueRouter);
app.use('/api/v1/leagueteams', leagueteamsRouter);
app.use('/api/v1/groups', groupsRouter);
app.use('/api/v1/matches', matchesRouter);

// 404
// app.use((req, res, next) => {
//     next(customError(404, `${req.originalUrl} the page that you're looking is not found not found`));
// });

app.use((error, req, res, next) => {

    const status = error.status || 500;
    const message = error.message || "Internal Server Error";

    res.status(status).send(message);

});



// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}!`);
// });
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
