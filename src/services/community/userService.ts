
import { getCommunityUsersFromBackend, getLeaderboardFromBackend } from "@/services/backend/community";

export const getCommunityUsers = async () => {
  return getCommunityUsersFromBackend();
};

export const getLeaderboard = async (limit = 10) => {
  return getLeaderboardFromBackend(limit);
};
