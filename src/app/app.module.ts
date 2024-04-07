import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './home/header/header/header.component';
import { FooterComponent } from './home/footer/footer/footer.component';
import { ContactComponent } from './contact/contact/contact.component';
import { HomeComponent } from './home/home/home.component';
import { AboutComponent } from './about/about/about.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ShopSingleComponent } from './shop-single/shop-single/shop-single.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { SetupComponent } from './setup/setup/setup.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    AboutComponent,
    ShopComponent,
    ShopSingleComponent,
    SetupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
