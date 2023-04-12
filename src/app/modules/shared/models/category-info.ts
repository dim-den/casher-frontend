import { BaseModel } from './base-model';
import { ETransactionType } from '../enums/etransaction-type';

export interface CategoryInfo extends BaseModel {
  name: string;
  type: ETransactionType;
}
