import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy = "createdAt", sortType = 1, userId } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);

  const pipeline = [];

  // Match only published videos by default
  pipeline.push({
    $match: { isPublished: true },
  });

  // Filter by search query if provided
  if (query && query.trim() !== "") {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query.trim(), $options: "i" } },
          { description: { $regex: query.trim(), $options: "i" } },
        ],
      },
    });
  }

  // Filter by userId if provided and valid
  if (userId && userId.trim() !== "") {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId format");
    }
    pipeline.push({
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    });
  }

  // Sorting logic
  const allowedSortFields = ["duration", "views", "createdAt", "updatedAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortDirection = Number(sortType) === -1 ? -1 : 1;

  pipeline.push({
    $sort: { [sortField]: sortDirection },
  });

  // Populate owner details
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    }
  );

  // Pagination
  pipeline.push(
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum }
  );

  const videos = await Video.aggregate(pipeline);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos extracted successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    console.log("i got hit");
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video

    if (!title || !description) {
      throw new ApiError(400, "Title and description are required");
    }
    const videoFilePath = req.files?.videoFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;

    if (!videoFilePath) {
      throw new ApiError(404, "Video File not Found");
    }
    if (!thumbnailPath) {
      throw new ApiError(404, "Thumbnail File not Found");
    }
    const videoFile = await uploadOnCloudinary(videoFilePath);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (!videoFile) {
      throw new ApiError(401, "Error while uploading the file");
    }
    if (!thumbnail) {
      throw new ApiError(401, "Error while uploading thumbnail");
    }
    // const owner = await User.findById(req.user?._id)
    const video = await Video.create({
      title: title,
      description: description,
      duration: videoFile.duration,
      isPublished: true,
      videoFile: videoFile.url,
      thumbNail: thumbnail.url,
      owner: req.user?._id,
    });
    if (!video) {
      throw new ApiError(401, "Error while publishing video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video published Successfully"));
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing videoId in params");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(new ApiResponse(200, video, "Video found by Id"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing videoId in params");
  }
  const { title, description } = req.body;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (title) {
    video.title = title;
  }
  if (description) {
    video.description = description;
  }
  if (req.file && req.file.path) {
    const newThumbnailPath = req.file.path;
    const newThumbnail = await uploadOnCloudinary(newThumbnailPath);
    if (!newThumbnail?.url) {
      throw new ApiError(
        400,
        "Error while uploading new thumbnail file to cloudinary"
      );
    }
    video.thumbNail = newThumbnail.url;
  }
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing videoId in params");
  }
  const deleted = await Video.findByIdAndDelete(videoId);
  if (!deleted) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing videoId in params");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video published status toggled Successfully")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
