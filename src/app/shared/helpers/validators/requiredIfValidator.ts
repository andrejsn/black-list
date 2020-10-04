import { Validators } from '@angular/forms';

/**
 * makes the field required if the predicate function returns true
 * cut & copy from:
 * https://medium.com/ngx/3-ways-to-implement-conditional-validation-of-reactive-forms-c59ed6fc3325
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
