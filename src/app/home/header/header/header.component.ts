import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/service/dataService/data.service';
import { ApiService } from 'src/app/service/api/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Filter, User as loginUser } from 'src/app/Model/x-mart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  isSideSliderOpen = false;
  currentUser: any;
  loginUserDetails: any;
  theme: any;
  userSubscription: Subscription | undefined;
  shopName!: string;
  activeCategory: string | null = null;
  activeSubCategory: string | null = null;
  subMenuOpen: { [key: string]: boolean } = {};
  filters = new Filter();
  @ViewChild('templatemo_main_nav', { static: false }) navbar!: ElementRef;

  constructor(
    private dataService: DataService,
    private api: ApiService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.dataService.shopName.subscribe((data) => {
      if (data == null) return;
      this.shopName = data[0].shopName;
    });

    this.dataService.currentUser.subscribe((data) => {
      this.currentUser = data;
    });

    this.dataService.hasMore.next(false);
    this.dataService.lastDoc.next(null);
    this.dataService.limit.next(8);
    this.subscriptionForProducts();
  }

  ngOnInit(): void {
    this.fetchData();
    this.getUser();
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      country: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  closeMenu(): void {
    const navbarElement = this.navbar.nativeElement;
    if (navbarElement.classList.contains('show')) {
      navbarElement.classList.remove('show');
      navbarElement.classList.add('collapsing');
      setTimeout(() => {
        navbarElement.classList.remove('collapsing');
        navbarElement.classList.add('collapse');
      }, 300);
    }
  }

  subscriptionForProducts() {
    this.dataService.getProducts(this.dataService.limit.getValue()).subscribe((data: any) => {
      if (data == null) return;
      this.dataService.updateProductsData(data);
      localStorage.setItem('Products', JSON.stringify(data));
      if (data.length < this.dataService.limit.getValue()) {
        this.dataService.hasMore.next(false);
      }
    });
  }

  getUser() {
    this.authService.authState.subscribe(async (user) => {
      if (!user) {
        this.dataService.currentUser.next(null);
        return;
      }

      this.currentUser = user;
      try {
        const profile = await firstValueFrom(this.api.getProfile());
        if (profile) {
          this.dataService.currentUser.next(profile);
          this.dataService.syncLocalStorageToSupabase();
          this.loginUserDetails = profile as loginUser;
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    });
  }

  ngOnDestroy() {}

  signOut() {
    this.authService.signOut().then(() => {
      this.currentUser = null;
      this.loginUserDetails = null;
      this.dataService.currentUser.next(null);
      this.router.navigate(['']);
      setTimeout(() => this.setSignInTab(), 300);
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }

  private setSignInTab() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.addEventListener('shown.bs.modal', () => {
        const signInTab = document.getElementById('signIn-tab') as HTMLElement;
        if (signInTab) signInTab.click();
      });
    }
  }

  async fetchData() {
    try {
      this.spinner.show();
      this.dataService.updateLoadingIndicator(true);

      let mainShowData = this.dataService.getMainSliderData();
      let categoriesData = this.dataService.getCategoryData();
      let Products = this.dataService.getProductsData();
      let theme;
      let shopName;
      let contactDetail;

      const cacheKey = 'cache_timestamp';
      const cacheTTL = 1000 * 60 * 0;
      const cachedTimestamp = localStorage.getItem(cacheKey);
      const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < cacheTTL;

      if (isCacheValid && mainShowData.length && categoriesData.length && Products.length) {
        this.dataService.updateMainSliderData(mainShowData);
        this.dataService.updatecategoryData(categoriesData);
        this.dataService.updateProductsData(Products);
        this.spinner.hide();
      } else {
        mainShowData = await firstValueFrom(this.api.getSliders());
        categoriesData = await firstValueFrom(this.api.getCategories());
        contactDetail = await firstValueFrom(this.api.getContactDetails());

        this.dataService.updateMainSliderData(mainShowData);
        this.dataService.updatecategoryData(categoriesData);

        localStorage.setItem('mainShowData', JSON.stringify(mainShowData));
        localStorage.setItem('categoriesData', JSON.stringify(categoriesData));
        localStorage.setItem(cacheKey, Date.now().toString());
        this.dataService.shopContactDetails$.next(contactDetail);
        this.spinner.hide();
      }

      theme = await firstValueFrom(this.api.getTheme());
      shopName = await firstValueFrom(this.api.getShopName());
      this.dataService.shopName.next(shopName);

      contactDetail = await firstValueFrom(this.api.getContactDetails());
      this.dataService.shopContactDetails$.next(contactDetail);

      this.dataService.updateThemeColor(theme);
      this.theme = this.dataService.getThemeColor()[0];
      document.documentElement.style.setProperty('--primary-color', this.theme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', this.theme.secondaryColor);

      this.dataService.updateLoadingIndicator(false);
    } catch (error) {
      this.dataService.updateLoadingIndicator(false);
      console.error('Error fetching data:', error);
      this.spinner.hide();
    }
  }

  naviagteToProfile() {
    this.router.navigate(['profile']);
  }

  toggleSideSlider() {
    this.isSideSliderOpen = !this.isSideSliderOpen;
  }

  toggleCategory(category: string) {
    this.activeCategory = this.activeCategory === category ? null : category;
    this.activeSubCategory = null;
  }

  toggleSubCategory(subCategory: string) {
    this.activeSubCategory = this.activeSubCategory === subCategory ? null : subCategory;
  }

  filterProducts(category: string, subCategory: string, product: string): void {
    this.filters.category = category;
    this.filters.subCategory = subCategory;
    this.filters.type = product;
    this.dataService.filterFromSidePanel.next(this.filters);
    this.dataService.isSidePanelFilterClicked$.next(true);
    this.router.navigate(['shop']);
  }
}
