import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signLight',
})
export class ValueSignLightningTsPipe implements PipeTransform {
  transform(value: number): string {
    switch (true) {
      case value > 0:
        return 'var(--bs-green)';
      case value < 0:
        return 'var(--bs-danger)';
      default:
        return 'none';
    }
  }
}
