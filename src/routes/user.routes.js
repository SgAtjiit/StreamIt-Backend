import { Router } from "express";
import { loginUser, registerUser,logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserDetails, updateUserAvatar, updateUserCoverImage } from "../contollers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const  router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refreshUser").post(verifyJWT,refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/getUser").post(verifyJWT,getCurrentUser)
router.route("/updateUserDetails").post(verifyJWT,updateUserDetails)
router.route("/updateAvatar").post(verifyJWT,updateUserAvatar)
router.route("/updateUserCoverImage").post(verifyJWT,updateUserCoverImage)
export default router