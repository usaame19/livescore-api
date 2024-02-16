import prisma from "../../../prisma/client.js";
import { getIo } from "../../socket.js"; // Adjust the path as necessary

export const createLeague = async (req, res) => {
  const { name, season, year, startDate, endDate } = req.body;

  // Check for missing or empty fields
  if (!name || !season || !year || !startDate || !endDate) {
    return res
      .status(400)
      .json({
        message:
          "Please provide all required fields: name, season, year, startDate, endDate.",
      });
  }

  try {
    // If all fields are provided, proceed to create the league
    const newLeague = await prisma.league.create({
      data: {
        name: name,
        season: season,
        year: year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    const io = getIo(); 
    console.log('Emitting leagueUpdated event');
    io.emit("leagueAdded", newLeague);
    return res.status(201).json(newLeague);
  } catch (error) {
    console.error("Error creating league:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getLeagues = async (req, res) => {
  try {
    const leagues = await prisma.league.findMany({
      include: {
        teams: true,
        matches: true,
        groups: {
          select: {
            name: true,
            id: true,
            teams: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (leagues.length === 0) {
      return res.status(404).json({ error: "No leagues found" });
    }
    res.json({ leagues });
  } catch (error) {
    console.error("Error getting leagues:", error);
    res.status(500).json({ error: "An error occurred while fetching leagues" });
  }
};

export const getLeagueById = async (req, res) => {
  try {
    const leagueId = req.params.id;
    const league = await prisma.league.findUnique({
      where: { id: leagueId },
    });

    if (!league) {
      return res.status(404).json({ status: false, message: "Unknown league" });
    }

    return  res.json( league );
  } catch (error) {
    console.error("Error getting league:", error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
};

export const updateLeague = async (req, res) => {
  try {
    const leagueId = req.params.id;
    const updates = {
      name: req.body.name,
      season: req.body.season,
      year: req.body.year,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };

    // Update the league in the database
    const updatedLeague = await prisma.league.update({
      where: { id: leagueId },
      data: updates,
    });

    if (!updatedLeague) {
      return res.status(404).json({ status: false, message: "Unknown league" });
    }

    return res.status(200).json({
      status: true,
      message: "Updated successfully",
      league: updatedLeague,
    });
  } catch (error) {
    console.error("Error updating league:", error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
};

export const deleteLeague = async (req, res) => {
  const leagueId = req.params.id;
  try {
    // Optional: Check if the league exists before attempting deletion
    const existingLeague = await prisma.league.findUnique({
      where: { id: leagueId },
    });
    if (!existingLeague) {
      return res
        .status(404)
        .json({ status: false, message: "League not found" });
    }

    // Delete or update related Group records here
    // For example, delete all groups related to this league
    await prisma.group.deleteMany({
      where: { leagueId: leagueId },
    });

    // Now, delete the league
    await prisma.league.delete({
      where: { id: leagueId },
    });

    return res
      .status(200)
      .json({ status: true, message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting league:", error);
    if (error.code === "P2014") {
      return res
        .status(400)
        .json({
          status: false,
          message:
            "Cannot delete league because it is referenced by other records.",
        });
    }
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
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
    return res
      .status(500)
      .send({ status: false, message: "something went wrong" });
  }
};
