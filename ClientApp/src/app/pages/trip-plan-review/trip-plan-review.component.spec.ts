import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TripPlanReviewComponent } from './trip-plan-review.component';
import { AlertService } from '../../services/alert.service';
import { TripPlanReviewService } from './trip-plan-review.service';
import { GeneratedTripPlanResponse } from '../../services/trip-planner.service';
import { mockGeneratedTripPlan } from '../../mocks/mock-generated-trip-plan';

describe('TripPlanReviewComponent', () => {
    let component: TripPlanReviewComponent;
    let fixture: ComponentFixture<TripPlanReviewComponent>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockAlertService: jasmine.SpyObj<AlertService>;
    let mockTripPlanReviewService: jasmine.SpyObj<TripPlanReviewService>;

    const mockTripPlan: GeneratedTripPlanResponse = mockGeneratedTripPlan;

    beforeEach(async () => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockAlertService = jasmine.createSpyObj('AlertService', ['displayError', 'displaySuccess']);
        mockTripPlanReviewService = jasmine.createSpyObj('TripPlanReviewService', ['getTripPlan']);

        await TestBed.configureTestingModule({
            imports: [TripPlanReviewComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: AlertService, useValue: mockAlertService },
                { provide: TripPlanReviewService, useValue: mockTripPlanReviewService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TripPlanReviewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should load trip plan on init', () => {
            mockTripPlanReviewService.getTripPlan.and.returnValue(mockTripPlan);

            component.ngOnInit();

            expect(component.generatedPlan).toEqual(mockTripPlan);
            expect(mockTripPlanReviewService.getTripPlan).toHaveBeenCalled();
        });

        it('should display error and navigate when no trip plan found', () => {
            mockTripPlanReviewService.getTripPlan.and.returnValue(null);

            component.ngOnInit();

            expect(component.generatedPlan).toBeNull();
            expect(mockAlertService.displayError).toHaveBeenCalledWith('No trip plan found. Please create a trip first.');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-trip']);
        });
    });

    describe('formatCurrency', () => {
        it('should format valid number as currency', () => {
            const result = component.formatCurrency(1234.56);
            expect(result).toBe('$1,234.56');
        });

        it('should return $0.00 for undefined', () => {
            const result = component.formatCurrency(undefined);
            expect(result).toBe('$0.00');
        });

        it('should return $0.00 for null', () => {
            const result = component.formatCurrency(null as any);
            expect(result).toBe('$0.00');
        });

        it('should format zero as currency', () => {
            const result = component.formatCurrency(0);
            expect(result).toBe('$0.00');
        });
    });

    describe('acceptAndSaveTrip', () => {
        it('should save trip and navigate to dashboard', () => {
            component.generatedPlan = mockTripPlan;

            component.acceptAndSaveTrip();

            expect(component.isSaving).toBe(true);
            expect(mockAlertService.displaySuccess).toHaveBeenCalledWith('Trip "European Explorer" saved successfully!');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
        });

        it('should display error when no trip plan to save', () => {
            component.generatedPlan = null;

            component.acceptAndSaveTrip();

            expect(mockAlertService.displayError).toHaveBeenCalledWith('No trip plan to save.');
            expect(component.isSaving).toBe(false);
        });
    });

    describe('editTrip', () => {
        it('should navigate to create-trip page', () => {
            component.editTrip();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-trip']);
        });
    });

    describe('goBack', () => {
        it('should navigate to create-trip page', () => {
            component.goBack();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-trip']);
        });
    });
});