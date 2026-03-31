import { LeaderboardDocument } from '../schemas/leaderboard.schema';

export type GlobalLeaderboardDoc = Partial<LeaderboardDocument> & {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  picture?: string;
};
