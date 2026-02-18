
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    (window as any).showForgot = () => {
      document.getElementById('forgotModal')?.classList.add('show');
      const form = document.getElementById('forgotForm');
      const success = document.getElementById('forgotSuccess');
      if (form) form.style.display = 'block';
      if (success) success.style.display = 'none';
    };
    (window as any).closeForgot = () => {
      document.getElementById('forgotModal')?.classList.remove('show');
    };
    (window as any).sendReset = () => {
      const form = document.getElementById('forgotForm');
      const success = document.getElementById('forgotSuccess');
      if (form) form.style.display = 'none';
      if (success) success.style.display = 'block';
    };
    (window as any).doLogin = () => {
      const email = (document.getElementById('loginEmail') as HTMLInputElement | null)?.value || '';
      const role = email.toLowerCase().endsWith('@openclawintelligence.com') ? 'admin' : 'user';
      localStorage.setItem('ociLoggedIn', 'true');
      localStorage.setItem('ociRole', role);
      localStorage.setItem('ociUserEmail', email);
      window.location.href = '/dashboard';
    };
    document.getElementById('forgotModal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) (window as any).closeForgot();
    });
  }
}
