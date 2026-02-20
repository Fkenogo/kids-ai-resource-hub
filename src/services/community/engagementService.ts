
import { getCurrentAuthUser, resolveDataUserId } from "@/services/backend/auth";
import { toggleEngagementFromBackend } from "@/services/backend/engagement";

export const togglePostLike = async (postId: string) => {
  const user = await getCurrentAuthUser();
  if (!user) throw new Error('User not authenticated');
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) throw new Error('Unable to resolve authenticated user');
  return toggleEngagementFromBackend({
    userId: dataUserId,
    targetType: 'community_post',
    targetId: postId,
    engagementType: 'like',
  });
};
