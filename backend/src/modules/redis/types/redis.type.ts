export interface UnderMaintenanceDoc {
  clientBuildVersion: number;
  isUnderMaintainance: boolean;
  appliedAt?: number;
  removedAt?: number;
  isBroadcatedOnce: boolean;
}
