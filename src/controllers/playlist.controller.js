import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(401, "Name and description are required for playlist");
  }
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //TODO: create playlist
  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: user._id,
  });
  if (!playlist) {
    throw new ApiError(401, "Error while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Valid User Id is required");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const playlists = await Playlist.aggregate([
    {
      $match: { owner: user._id },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlists,
        "Playlists for the user fetched successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Valid Playlist Id is required");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId || !isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(
      400,
      "Valid Playlist Id and Video Id are required for the operation"
    );
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found");
  }
  const finalPlaylist = await Playlist.findByIdAndUpdate(
    playlist._id,
    { $addToSet: { videos: video._id } },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        finalPlaylist,
        "Video added to Playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId || !isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(
      400,
      "Valid Playlist Id and Video Id are required for the operation"
    );
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found");
  }
  const finalPlaylist = await Playlist.findByIdAndUpdate(
    playlist._id,
    { $pull: { videos: video._id } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        finalPlaylist,
        "Video removed from Playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Valid Playlist Id is required");
  }
  const deleted = await Playlist.findByIdAndDelete(playlistId);
  if (!deleted) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Valid Playlist Id is required");
  }
  if (!name && !description) {
    throw new ApiError(400, "No details to update Found");
  }
  let update = {};
  if (name) update.name = name;
  if (description) update.description = description;
  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: update,
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(404, "Error while updating playlist data - playlist not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Playlist details updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
