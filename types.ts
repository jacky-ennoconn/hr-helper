export interface DrawConfig {
  allowRepeat: boolean;
  winnerCount: number;
}

export interface GroupConfig {
  groupSize: number;
}

export interface GroupResult {
  id: number;
  members: string[];
}

export enum AppTab {
  INPUT = 'INPUT',
  DRAW = 'DRAW',
  GROUPS = 'GROUPS'
}

export interface WinnerRecord {
  id: string;
  name: string;
  timestamp: Date;
}