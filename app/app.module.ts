import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LandingpageComponent } from './page/landingpage/landingpage.component';
import { SidebarComponent } from './page/sidebar/sidebar.component';
import { TopbarComponent } from './page/topbar/topbar.component';
import { CategoryComponent } from './page/category/category.component';
import { ProductComponent } from './page/product/product.component';
import { AddProductComponent } from './page/product/add-product/add-product.component';
import { StockComponent } from './page/stock/stock.component';
import { DeliveryPersonComponent } from './page/delivery-person/delivery-person.component';
import { UserComponent } from './page/user/user.component';
import { AddStockComponent } from './page/stock/add-stock/add-stock.component';
import { AddCategoryComponent } from './page/category/add-category/add-category.component';
import { OrderComponent } from './page/order/order.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { RegisterComponent } from './register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { CartComponent } from './page/cart/cart.component';
import { AuthInterceptor } from 'src/app/service/AuthInterceptor';
import { CategoryProductsComponent } from 'src/app/category-products/category-products.component';
import { UpdateProductComponent } from './page/product/updateproduct/updateproduct.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LandingpageComponent,
    SidebarComponent,
    TopbarComponent,
    CategoryComponent,
    ProductComponent,
    AddProductComponent,
    StockComponent,
    DeliveryPersonComponent,
    UserComponent,
    AddStockComponent,
    AddCategoryComponent,
    OrderComponent,
    MainLayoutComponent,
    BlankLayoutComponent,
    RegisterComponent,
    LoginComponent,
    ForgetpasswordComponent,
    CartComponent,
    UpdateProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule

  
  ],
  providers: [
        {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
