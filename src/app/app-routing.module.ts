import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { ContactComponent } from './contact/contact/contact.component';
import { AboutComponent } from './about/about/about.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ShopSingleComponent } from './shop-single/shop-single/shop-single.component';
import { SetupComponent } from './setup/setup/setup.component';
import { AdminProductOrderDetailsComponent } from './Order/admin-product-order-details/admin-product-order-details.component';
import { ConfirmOrderComponent } from './Order/confirm-order/confirm-order.component';
import { PaymentComponent } from './Order/payment/payment.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ShopSingleComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'Admin-order-details', component: AdminProductOrderDetailsComponent },
  { path: 'confirm-order', component: ConfirmOrderComponent },
  { path: 'payment', component: PaymentComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
