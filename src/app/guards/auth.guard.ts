import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';


export const authGuard: CanActivateFn = (route, state) => {

  const service = inject(AuthService);
  const router = inject(Router);

  const token = service.getToken();

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  
};

