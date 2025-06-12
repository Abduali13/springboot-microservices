import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AddProductComponent} from "./pages/add-product/add-product.component";
import {authGuard, adminGuard, clientGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {path: '', component: HomePageComponent},

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {path: 'add-product', component: AddProductComponent},
    ]
  },

  {
    path: 'client',
    canActivate: [authGuard, clientGuard],
    children: [
    ]
  },

  {path: 'add-product', component: AddProductComponent, canActivate: [authGuard]},

  {path: '**', redirectTo: ''}
];
