import { SortDirection } from '@angular/material/sort';

export interface SortValue {
  fieldName: string;
  sortDirection?: SortDirection;
}
export abstract class SortValue {
  public static asc(fieldName: string): SortValue {
    return {
      fieldName,
      sortDirection: 'asc',
    };
  }
  public static desc(fieldName: string): SortValue {
    return {
      fieldName,
      sortDirection: 'desc',
    };
  }
}
