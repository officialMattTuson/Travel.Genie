import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpRequestStepComponent } from './otp-request-step.component';

describe('OtpRequestStepComponent', () => {
  let component: OtpRequestStepComponent;
  let fixture: ComponentFixture<OtpRequestStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpRequestStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpRequestStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
