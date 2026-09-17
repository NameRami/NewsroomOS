import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ During SSR, just allow navigation (client will enforce after hydration)
  if (!isPlatformBrowser(platformId)) return true;

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};
