import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerifyStepComponent } from './otp-verify-step.component';

describe('OtpVerifyStepComponent', () => {
  let component: OtpVerifyStepComponent;
  let fixture: ComponentFixture<OtpVerifyStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerifyStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerifyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
