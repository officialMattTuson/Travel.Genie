import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AlertService', () => {
  let service: AlertService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: MatSnackBar, useValue: spy }],
    });
    service = TestBed.inject(AlertService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display success message with correct config', () => {
    const message = 'Success!';
    service.displaySuccess(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Close',
      jasmine.objectContaining({
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5000,
        panelClass: ['snackbar-success'],
      })
    );
  });

  it('should display error message with correct config', () => {
    const message = 'Error!';
    service.displayError(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Close',
      jasmine.objectContaining({
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5000,
        panelClass: ['snackbar-error'],
      })
    );
  });
});
