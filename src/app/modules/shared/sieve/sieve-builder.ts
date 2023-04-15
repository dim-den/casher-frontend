import { Injectable } from '@angular/core';
import { SortValue } from './sort-value';
import { FilterValue } from './filter-value';

const MULTI_VALUE_SEPARATOR = '|';
type filterValueType = string | number | boolean;

@Injectable({
  providedIn: 'root',
})
export class SieveBuilder {
  private sortValueToString(sortValue: SortValue) {
    if (!sortValue || !sortValue.fieldName) {
      return null;
    }
    const direction = sortValue.sortDirection === 'desc' ? '-' : '';
    return `${direction}${sortValue.fieldName}`;
  }

  private getSortQueryParams(sorts: SortValue[]): string {
    if (!sorts?.length) {
      return null;
    }
    const sortValues: string[] = sorts.map((x) => this.sortValueToString(x));
    const values = sortValues.join(',');
    return values ? `sorts=${values}` : null;
  }

  private filterValueToString(filterValue: FilterValue) {
    if (!filterValue || filterValue.value === undefined) {
      return null;
    }

    if (Array.isArray(filterValue.value)) {
      filterValue.value =
        filterValue.value
          .map((x: filterValueType) => this.adjustFilterValue(x))
          .join(MULTI_VALUE_SEPARATOR) || null;
    } else {
      filterValue.value = this.adjustFilterValue(
        filterValue.value as filterValueType
      );
    }

    let valueStr = JSON.parse(JSON.stringify(filterValue.value)) as string;
    valueStr = encodeURIComponent(valueStr);
    return `${filterValue.fieldName}${filterValue.filterOperation}${valueStr}`;
  }

  private adjustFilterValue(x: filterValueType): string {
    x = x === null ? 'null' : x;
    const d = x as any as Date;
    return d instanceof Date
      ? d.toISOString()
      : this.escapeSpecialChars(x?.toString());
  }

  private getFilterQueryParams(filtersValues: FilterValue[]): string {
    const filters: string[] = filtersValues
      ? filtersValues.filter((x) => x).map((x) => this.filterValueToString(x))
      : [];
    const values = filters.join(',');
    return values ? `filters=${values}` : null;
  }

  private getPageQueryParams(pageStart: number, pageSize: number): string {
    return pageStart && pageSize
      ? `page=${pageStart}&pageSize=${pageSize}`
      : null;
  }

  getQueryParamsString(
    sorts: SortValue[] = null,
    filters: FilterValue[] = null,
    pageStart: number = null,
    pageSize: number = null
  ): string {
    const sort = this.getSortQueryParams(sorts);
    const filter = this.getFilterQueryParams(filters);
    const page = this.getPageQueryParams(pageStart, pageSize);

    if (!sort && !filter && !page) {
      return '';
    }

    return `?${[sort, filter, page].filter((x) => x).join('&')}`;
  }

  private escapeSpecialChars(s: string): string {
    return s?.replaceAll(/[,|<>]/g, '\\$&');
  }
}
