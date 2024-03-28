import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client.js";


export const createTeam = async (req, res) => {
    try {
        const { name, leagueId, groupId } = req.body;

        // Check if team name already exists in the league
        const existingTeam = await prisma.team.findFirst({
            where: {
                name,
                leagueId,
            },
        });

        if (existingTeam) {
            return res.status(400).json({ error: "Team name already exists in this league" });
        }

        // Validate if the group belongs to the league
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.leagueId !== leagueId) {
            return res.status(400).json({ error: "Selected group does not belong to the specified league" });
        }

        // Create team using Prisma
        const newTeam = await prisma.team.create({
            data: {
                name,
                group: {
                    connect: {
                        id: groupId,
                    },
                },
                league: {
                    connect: {
                        id: leagueId,
                    },
                },
            },
        });

        return res.status(201).json(newTeam);
    } catch (error) {
        console.error("Error creating team:", error);
        return res.status(400).send(error.message);
    }
};
   
export const getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        league: {
          select: {
            name: true,
          },
        },
        group: {
          select: {
            name: true,
          },
        },
        players: true,
        home: true,
        away: true,
      },
    });

    if (teams.length === 0) {
      return res.status(404).json({ error: "No teams found" });
    }

    // Optionally process teams to handle null leagues
    const processedTeams = teams.map((team) => ({
      ...team,
      league: team.league ? team.league.name : "No League", // Handle null leagues
      group: team.group ? team.group.name : "No Group", // Similarly for groups if necessary
      points: team.points || 0, // Include points with a default value of 0 if not present
      // Adjust players and matches as needed
    }));

    res.json({ teams: processedTeams });
  } catch (error) {
    console.error("Error getting teams:", error);
    // Log more detailed error information if available
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known request errors specifically
      console.error("Detailed error info:", error.message, error.meta);
    }
    res
      .status(500)
      .json({
        error: "An error occurred while fetching teams",
        details: error.message,
      });
  }
};


export const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        league: {
          select: {
            name: true,
          },
        },
        group: {
            select: {
                name: true,
            }
        },
        players: true,
        home: true,
        away: true,
      },
    });

    if (!team) {
      return res.status(404).json({ status: false, message: "Unknown team" });
    }

    return res.json({ team });
  } catch (error) {
    console.error("Error getting team:", error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const updates = {
      name: req.body.name,
        leagueId: req.body.leagueId,
        groupId: req.body.groupId,
    };

    // Update the team in the database
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: updates,
    });

    if (!updatedTeam) {
      return res.status(404).json({ status: false, message: "Unknown team" });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "Updated successfully",
        team: updatedTeam,
      });
  } catch (error) {
    console.error("Error updating team:", error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await prisma.team.delete({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ status: false, message: "Unknown team" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error getting team:", error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
};



// Create or update points for a team manually
export const addPoints = async (req, res) => {
  try {
    const { teamId, points } = req.body;

    // Update the team in the database
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        points: {
          increment: points // Increment the current points by the provided value
        }
      },
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error("Error creating or updating team points:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



// Get points for all teams
export const getTeamPoints = async (req, res) => {
  try {
    const teamPoints = await prisma.team.findMany({
      include: { team: true },
    });
    res.json(teamPoints);
  } catch (error) {
    console.error("Error getting team points:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Get points for a specific team
export const getTeamPointsById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const teamPoints = await prisma.team.findUnique({
      where: { teamId },
      include: { team: true },
    });
    if (!teamPoints) {
      return res.status(404).json({ message: "Team points not found" });
    }
    res.json(teamPoints);
  } catch (error) {
    console.error("Error getting team points:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
