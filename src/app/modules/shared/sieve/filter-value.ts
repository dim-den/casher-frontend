import { EFilterOperation } from './efilter-operation';

export type FilterValueType =
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | boolean[];

export interface FilterValue<V extends FilterValueType = FilterValueType> {
  fieldName: string;
  filterOperation: EFilterOperation;
  value: V;
}

export abstract class FilterValue {
  public static equals(fieldName: string, value: FilterValueType): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.Equals,
      value,
    };
  }
  public static notEquals(
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.NotEquals,
      value,
    };
  }
  public static contains(
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.Contains,
      value,
    };
  }
  public static greaterThan(
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.GreaterThan,
      value,
    };
  }
  public static build(
    filterOperation: EFilterOperation,
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation,
      value,
    };
  }

  public static greaterThanOrEqual(
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.GreaterThanOrEqual,
      value,
    };
  }

  public static lessThanOrEqual(
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.LessThanOrEqual,
      value,
    };
  }
  public static startsWith(
    fieldName: string,
    value: FilterValueType
  ): FilterValue {
    return {
      fieldName,
      filterOperation: EFilterOperation.StartsWith,
      value,
    };
  }
}
