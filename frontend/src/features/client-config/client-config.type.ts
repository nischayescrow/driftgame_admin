export interface ClientConfigDoc {
  id: string;
  clientBuildVersion: number;
  updateRequired: number;
  underMaintenance: {
    currentStatus: boolean;
    upcomingStatus: boolean;
    message: string;
  };
  createdAt: string;
  updatedAt?: string;
}
