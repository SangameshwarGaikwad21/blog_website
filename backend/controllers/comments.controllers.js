import { Comment } from "../models/commentsModels.js";
import { Post } from "../models/postModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (parentComment) {
        const parent = await Comment.findById(parentComment);
        if (!parent) {
        throw new ApiError(404, "Parent comment not found");
        }
    }

    const comment = await Comment.create({
        content,
        post: postId,
        owner: req.user._id,
        parentComment: parentComment || null,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const getPostComments = asyncHandler(async (req, res) => { 
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
        .populate("owner", "username avatar")
        .populate("parentComment")
        .sort({ createdAt: 1 });

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Updated content is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to edit this comment");
  }

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (
    comment.owner.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  await Comment.deleteMany({ parentComment: commentId });
  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const toggleLikeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { likesCount: comment.likes.length, liked: !isLiked },
      "Comment like status updated"
    )
  );
});


export {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
    toggleLikeComment
}