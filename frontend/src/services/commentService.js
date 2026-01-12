import axiosInstance from "./axios";

export const getComments = async (postId) => {
  return await axiosInstance.get(`/comments/${postId}`);
};

export const addComment = async (postId, content, parentComment) => {
  return await axiosInstance.post(`/comments/${postId}`, {
    content,
    parentComment,
  });
};


export const updateComment = async (commentId, content) => {
  return await axiosInstance.patch(`/comments/${commentId}`, {
    content,
    commentId
  });
};


export const deleteComment = async (commentId) => {
  return await axiosInstance.delete(`/comments/${commentId}`);
};
