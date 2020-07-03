import { trigger, transition, style, animate } from '@angular/animations';

export function inOutAnimation() {
  return trigger(
    'inOutAnimation',
    [
      transition(
        ':enter',
        [
          style({ height: 0, opacity: 0 }),
          animate('250ms ease-out', style({ height: 300, opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          style({ height: 300, opacity: 1 }),
          animate('250ms ease-in', style({ height: 0, opacity: 0 }))
        ]
      )
    ]
  )
}
