import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { guestGuard } from './guest.guard';

describe('guestAuthGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: jasmine.SpyObj<RouterStateSnapshot>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/auth/login' } as jasmine.SpyObj<RouterStateSnapshot>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access when user is not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    TestBed.runInInjectionContext(() => {
      const result = guestGuard(mockRoute, mockState);
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should redirect to home when user is already authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);

    TestBed.runInInjectionContext(() => {
      const result = guestGuard(mockRoute, mockState);
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
