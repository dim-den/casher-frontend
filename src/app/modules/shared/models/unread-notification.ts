import { BaseModel } from './base-model';

export interface UnreadNotification {
  Id: number;
  Title: string;
  Message: string;
  InsertDt: Date;
}
