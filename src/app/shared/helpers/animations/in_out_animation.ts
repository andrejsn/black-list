import { trigger, transition, style, animate } from '@angular/animations';

// cut & copy from: https://medium.com/ngconf/animating-angulars-ngif-and-ngfor-32a6ff26ed2d

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
