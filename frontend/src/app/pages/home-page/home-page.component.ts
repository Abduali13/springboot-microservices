import {Component, inject, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {Router} from "@angular/router";
import {Order} from "../../model/order";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../services/order/order.service";
import { take, switchMap, tap } from 'rxjs/operators';
import {NgIf} from "@angular/common";

const ADMIN_ROLES = ['ADMIN'];


@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
    imports: [
        FormsModule,
        NgIf
    ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  isAuthenticated = false;
  isAdmin = false;
  isClient = true;
  userRoles: string[] = [];
  products: Array<Product> = [];
  quantityIsNull = false;
  orderSuccess = false;
  orderFailed = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        this.productService.getProducts()
          .pipe()
          .subscribe(product => {
            this.products = product;
          })
      }
    )
    this.oidcSecurityService.userData$.subscribe(({ userData }) => {
      console.log('Full userData object from OIDC:', userData);

      const realmRoles = userData?.realm_access?.roles || [];

      const clientRoles = userData?.resource_access?.['angular-client']?.roles || [];

      this.userRoles = [...realmRoles, ...clientRoles];

      this.isAdmin = this.hasRole(ADMIN_ROLES);
      this.isClient = this.hasRole(['CLIENT']);
      console.log('Extracted roles:', this.userRoles);
      console.log('Is Admin:', this.isAdmin);
    });
  }

  hasRole(rolesToCheck: string[]): boolean {
    return this.userRoles.some(userRole => 
      rolesToCheck.some(roleToCheck => 
        userRole.toUpperCase() === roleToCheck.toUpperCase()
      )
    );
  }

  goToCreateProductPage() {
    this.router.navigateByUrl('/add-product');
  }

  orderProduct(product: Product, quantity: string) {
    this.resetFlags();

      this.oidcSecurityService.userData$.subscribe( result  => {
          const userDetails = {
              firstName: result.userData.firstName,
              lastName: result.userData.lastName,
              email: result.userData.email,
              role: Array.of(result.userData.role)
          }

          console.log('Order - Extracted userDetails:', userDetails); // Debug log

          const order: Order = {
              skuCode:   product.skuCode,
              price:     product.price,
              quantity:  Number(quantity),
              userDetails: userDetails
          };
          return this.orderService.orderProduct(order);
      });

    if (!quantity) {
      this.quantityIsNull = true;
      this.orderFailed   = true;
      return;
    }

    this.oidcSecurityService.userData$.pipe(
        take(1),
        switchMap(result => {
          console.log('Order - Full userData object:', result); // Debug log

            const userDetails = {
                firstName: result.userData.firstName,
                lastName: result.userData.lastName,
                email: result.userData.email,
                role: Array.of(result.userData.role)
            }

          console.log('Order - Extracted userDetails:', userDetails); // Debug log

          const order: Order = {
            skuCode:   product.skuCode,
            price:     product.price,
            quantity:  Number(quantity),
            userDetails: userDetails
          };
          return this.orderService.orderProduct(order);
        }),
        tap({
          next: resp => {
            if (resp === 'Order Placed Successfully') {
              this.orderSuccess = true;
            } else {
              this.orderFailed = true;
            }
          },
          error: _err => {
            this.orderFailed = true;
          }
        })
    ).subscribe();
  }

  private resetFlags() {
    this.quantityIsNull = false;
    this.orderSuccess   = false;
    this.orderFailed    = false;
  }
}
