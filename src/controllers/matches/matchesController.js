import prisma from "../../../prisma/client.js";

// Create a Match
export const createMatch = async (req, res) => {
    try {
        const { homeId, awayId, leagueId, dateTime } = req.body;

        const newMatch = await prisma.match.create({
            data: {
                homeId,
                awayId,
                leagueId,
                dateTime: new Date(dateTime),
            }
        });
        return res.status(201).json(newMatch);
    } catch (error) {
        console.error("Error creating match:", error);
        return res.status(400).send(error.message);
    }
};

// Get All Matches
export const getMatches = async (req, res) => {
    try {
        const matches = await prisma.match.findMany({
            include: {
                teamOne: true,
                teamTwo: true,
                league: true,
            }
        });
        res.json(matches);
    } catch (error) {
        console.error('Error getting matches:', error);
        res.status(500).json({ error: 'An error occurred while fetching matches' });
    }
};

// Get Match by ID
export const getMatchById = async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                teamOne: true,
                teamTwo: true,
                league: true,
            }
        });
        if (!match) {
            return res.status(404).json({ message: "Unknown match" });
        }
        res.json(match);
    } catch (error) {
        console.error('Error getting match:', error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Update a Match
export const updateMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        const updates = req.body;
        const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: updates,
        });
        res.json(updatedMatch);
    } catch (error) {
        console.error('Error updating match:', error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Delete a Match
export const deleteMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        await prisma.match.delete({
            where: { id: matchId },
        });
        res.json({ message: "Match deleted successfully" });
    } catch (error) {
        console.error('Error deleting match:', error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
