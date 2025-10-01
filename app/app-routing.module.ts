import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';

// User Pages
import { LandingpageComponent } from './page/landingpage/landingpage.component';
import { CartComponent } from './page/cart/cart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { CategoryProductsComponent } from 'src/app/category-products/category-products.component';
// Admin Pages
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { CategoryComponent } from './page/category/category.component';
import { AddCategoryComponent } from './page/category/add-category/add-category.component';
import { ProductComponent } from './page/product/product.component';
import { AddProductComponent } from './page/product/add-product/add-product.component';
import { StockComponent } from './page/stock/stock.component';
import { AddStockComponent } from './page/stock/add-stock/add-stock.component';
import { DeliveryPersonComponent } from './page/delivery-person/delivery-person.component';
import { UserComponent } from './page/user/user.component';
import { OrderComponent } from './page/order/order.component';

const routes: Routes = [

  // Public / User routes
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: '', redirectTo: 'landingpage', pathMatch: 'full' },
      { path: 'landingpage', component: LandingpageComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgetpassword', component: ForgetpasswordComponent },
      { path: 'cart', component: CartComponent },

      // ✅ User-facing category page
      { path: 'category/:id', component: CategoryProductsComponent }
    ]
  },

  // Admin routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'category', component: CategoryComponent }, // admin category list
      { path: 'addcategory', component: AddCategoryComponent },
      { path: 'product', component: ProductComponent },
      { path: 'addproduct', component: AddProductComponent },
      { path: 'stock', component: StockComponent },
      { path: 'addstock', component: AddStockComponent },
      { path: 'delivery', component: DeliveryPersonComponent },
      { path: 'user', component: UserComponent },
      { path: 'order', component: OrderComponent }
    ]
  },

  // Catch-all redirect
  { path: '**', redirectTo: 'landingpage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
