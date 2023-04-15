export class Pageable<T = any> {
  items: T[];
  totalCount: number;

  public static Empty<T>(): Pageable<T> {
    return { items: [], totalCount: 0 };
  }
}

export class PageableTotal<T> extends Pageable<T> {
  total?: number;

  public static Empty<T>(): PageableTotal<T> {
    return { items: [], totalCount: 0, total: 0 };
  }
}
