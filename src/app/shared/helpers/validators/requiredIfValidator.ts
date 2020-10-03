import { Validators } from '@angular/forms';

/**
 * makes the field required if the predicate function returns true
 *
 * NOTICE: remove Validators.required from parent form
 */
export function requiredIfValidator(predicate) {
  return (formControl => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate()) {
      return Validators.required(formControl);
    }
    return null;
  });

}
