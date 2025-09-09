import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly snackBar = inject(MatSnackBar);

  private getConfig(): MatSnackBarConfig {
    return {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 5000,
    };
  }

  public displaySuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      ...this.getConfig(),
      panelClass: ['snackbar-success'],
    });
  }

  public displayError(message: string): void {
    this.snackBar.open(message, 'Close', {
      ...this.getConfig(),
      panelClass: ['snackbar-error'],
    });
  }
}
