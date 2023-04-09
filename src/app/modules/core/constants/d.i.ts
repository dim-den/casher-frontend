/* eslint-disable no-underscore-dangle */
import { Injector, Type } from '@angular/core';

export class DI {
  private static _injector: Injector;

  public static setup(i: Injector): void {
    DI._injector = i;
  }
  public static get<T>(type: Type<T>): T {
    return DI._injector.get<T>(type);
  }
}
