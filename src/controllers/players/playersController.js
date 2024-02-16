import prisma from "../../../prisma/client.js";


export const createPlayer = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const playerNumber = req.body.number;

        // Check if the player number is already taken within the same team
        const existingPlayer = await prisma.player.findFirst({
            where: {
                teamId: teamId,
                number: playerNumber
            }
        });

        if (existingPlayer) {
            return res.status(400).json({ error: 'This number is already assigned to another player in the team' });
        }

        // Check if the team exists
        const existingTeam = await prisma.team.findUnique({
            where: {
                id: teamId,
            }
        });

        if (!existingTeam) {
            return res.status(400).json({ error: 'Team not found' });
        }

        // Check if the player number is within the valid range
        if (playerNumber < 1 || playerNumber > 99) {
            return res.status(400).json({ error: 'Player number must be between 1 and 99' });
        }
        
        // Create player using Prisma
        const newPlayer = await prisma.player.create({
            data: {
                name: req.body.name,
                number: playerNumber,
                position: req.body.position,
                teamId: teamId,
            }
        });

        return res.status(201).json(newPlayer);
    } catch (error) {
        console.error("Error creating player:", error);
        return res.status(400).send(error.message);
    }
};


export const getPlayers = async (req, res) => {
    try {
            const players = await prisma.player.findMany({
                include: {
                    team:{
                        select:{
                            name: true,
                            league: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    },
                },
            });        if (players.length === 0) {
            return res.status(404).json({ error: 'No players found' });
        }
        res.json({ players });
    } catch (error) {
        console.error('Error getting players:', error);
        res.status(500).json({ error: 'An error occurred while fetching players' });
    }
};

export const getPlayerById = async (req, res) => {
    try {
        const playerId = req.params.id;
        const player = await prisma.player.findUnique({
            where: { id: playerId },
        });

        if (!player) {
            return res.status(404).json({ status: false, message: "Unknown player" });
        }

        return res.status(200).json({ status: true, message: player });
    } catch (error) {
        console.error('Error getting player:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};

export const updatePlayer = async (req, res) => {
    try {
        const playerId = req.params.id;
        const updates = {
            name: req.body.name,
            number: req.body.number,
            position: req.body.position,
            teamId: req.body.teamId,
        };

        // Update the player in the database
        const updatedPlayer = await prisma.player.update({
            where: { id: playerId },
            data: updates,
        });

        if (!updatedPlayer) {
            return res.status(404).json({ status: false, message: "Unknown player" });
        }

        return res.status(200).json({ status: true, message: "Updated successfully", player: updatedPlayer });
    } catch (error) {
        console.error('Error updating player:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};


export const deletePlayer = async (req, res) => {
    try {
        const playerId = req.params.id;
        const player = await prisma.player.delete({
            where: { id: playerId },
        });

        if (!player) {
            return res.status(404).json({ status: false, message: "Unknown player" });
        }

        return res.status(200).json({ status: true, message: "Deleted Successfully" });
    } catch (error) {
        console.error('Error getting player:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};
