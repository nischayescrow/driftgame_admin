export interface PlayerLevelDoc {
  _id: string;
  level: number;
  xpToLevel: number;
  displayName: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}
