
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const loggedIn = localStorage.getItem('ociLoggedIn') === 'true';
    if (!loggedIn) {
      window.location.href = '/login';
      return false;
    }
    return true;
  }
}
