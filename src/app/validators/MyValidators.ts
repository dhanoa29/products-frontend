import { FormControl, ValidationErrors } from '@angular/forms';

export class MyValidators {
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
    if (control.value !== null && control.value.trim().length === 0) {
      return { whiteSpaceOnly: true };
    }
    //If Valid, return null
    return null;
  }
}
