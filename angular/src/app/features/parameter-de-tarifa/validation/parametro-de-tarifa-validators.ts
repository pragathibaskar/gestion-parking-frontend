import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ParametroDeTarifaValidators {
    static numberShouldGreaterThanZero(control: AbstractControl): ValidationErrors | null {
            if (control && control.value) {
            const val = String(control.value);
            return val.charAt(0) === '0'  ? { numberShouldGreaterThanZero: true } : null;
            }
    }
}
