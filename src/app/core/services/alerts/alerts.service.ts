import { Injectable } from '@angular/core';
import { SnackBarService } from '../snackBar/snackService.service';

@Injectable()
export class AlertsService {
  constructor(public snackBarService: SnackBarService) {}

  success(message: string, duration?: number ) {
    this.snackBarService.openSnack(message, duration ? duration : 2000, 'green');
  }

  danger(message: string, duration?: number ) {
    this.snackBarService.openSnack(message, duration ? duration : 2000, 'red');
  }

  warning(message: string, duration?: number ) {
    this.snackBarService.openSnack(message, duration ? duration : 2000, 'orange');
  }

  info(message: string, duration?: number ) {
    this.snackBarService.openSnack(message, duration ? duration : 2000, 'light-blue');
  }
}
