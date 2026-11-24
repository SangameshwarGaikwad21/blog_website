import { Router } from "express";
import { createPost, deletePost, getAllPost, getMyBlogs, getSinglePost, updatePost } from "../controllers/post.controllers.js";
import {  isAdmin, VerifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();

// Protected routes
router.route("/")
  .get(VerifyJWT, getAllPost);

router.route("/my-blogs")
  .get(VerifyJWT, getMyBlogs);

router.route("/createPost")
  .post(
    VerifyJWT,
    upload.single("thumbnail"),
    createPost
  );

router.route("/:postId")
  .get(VerifyJWT, getSinglePost)
  .patch(VerifyJWT, updatePost)
  .delete(VerifyJWT, deletePost);

export default router;
