import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./index.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Comment } from "../models/comment.models.js";
import { Like } from "../models/like.models.js";
import { Playlist } from "../models/playlist.models.js";

const sampleFirstNames = [
  "John", "Alex", "Sarah", "Michael", "Emma", "David", "Emily", "James", "Sophia", "Daniel",
  "Olivia", "Matthew", "Ava", "Joseph", "Isabella", "Andrew", "Mia", "Joshua", "Abigail", "Christopher",
  "Harper", "Ethan", "Amelia", "Bernard", "Ella", "Christian", "Elizabeth", "Ryan", "Camila", "Nathan"
];

const sampleLastNames = [
  "Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
  "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
  "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis"
];

const sampleVideoTopics = [
  "Node.js & Express REST API Masterclass",
  "MongoDB Aggregation Pipelines Explained",
  "React 19 Hooks and Performance Tuning",
  "Building a Fullstack Video Streaming Platform",
  "JavaScript Async/Await vs Promises Deep Dive",
  "Docker Containerization for Backend Developers",
  "Redis Caching and Session Management in Express",
  "Cloudinary Image and Video Upload Integration",
  "JWT Authentication Best Practices & Cookie Storage",
  "System Design: Scaling YouTube Architecture",
  "Top 10 VS Code Extensions for Web Devs in 2026",
  "Tailwind CSS v4 Complete Crash Course"
];

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Video.deleteMany({}),
      Subscription.deleteMany({}),
      Tweet.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Playlist.deleteMany({})
    ]);

    console.log("Hashing default password...");
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    // 1. Create John Doe (Primary testing account)
    const johnDoeUser = await User.create({
      username: "johndoe",
      email: "johndoe@example.com",
      fullName: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
      coverImage: "https://picsum.photos/seed/johndoe-cover/1200/400",
      password: "Password@123"
    });

    console.log(`Created primary user: ${johnDoeUser.username} (${johnDoeUser._id})`);

    // 2. Create 150 dummy users
    console.log("Creating 150 dummy users...");
    const dummyUsersData = [];
    for (let i = 1; i <= 150; i++) {
      const fName = sampleFirstNames[i % sampleFirstNames.length];
      const lName = sampleLastNames[i % sampleLastNames.length];
      const username = `${fName.toLowerCase()}_${lName.toLowerCase()}_${i}`;
      
      dummyUsersData.push({
        username,
        email: `${username}@example.com`,
        fullName: `${fName} ${lName}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        coverImage: `https://picsum.photos/seed/${username}-cover/1200/400`,
        password: hashedPassword
      });
    }

    const createdDummyUsers = await User.insertMany(dummyUsersData);
    console.log(`Successfully created ${createdDummyUsers.length} dummy users.`);

    const allUsers = [johnDoeUser, ...createdDummyUsers];

    // 3. Create Subscriptions
    console.log("Generating subscriptions...");
    const subscriptionsData = [];

    // Make 135 users subscribe to John Doe
    for (let i = 0; i < 135; i++) {
      subscriptionsData.push({
        subscriber: createdDummyUsers[i]._id,
        channel: johnDoeUser._id
      });
    }

    // Make John Doe subscribe to 25 channels
    for (let i = 0; i < 25; i++) {
      subscriptionsData.push({
        subscriber: johnDoeUser._id,
        channel: createdDummyUsers[i]._id
      });
    }

    // Random subscriptions between other users
    for (let i = 0; i < 300; i++) {
      const subIdx = Math.floor(Math.random() * createdDummyUsers.length);
      const chanIdx = Math.floor(Math.random() * createdDummyUsers.length);
      if (subIdx !== chanIdx) {
        subscriptionsData.push({
          subscriber: createdDummyUsers[subIdx]._id,
          channel: createdDummyUsers[chanIdx]._id
        });
      }
    }

    await Subscription.insertMany(subscriptionsData);
    console.log(`Created ${subscriptionsData.length} subscriptions (${135} subscribers for John Doe).`);

    // 4. Discover Local Videos & Thumbnails
    console.log("Scanning public/videos and thumbnail directories for media files...");
    const videosDir = path.join(process.cwd(), "public", "videos");
    
    const possibleThumbDirs = ["thumbnail", "thumbnails", "thubmnails"];
    let thumbnailDir = "";
    let thumbnailSubPath = "thumbnail";

    for (const dirName of possibleThumbDirs) {
      const candidatePath = path.join(process.cwd(), "public", dirName);
      if (fs.existsSync(candidatePath)) {
        const files = fs.readdirSync(candidatePath).filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i));
        if (files.length > 0) {
          thumbnailDir = candidatePath;
          thumbnailSubPath = dirName;
          break;
        }
      }
    }

    if (!thumbnailDir) {
      thumbnailDir = path.join(process.cwd(), "public", "thumbnail");
    }

    const localVideoFiles = fs.existsSync(videosDir)
      ? fs.readdirSync(videosDir).filter(f => f.endsWith(".mp4"))
      : [];
    const localThumbnailFiles = fs.existsSync(thumbnailDir)
      ? fs.readdirSync(thumbnailDir).filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i))
      : [];

    console.log(`Found ${localVideoFiles.length} local videos in public/videos and ${localThumbnailFiles.length} local thumbnails in public/${thumbnailSubPath}.`);

    // 5. Create Videos from public/videos and public/${thumbnailSubPath}
    console.log("Generating video documents...");
    const videosData = [];

    const totalVideosToSeed = Math.max(localVideoFiles.length, sampleVideoTopics.length);

    for (let i = 0; i < totalVideosToSeed; i++) {
      const videoFileName = localVideoFiles[i % localVideoFiles.length];
      const thumbnailFileName = localThumbnailFiles[i % localThumbnailFiles.length];

      // Use local static route paths served by Express (app.use(express.static("public")))
      const videoUrl = videoFileName ? `/videos/${videoFileName}` : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
      const thumbnailUrl = thumbnailFileName ? `/${thumbnailSubPath}/${thumbnailFileName}` : `https://picsum.photos/seed/video-${i}/800/450`;

      const topic = sampleVideoTopics[i % sampleVideoTopics.length];

      videosData.push({
        title: topic,
        description: `In this video (${videoFileName || "Sample"}), we explore ${topic} with practical examples and source code.`,
        duration: Math.floor(Math.random() * 900) + 120, // 2m to 17m
        views: Math.floor(Math.random() * 25000) + 500,
        isPublished: true,
        videoFile: videoUrl,
        thumbNail: thumbnailUrl,
        owner: i < 8 ? johnDoeUser._id : createdDummyUsers[i % createdDummyUsers.length]._id
      });
    }

    const createdVideos = await Video.insertMany(videosData);
    console.log(`Successfully seeded ${createdVideos.length} videos from public/videos & public/${thumbnailSubPath}.`);

    // Set watch history for John Doe
    johnDoeUser.watchHistory = createdVideos.slice(0, 5).map(v => v._id);
    await johnDoeUser.save({ validateBeforeSave: false });

    // 6. Create Tweets
    console.log("Generating tweets...");
    const tweetsData = [];
    tweetsData.push({
      content: "Hello world! Welcome to StreamIt, the high performance video streaming platform! 🚀",
      owner: johnDoeUser._id
    });
    tweetsData.push({
      content: "Just uploaded a brand new Node.js & Express REST API tutorial series!",
      owner: johnDoeUser._id
    });

    for (let i = 0; i < 30; i++) {
      const user = createdDummyUsers[i % createdDummyUsers.length];
      tweetsData.push({
        content: `Excited about ${sampleVideoTopics[i % sampleVideoTopics.length]}! Great stuff.`,
        owner: user._id
      });
    }

    const createdTweets = await Tweet.insertMany(tweetsData);
    console.log(`Created ${createdTweets.length} tweets.`);

    // 7. Create Comments
    console.log("Generating comments...");
    const commentsData = [];
    const sampleComments = [
      "Awesome tutorial! Clear and concise.",
      "Thanks for sharing this, helped me fix a bug in my project.",
      "Can you make a follow up video on deployment?",
      "Loved the section on aggregation pipelines!",
      "Super clean code structure!",
      "Subscribed! Looking forward to more content."
    ];

    for (const video of createdVideos) {
      for (let i = 0; i < 4; i++) {
        const commenter = allUsers[Math.floor(Math.random() * allUsers.length)];
        commentsData.push({
          content: sampleComments[i % sampleComments.length],
          video: video._id,
          owner: commenter._id
        });
      }
    }

    const createdComments = await Comment.insertMany(commentsData);
    console.log(`Created ${createdComments.length} comments.`);

    // 8. Create Likes
    console.log("Generating likes...");
    const likesData = [];

    // Likes on videos
    for (const video of createdVideos) {
      for (let i = 0; i < 15; i++) {
        const liker = allUsers[Math.floor(Math.random() * allUsers.length)];
        likesData.push({
          video: video._id,
          likedBy: liker._id
        });
      }
    }

    // Likes on comments
    for (let i = 0; i < 20; i++) {
      const comment = createdComments[i];
      const liker = allUsers[Math.floor(Math.random() * allUsers.length)];
      likesData.push({
        comment: comment._id,
        likedBy: liker._id
      });
    }

    // Likes on tweets
    for (const tweet of createdTweets) {
      const liker = allUsers[Math.floor(Math.random() * allUsers.length)];
      likesData.push({
        tweet: tweet._id,
        likedBy: liker._id
      });
    }

    await Like.insertMany(likesData);
    console.log(`Created ${likesData.length} likes.`);

    // 9. Create Playlists
    console.log("Generating playlists...");
    const playlistsData = [
      {
        name: "Fullstack Web Development",
        description: "Curated collection of videos covering MERN stack development.",
        videos: createdVideos.slice(0, 4).map(v => v._id),
        owner: johnDoeUser._id
      },
      {
        name: "Backend Architecture & DevOps",
        description: "Best tutorials on Docker, Redis, MongoDB and Node.js.",
        videos: createdVideos.slice(4, 8).map(v => v._id),
        owner: johnDoeUser._id
      }
    ];

    await Playlist.insertMany(playlistsData);
    console.log(`Created ${playlistsData.length} playlists.`);

    console.log("\n=======================================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉");
    console.log("=======================================================");
    console.log(`Primary User Username: johndoe`);
    console.log(`Primary User Email:    johndoe@example.com`);
    console.log(`Primary User Password: Password@123`);
    console.log(`John Doe Subscribers:  135 subscribers`);
    console.log(`Total Users Created:   151 users`);
    console.log(`Total Videos Seeded:   ${createdVideos.length} (from public/videos & public/thumbnail)`);
    console.log(`Total Subscriptions:   ${subscriptionsData.length}`);
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
