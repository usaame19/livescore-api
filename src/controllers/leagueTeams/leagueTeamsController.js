import prisma from "../../../prisma/client.js";

export const createLeagueTeam = async (req, res) => {
    try {
        const { teamId, leagueId, groupId } = req.body;

        // Check if the leagueTeam association already exists
        const existingLeagueTeam = await prisma.leagueTeam.findUnique({
            where: {
                teamId: teamId,
                leagueId: leagueId,
            }
        });

        if (existingLeagueTeam) {
            return res.status(409).json({ message: "Team and league association already exists." });
        }

        // Check if the specified group belongs to the specified league
        const group = await prisma.group.findFirst({
            where: {
                id: groupId,
                leagueId: leagueId,
            }
        });

        if (!group) {
            return res.status(404).json({ message: "Specified group does not exist in this league." });
        }

        // If the leagueTeam association does not exist, create new leagueTeam and GroupTeam association
        const newLeagueTeam = await prisma.leagueTeam.create({
            data: {
                teamId,
                leagueId,
            }
        });

        // Assuming a team can only be in one group within a league, check if GroupTeam association already exists
        const existingGroupTeam = await prisma.groupTeam.findFirst({
            where: {
                teamId: teamId,
                groupId: groupId, // Ensure the group is within the same league implicitly
            }
        });

        if (!existingGroupTeam) {
            // Create a new GroupTeam association
            await prisma.groupTeam.create({
                data: {
                    groupId,
                    teamId, // Assuming your schema supports directly associating a team with a group
                }
            });
        }

        return res.status(201).json({ message: "LeagueTeam and GroupTeam associations created successfully", leagueTeam: newLeagueTeam });
    } catch (error) {
        console.error("Error creating leagueTeam and GroupTeam associations:", error);
        return res.status(400).send(error.message);
    }
};





export const getLeagueTeams = async (req, res) => {
    try {
        const leagueTeams = await prisma.leagueTeam.findMany();
        if (leagueTeams.length === 0) {
            return res.status(404).json({ error: 'No leagueTeams found' });
        }
        res.json({ leagueTeams });
    } catch (error) {
        console.error('Error getting leagueTeams:', error);
        res.status(500).json({ error: 'An error occurred while fetching leagueTeams' });
    }
};

export const getLeagueTeamById = async (req, res) => {
    try {
        const leagueTeamId = req.params.id;
        const leagueTeam = await prisma.leagueTeam.findUnique({
            where: { id: leagueTeamId },
        });
        if (!leagueTeam) {
            return res.status(404).json({ status: false, message: "Unknown leagueTeam" });
        }

        return res.status(200).json({ status: true, message: leagueTeam });
    } catch (error) {
        console.error('Error getting leagueTeam:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};

export const updateLeagueTeam = async (req, res) => {
    try {
        const leagueTeamId = req.params.id;
        const updates = {
            name: req.body.name,
        };

        // Update the leagueTeam in the database
        const updatedLeagueTeam = await prisma.leagueTeam.update({
            where: { id: leagueTeamId },
            data: updates,
        });

        if (!updatedLeagueTeam) {
            return res.status(404).json({ status: false, message: "Unknown leagueTeam" });
        }

        return res.status(200).json({ status: true, message: "Updated successfully", leagueTeam: updatedLeagueTeam });
    } catch (error) {
        console.error('Error updating leagueTeam:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};


export const deleteLeagueTeam = async (req, res) => {
    try {
        const leagueTeamId = req.params.id;
        const leagueTeam = await prisma.leagueTeam.delete({
            where: { id: leagueTeamId },
        });

        if (!leagueTeam) {
            return res.status(404).json({ status: false, message: "Unknown leagueTeam" });
        }

        return res.status(200).json({ status: true, message: "Deleted Successfully" });
    } catch (error) {
        console.error('Error getting leagueTeam:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};


export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        // Assuming "post" model has a relation to "author" and you want to exclude the author's password
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).send({ status: false, message: "unknown post" });
        }

        return res.status(200).send({ status: true, message: post });

    } catch (err) {
        console.log("error getting post", err);
        return res.status(500).send({ status: false, message: "something went wrong" });
    }
};
