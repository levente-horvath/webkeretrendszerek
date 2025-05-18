import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        // If user is authenticated, allow access
        if (user) {
          return true;
        }
        
        // Otherwise redirect to login page with return URL
        // You would need to create a login component
        return this.router.createUrlTree(['/login'], { 
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }
} 