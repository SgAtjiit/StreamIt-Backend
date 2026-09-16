export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "StreamIt Backend API Documentation",
    version: "1.0.0",
    description: "Interactive Swagger UI for testing all REST API endpoints of the StreamIt video streaming platform.\n\n### 🔑 Quick Authorization Instructions\n1. Go to **Users > POST /users/login** and click **Try it out** -> **Execute** (Default credentials `johndoe` / `Password@123` are pre-filled).\n2. Copy the `accessToken` from the response.\n3. Click the **Authorize 🔓** button at the top right, paste your token, and click **Authorize**.\n4. All protected endpoints are now ready to test with pre-loaded sample parameters!",
    contact: {
      name: "StreamIt Developer Team"
    }
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",
      description: "Local Server (Port 8000)"
    },
    {
      url: "http://localhost:3000/api/v1",
      description: "Local Server (Port 3000)"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your Bearer accessToken obtained from /users/login"
      }
    }
  },
  tags: [
    { name: "Healthcheck", description: "API server health check endpoints" },
    { name: "Users", description: "User registration, authentication, profile & watch history" },
    { name: "Videos", description: "Video publishing, details, list & status management" },
    { name: "Tweets", description: "User community tweets" },
    { name: "Comments", description: "Video commenting system" },
    { name: "Likes", description: "Video, comment & tweet liking system" },
    { name: "Playlists", description: "Video playlist management" },
    { name: "Subscriptions", description: "Channel subscription management" },
    { name: "Dashboard", description: "Creator dashboard stats & analytics" }
  ],
  paths: {
    "/healthcheck": {
      get: {
        tags: ["Healthcheck"],
        summary: "Check server health status",
        responses: {
          "200": { description: "Server is running fine" }
        }
      }
    },
    "/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["fullName", "email", "username", "password", "avatar"],
                properties: {
                  fullName: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "newuser@example.com" },
                  username: { type: "string", example: "newuser" },
                  password: { type: "string", example: "Password@123" },
                  avatar: { type: "string", format: "binary", description: "Avatar image file" },
                  coverImage: { type: "string", format: "binary", description: "Optional cover image file" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered successfully!!" },
          "400": { description: "Missing required fields or image files" },
          "409": { description: "User with email or username exists!!" }
        }
      }
    },
    "/users/login": {
      post: {
        tags: ["Users"],
        summary: "Log in user (Pre-filled credentials)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["password"],
                properties: {
                  username: { type: "string", example: "johndoe" },
                  email: { type: "string", example: "johndoe@example.com" },
                  password: { type: "string", example: "Password@123" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User logged in successfully" },
          "400": { description: "Invalid credentials" }
        }
      }
    },
    "/users/logout": {
      post: {
        tags: ["Users"],
        summary: "Log out current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User logged out" }
        }
      }
    },
    "/users/refreshUser": {
      post: {
        tags: ["Users"],
        summary: "Refresh access token",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  refreshToken: { type: "string", example: "YOUR_REFRESH_TOKEN_HERE" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Access token refreshed!" }
        }
      }
    },
    "/users/changePassword": {
      post: {
        tags: ["Users"],
        summary: "Change user password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string", example: "Password@123" },
                  newPassword: { type: "string", example: "NewPassword@123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Password changed successfully" }
        }
      }
    },
    "/users/getCurrentUser": {
      post: {
        tags: ["Users"],
        summary: "Get current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Extracted User successfully" }
        }
      }
    },
    "/users/updateUserDetails": {
      patch: {
        tags: ["Users"],
        summary: "Update user account details",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string", example: "Johnathan Doe" },
                  email: { type: "string", example: "johnathan.doe@example.com" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "User Detail Updated successfully" }
        }
      }
    },
    "/users/updateAvatar": {
      patch: {
        tags: ["Users"],
        summary: "Update user avatar image",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["avatar"],
                properties: {
                  avatar: { type: "string", format: "binary", description: "Avatar image file" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Avatar updated Successfully" }
        }
      }
    },
    "/users/updateUserCoverImage": {
      patch: {
        tags: ["Users"],
        summary: "Update user cover image",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["coverImage"],
                properties: {
                  coverImage: { type: "string", format: "binary", description: "Cover image file" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Cover Image updated Successfully" }
        }
      }
    },
    "/users/channel/{username}": {
      get: {
        tags: ["Users"],
        summary: "Get user channel profile by username",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string", example: "johndoe" }
          }
        ],
        responses: {
          "200": { description: "User channel Fetched Successfully" }
        }
      }
    },
    "/users/getWatchHistory": {
      get: {
        tags: ["Users"],
        summary: "Get logged-in user watch history",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Watch History Fetched Successfully" }
        }
      }
    },
    "/videos/getAllVideos": {
      get: {
        tags: ["Videos"],
        summary: "Get all published videos with optional filters & pagination",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", example: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
          { name: "query", in: "query", schema: { type: "string", example: "" }, description: "Optional search query" },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "duration", "views", "updatedAt"], example: "createdAt" } },
          { name: "sortType", in: "query", schema: { type: "integer", enum: [1, -1], example: 1 } },
          { name: "userId", in: "query", schema: { type: "string", example: "" }, description: "Optional channel user ID" }
        ],
        responses: {
          "200": { description: "Videos extracted successfully" }
        }
      }
    },
    "/videos/publishAVideo": {
      post: {
        tags: ["Videos"],
        summary: "Publish a new video",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "videoFile", "thumbnail"],
                properties: {
                  title: { type: "string", example: "Introduction to Node.js & Express REST APIs" },
                  description: { type: "string", example: "Comprehensive guide to building REST APIs with Express and MongoDB." },
                  videoFile: { type: "string", format: "binary", description: "Video media file" },
                  thumbnail: { type: "string", format: "binary", description: "Thumbnail image file" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Video published Successfully" }
        }
      }
    },
    "/videos/video/{videoId}": {
      get: {
        tags: ["Videos"],
        summary: "Get video by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } }
        ],
        responses: {
          "200": { description: "Video found by Id" }
        }
      },
      patch: {
        tags: ["Videos"],
        summary: "Update video details",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } }
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Updated Masterclass Video Title" },
                  description: { type: "string", example: "Updated description content." },
                  thumbnail: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Video details updated successfully" }
        }
      },
      delete: {
        tags: ["Videos"],
        summary: "Delete a video",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } }
        ],
        responses: {
          "200": { description: "Video deleted Successfully" }
        }
      }
    },
    "/videos/toggle/publish/{videoId}": {
      patch: {
        tags: ["Videos"],
        summary: "Toggle publish status of video",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } }
        ],
        responses: {
          "200": { description: "Video published status toggled Successfully" }
        }
      }
    },
    "/tweets": {
      post: {
        tags: ["Tweets"],
        summary: "Create a tweet",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string", example: "Just launched my new video streaming backend! 🚀 #express #nodejs" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Tweet created successfully" }
        }
      }
    },
    "/tweets/user/{userId}": {
      get: {
        tags: ["Tweets"],
        summary: "Get user tweets",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ebe8" } }
        ],
        responses: {
          "200": { description: "Tweets for user fetched successfully" }
        }
      }
    },
    "/tweets/{tweetId}": {
      patch: {
        tags: ["Tweets"],
        summary: "Update a tweet",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "tweetId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee5d" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string", example: "Updated tweet content! Excited for major releases. 🎉" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Tweet updated successfully" }
        }
      },
      delete: {
        tags: ["Tweets"],
        summary: "Delete a tweet",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "tweetId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee5d" } }
        ],
        responses: {
          "200": { description: "Tweet deleted successfully" }
        }
      }
    },
    "/comments/{videoId}": {
      get: {
        tags: ["Comments"],
        summary: "Get video comments (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } },
          { name: "page", in: "query", schema: { type: "integer", example: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } }
        ],
        responses: {
          "200": { description: "Comments for video fetched successfully" }
        }
      },
      post: {
        tags: ["Comments"],
        summary: "Add a comment to video",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string", example: "Great video explanation! Very clear and helpful." }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Comment added to video successfully" }
        }
      }
    },
    "/comments/c/{commentId}": {
      patch: {
        tags: ["Comments"],
        summary: "Update comment content",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "commentId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee7e" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string", example: "Edited: Thanks for answering my question in the video!" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Comment updated successfully" }
        }
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "commentId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee7e" } }
        ],
        responses: {
          "200": { description: "Comment Deleted Successfully" }
        }
      }
    },
    "/likes/toggle/v/{videoId}": {
      post: {
        tags: ["Likes"],
        summary: "Toggle video like",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } }
        ],
        responses: {
          "200": { description: "Like toggled for video successfully" }
        }
      }
    },
    "/likes/toggle/c/{commentId}": {
      post: {
        tags: ["Likes"],
        summary: "Toggle comment like",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "commentId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee7e" } }
        ],
        responses: {
          "200": { description: "Like toggled for comment successfully" }
        }
      }
    },
    "/likes/toggle/t/{tweetId}": {
      post: {
        tags: ["Likes"],
        summary: "Toggle tweet like",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "tweetId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee5d" } }
        ],
        responses: {
          "200": { description: "Like toggled for tweet successfully" }
        }
      }
    },
    "/likes/videos": {
      get: {
        tags: ["Likes"],
        summary: "Get user liked videos",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Liked videos for user fetched successfully" }
        }
      }
    },
    "/playlists": {
      post: {
        tags: ["Playlists"],
        summary: "Create a playlist",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description"],
                properties: {
                  name: { type: "string", example: "Fullstack MERN Tutorial" },
                  description: { type: "string", example: "Step by step video series on building MERN applications." }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Playlist created successfully" }
        }
      }
    },
    "/playlists/user/{userId}": {
      get: {
        tags: ["Playlists"],
        summary: "Get playlists owned by a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ebe8" } }
        ],
        responses: {
          "200": { description: "Playlists for the user fetched successfully" }
        }
      }
    },
    "/playlists/{playlistId}": {
      get: {
        tags: ["Playlists"],
        summary: "Get playlist by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "playlistId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571efd1" } }
        ],
        responses: {
          "200": { description: "Playlist fetched successfully" }
        }
      },
      patch: {
        tags: ["Playlists"],
        summary: "Update playlist name/description",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "playlistId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571efd1" } }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Updated Playlist Title" },
                  description: { type: "string", example: "Updated playlist description content." }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Playlist details updated successfully" }
        }
      },
      delete: {
        tags: ["Playlists"],
        summary: "Delete a playlist",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "playlistId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571efd1" } }
        ],
        responses: {
          "200": { description: "Playlist deleted successfully" }
        }
      }
    },
    "/playlists/add/{videoId}/{playlistId}": {
      patch: {
        tags: ["Playlists"],
        summary: "Add video to playlist",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } },
          { name: "playlistId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571efd1" } }
        ],
        responses: {
          "200": { description: "Video added to Playlist successfully" }
        }
      }
    },
    "/playlists/remove/{videoId}/{playlistId}": {
      patch: {
        tags: ["Playlists"],
        summary: "Remove video from playlist",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "videoId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ee4c" } },
          { name: "playlistId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571efd1" } }
        ],
        responses: {
          "200": { description: "Video removed from Playlist successfully" }
        }
      }
    },
    "/subscriptions/c/{channelId}": {
      get: {
        tags: ["Subscriptions"],
        summary: "Get subscribed channels for user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "channelId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ebe8" } }
        ],
        responses: {
          "200": { description: "Subscribed channels list extracted successfully" }
        }
      },
      post: {
        tags: ["Subscriptions"],
        summary: "Toggle subscription to a channel",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "channelId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ebe8" } }
        ],
        responses: {
          "200": { description: "Subscription toggled successfully" }
        }
      }
    },
    "/subscriptions/u/{subscriberId}": {
      get: {
        tags: ["Subscriptions"],
        summary: "Get subscriber list for a channel",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "subscriberId", in: "path", required: true, schema: { type: "string", example: "6aaad1897c10b3803571ebe8" } }
        ],
        responses: {
          "200": { description: "Channel subscriber list fetched successfully" }
        }
      }
    },
    "/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Get channel stats (views, videos, subscribers, likes)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Channel stats fetched successfully" }
        }
      }
    },
    "/dashboard/videos": {
      get: {
        tags: ["Dashboard"],
        summary: "Get channel videos for dashboard",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", example: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } }
        ],
        responses: {
          "200": { description: "Channel videos fetched successfully" }
        }
      }
    }
  }
};
