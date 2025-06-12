import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return oidcSecurityService.isAuthenticated$.pipe(
    take(1),
    map(({ isAuthenticated }) => {
      if (isAuthenticated) {
        return true;
      }
      
      router.navigate(['/']);
      return false;
    })
  );
};


export const adminGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);
  
  return oidcSecurityService.userData$.pipe(
    take(1),
    map(userData => {
      const user = userData.userData as any;
      
      if (!user) {
        router.navigate(['/']);
        return false;
      }
      
      const realmRoles = user.realm_access?.roles || [];
      const clientRoles = user.resource_access?.['angular-client']?.roles || [];
      
      const allRoles = [...realmRoles, ...clientRoles];
      
      const isAdmin = allRoles.some(role =>
        ['ADMIN', 'ROLE_ADMIN'].includes(role.toUpperCase())
      );
      
      if (isAdmin) {
        return true;
      }
      
      router.navigate(['/']);
      return false;
    })
  );
};

export const clientGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);
  
  return oidcSecurityService.userData$.pipe(
    take(1),
    map(userData => {
      const user = userData.userData as any;
      
      if (!user) {
        router.navigate(['/']);
        return false;
      }
      
      const realmRoles = user.realm_access?.roles || [];
      const clientRoles = user.resource_access?.['angular-client']?.roles || [];
      
      const allRoles = [...realmRoles, ...clientRoles];
      
      const isClient = allRoles.some(role =>
        ['CLIENT', 'ROLE_CLIENT'].includes(role.toUpperCase())
      );
      
      if (isClient) {
        return true;
      }
      
      router.navigate(['/']);
      return false;
    })
  );
};