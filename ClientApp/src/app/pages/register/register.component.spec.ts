import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleRegister when Get Started button is clicked', async () => {
    // Arrange
    const spy = spyOn(component, 'handleRegister');
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Get Started' }));

    // Act
    await button.click();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should call goToLogin when Log In button is clicked', async () => {
    // Arrange
    const spy = spyOn(component, 'goToLogin');
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Log In' }));

    // Act
    await button.click();

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
