import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    private readonly oidcSecurityService = inject(OidcSecurityService);

    isAuthenticated = false;
    firstName = "";
    lastName = "";
    roles: string[] = [];
    username: string = "";

    ngOnInit(): void {
        this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
            this.isAuthenticated = isAuthenticated;
        });
        this.oidcSecurityService.userData$.subscribe(({ userData }) => {
            this.firstName = userData.given_name || userData.firstName || "";
            this.lastName = userData.family_name || userData.lastName || "";
            // This is how you extract roles from Keycloak's token
            this.username = userData.preferred_username;
            this.roles = userData?.realm_access?.roles || [];
            console.log('Full userData object from OIDC:', userData);
            console.log("Roles: ", this.roles);
        });
    }

    login(): void { this.oidcSecurityService.authorize(); }
    logout(): void { this.oidcSecurityService.logoff().subscribe(); }
}