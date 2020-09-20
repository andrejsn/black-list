import { trigger, transition, style, animate } from '@angular/animations';

export function bgColorAnimation() {
  return trigger('bgColorAnimation', [
    transition(':enter', [
      style({ backgroundColor: 'antiquewhite' }),
      animate('8s ease-out', style({ backgroundColor: 'inherits' })),
    ]),
  ]);
}
