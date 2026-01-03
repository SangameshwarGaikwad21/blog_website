import { Router } from "express";
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../controllers/comments.controllers.js";
import { VerifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/:postId").post(VerifyJWT,createComment)
router.route("/:postId").get(getPostComments)
router.route("/update/:commentId").patch(VerifyJWT,updateComment)
router.route("/delete/:commentId").delete(VerifyJWT,deleteComment)
router.route("/like/:commentId").patch(VerifyJWT,toggleLikeComment)

export default router;
