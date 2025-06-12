import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {NgIf} from "@angular/common";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Router} from "@angular/router";
const ADMIN_ROLES = ['ADMIN'];
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  private readonly productService = inject(ProductService);
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly router = inject(Router);
  productCreated = false;
  isAdmin = false;
  isClient = true;
  permissionDenied = false;

  constructor(private fb: FormBuilder) {
    this.addProductForm = this.fb.group({
      skuCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]]
    })
  }

  ngOnInit(): void {
    this.oidcSecurityService.userData$.subscribe(
      ({userData}) => {
        console.log('Add product - Full userData object:', userData);

        if (userData) {
          // Extract realm roles
          const realmRoles = userData.realm_access?.roles || [];

          // Extract client roles
          const clientRoles = userData.resource_access?.['angular-client']?.roles || [];

          // Combine all roles
          const allRoles = [...realmRoles, ...clientRoles];
          console.log('Add Product - All roles:', allRoles);

          // Check if user has admin role
          this.isAdmin = this.hasRole(ADMIN_ROLES, allRoles);

          console.log('Add Product - isAdmin:', this.isAdmin);

          // No redirect - allow all authenticated users to access the page
          console.log('Add product - User is authenticated, allowing access to add product page');
        } else {
          console.log('Add product - userData is null or undefined');
          this.router.navigate(['/']);
        }
      }
    );
  }

  /**
   * Check if user has any of the specified roles
   */
  hasRole(rolesToCheck: string[], userRoles: string[]): boolean {
    return userRoles.some(userRole => 
      rolesToCheck.some(roleToCheck => 
        userRole.toUpperCase() === roleToCheck.toUpperCase()
      )
    );
  }

  onSubmit(): void {
    // Reset flags
    this.permissionDenied = false;
    this.productCreated = false;

    // Check if user has admin role
    if (!this.isAdmin) {
      console.log('Permission denied: User does not have ADMIN role');
      this.permissionDenied = true;
      return;
    }

    if (this.addProductForm.valid) {
      const product: Product = {
        skuCode: this.addProductForm.get('skuCode')?.value,
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        price: this.addProductForm.get('price')?.value
      }
      this.productService.createProduct(product).subscribe(product => {
        this.productCreated = true;
        this.addProductForm.reset();
      })
    } else {
      console.log('Form is not valid');
    }
  }

  get skuCode() {
    return this.addProductForm.get('skuCode');
  }

  get name() {
    return this.addProductForm.get('name');
  }

  get description() {
    return this.addProductForm.get('description');
  }

  get price() {
    return this.addProductForm.get('price');
  }
}
