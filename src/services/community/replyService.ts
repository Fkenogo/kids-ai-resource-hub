
import {
  createCommunityReplyFromBackend,
  getCommunityRepliesFromBackend,
} from "@/services/backend/community";

export const getCommunityReplies = async (postId: string) => {
  return getCommunityRepliesFromBackend(postId);
};

export const createCommunityReply = async (reply: {
  postId: string;
  content: string;
  parentReplyId?: string;
}) => {
  return createCommunityReplyFromBackend(reply);
};
