import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/service/dataService/data.service';
import { getDoc, doc, Firestore, getDocFromCache } from "firebase/firestore";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from 'firebase/auth';
import { User as loginUser } from 'src/app/Model/x-mart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  user$!: Observable<any>;
  currentUser: any;
  loginUserDetails: any;

  constructor(private dataService: DataService,
    private firestore: AngularFirestore,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.fetchData();
    this.getUser();
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Corrected form control name
      password: ['', [Validators.required]], // Corrected form control name
    });

    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required], // Corrected form control name
      lastName: ['', Validators.required], // Corrected form control name
      email: ['', [Validators.required, Validators.email]], // Corrected form control name
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Corrected form control name
      country: ['', Validators.required], // Corrected form control name
      address1: ['', Validators.required], // Corrected form control name
      address2: [''], // Corrected form control name
      city: ['', Validators.required], // Corrected form control name
      state: ['', Validators.required], // Corrected form control name
      postalCode: ['', Validators.required], // Corrected form control name
      password: ['', Validators.required], // Corrected form control name
    });

  }

  getUser() {
    this.afAuth.authState.subscribe(user => {
      if (user === null || user === undefined) return;

      this.currentUser = user;

      this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((data) => {
        if (data == null) return;

        this.loginUserDetails = data as loginUser; // Use 'as' to assert the type
      });
    });
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      console.log('User signed out successfully');
      this.currentUser = null;

      setTimeout(() => {
        this.setSignInTab();
      }, 300);
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }

  private setSignInTab() {
    const signInTab = document.getElementById('signIn-tab') as HTMLElement;
    if (signInTab) {
      signInTab.click(); // This simulates a click on the Sign In tab to activate it
    }
  }

  async fetchData() {
    try {
      this.spinner.show();
      this.dataService.updateLoadingIndicator(true);

      // Check if cached data exists and is still valid
      let mainShowData = this.dataService.getMainSliderData();
      let categoriesData = this.dataService.getCategoryData();
      let Products = this.dataService.getProductsData();



      const cacheKey = 'cache_timestamp';
      const cacheTTL = 1000 * 60 * 0; // 1 hour in milliseconds

      const cachedTimestamp = localStorage.getItem(cacheKey);
      const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < cacheTTL;

      if (isCacheValid && mainShowData.length && categoriesData.length && Products.length) {
        // Use the cached data
        this.dataService.updateMainSliderData(mainShowData);
        this.dataService.updatecategoryData(categoriesData);
        this.dataService.updateProductsData(Products);
        this.spinner.hide();
        console.log('Using cached data');
      } else {
        console.log('Fetching fresh data');
        // Fetch data from Firestore
        const sliderShowDataPromise = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('products').doc('SliderShow').collection('SliderShow').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });

        const categoriesDataPromise = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('products').doc('catergories').collection('catergories').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });

        const getProductsPromise = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('products').doc('product').collection('product').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });


        // Wait for all promises to resolve
        mainShowData = await sliderShowDataPromise;
        categoriesData = await categoriesDataPromise;
        Products = await getProductsPromise;

        // Cache the data in dataService
        this.dataService.updateMainSliderData(mainShowData);
        this.dataService.updatecategoryData(categoriesData);
        this.dataService.updateProductsData(Products);

        // Update local storage with fresh data and timestamp
        localStorage.setItem('mainShowData', JSON.stringify(mainShowData));
        localStorage.setItem('categoriesData', JSON.stringify(categoriesData));
        localStorage.setItem('Products', JSON.stringify(Products));
        localStorage.setItem(cacheKey, Date.now().toString());
        this.spinner.hide();
      }

      this.dataService.updateLoadingIndicator(false);

    } catch (error) {
      this.dataService.updateLoadingIndicator(false);
      console.error('Error fetching data:', error);
      this.spinner.hide();
    }
  }

  async onSubmitSignIn() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    try {
      this.spinner.show();
      const { email, password } = this.signInForm.value;
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (result) {
        this.toastr.success('Login Successfully');
        this.spinner.hide();
      }
    } catch (error) {
      this.spinner.hide();
      this.toastr.warning('' + error);

    }
  }

  async onSubmitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, phone, country, address1, address2, city, state, postalCode, password } = this.signUpForm.value;

    try {
      this.spinner.show();
      // Create user with Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

      // Store additional user details in Firestore
      await this.firestore.collection('users').doc(userCredential.user?.uid).set({
        firstName,
        lastName,
        email,
        phone,
        country,
        address1,
        address2,
        city,
        state,
        postalCode,
      });
      this.getUser();
      this.spinner.hide();
      this.toastr.success('SignUp Successfully');

    } catch (error) {
      this.toastr.warning('SignUp Failed');
      this.spinner.hide();

    }
  }




}
