import prisma from "../../../../prisma/client.js";
import { validateLineUpAgainstFormation } from "../../../validators/lineUpValidator.js";

export const createMatchLineUpWithFormation = async (req, res) => {
    try {
        const { matchId, teamOneFormation, teamTwoFormation, teamOneLineUp, teamTwoLineUp } = req.body;

        // Check if the match exists
        const matchExists = await prisma.match.findUnique({ where: { id: matchId } });
        if (!matchExists) {
            return res.status(400).json({ error: 'Match not found' });
        }

        // Validate lineups
        if (!validateLineUpAgainstFormation(teamOneLineUp, teamOneFormation) || !validateLineUpAgainstFormation(teamTwoLineUp, teamTwoFormation)) {
            return res.status(400).json({ error: 'Lineup does not match the specified formation' });
        }

        // Create lineups for both teams
        await createLineUp(matchId, teamOneLineUp);
        await createLineUp(matchId, teamTwoLineUp);

        return res.status(201).json({ message: 'Lineups created successfully for both teams' });
    } catch (error) {
        console.error("Error creating match lineup with formation:", error);
        return res.status(500).send(error.message);
    }
};


export const createLineUp = async (matchId, lineUp) => {
    for (const player of lineUp) {
        await prisma.lineUp.create({
            data: {
                matchId: matchId,
                player: player.id,
                position: player.position,
                status: player.status, // Assuming status is something like "STARTER" or "SUBSTITUTE"
            }
        });
    }
};
