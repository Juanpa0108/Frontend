import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth_service } from '../core/auth.service';


export const authGuard: CanActivateFn = (route, state) => {

  const service = inject(Auth_service);
  const router = inject(Router);

  const token = service.get_token();

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  
};

