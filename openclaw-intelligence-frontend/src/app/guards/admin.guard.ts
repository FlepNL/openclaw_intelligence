
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  canActivate(): boolean {
    const loggedIn = localStorage.getItem('ociLoggedIn') === 'true';
    const role = localStorage.getItem('ociRole');
    if (role === 'admin') return true;
    if (loggedIn) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
    return false;
  }
}
