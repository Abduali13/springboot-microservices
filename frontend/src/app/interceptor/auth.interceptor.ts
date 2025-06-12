import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {switchMap} from "rxjs/operators";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(OidcSecurityService);

  return authService.getAccessToken().pipe(
    switchMap(token => {
      if (token) {
        let header = 'Bearer ' + token;
        let headers = req.headers.set('Authorization', header);
        const clonedReq = req.clone({headers});
        return next(clonedReq);
      }
      return next(req);
    })
  );
}
