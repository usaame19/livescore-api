import prisma from "../../../prisma/client.js";

export const createGroup = async (req, res) => {
    try {
        const {  leagueId } = req.body;
        const name = req.body.name.toUpperCase();


        // Check if the group association already exists
        const existingGroup = await prisma.group.findFirst({
            where: {
                leagueId: leagueId,
                name: name,

            }
        });

        if (existingGroup) {
            return res.status(409).json({ message: "this group already exists in this league." });
        }

        // If not exists, create new group
        const newGroup = await prisma.group.create({
            data: {
                name,
                league: {
                    connect: {
                        id: leagueId,
                    }},
            }
        });
        return res.status(201).json(newGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        return res.status(400).send(error.message);
    }
};



export const getGroups = async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            include: {
                league: {
                    select: {
                        name: true,
                    }
                },
                teams: true

            }
        });
        if (groups.length === 0) {
            return res.status(404).json({ error: 'No groups found' });
        }

        res.json({ groups });
    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({ error: 'An error occurred while fetching groups' });
    }
};

export const getGroupById = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group) {
            return res.status(404).json({ status: false, message: "Unknown group" });
        }

        return res.json({ group });
    } catch (error) {
        console.error('Error getting group:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const name = req.body.name.toUpperCase();


        // First, fetch the current group to get its leagueId
        const currentGroup = await prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!currentGroup) {
            return res.status(404).json({ status: false, message: "Group not found" });
        }

        const leagueId = currentGroup.leagueId;

        // Check if another group in the same league already has the new name
        const existingGroup = await prisma.group.findFirst({
            where: {
                id: {
                    not: groupId, // Exclude the current group from the search
                },
                leagueId: leagueId, // Ensure it's within the same league
                name: name, // Check for the new name
            }
        });

        if (existingGroup) {
            return res.status(409).json( "Group name already exists in this league." );
        }

        // Prepare the updates
        const updates = { name };

        // Update the group in the database
        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: updates,
        });

        // Assuming the update was successful since Prisma throws if not found
        return res.status(200).json({ status: true, message: "Updated successfully", group: updatedGroup });
    } catch (error) {
        console.error('Error updating group:', error);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};



export const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await prisma.group.delete({
            where: { id: groupId },
        });

        if (!group) {
            return res.status(404).json({ status: false, message: "Unknown group" });
        }

        return res.status(200).json({ status: true, message: "Deleted Successfully" });
    } catch (error) {
        console.error('Error getting group:', error);
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
