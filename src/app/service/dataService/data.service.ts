import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, firstValueFrom, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Filter } from 'src/app/Model/x-mart.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';

export enum Category {
  Men = 1,
  Women = 2,
  Accessories = 3,
  Shoe = 4
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public mainSliderData = new BehaviorSubject<any>(null);
  public categoryData = new BehaviorSubject<any>(null);
  public productsData = new BehaviorSubject<any>(null);
  public themeColor = new BehaviorSubject<any>(null);
  public currentUser = new BehaviorSubject<any>(null);
  public shopName = new BehaviorSubject<any>(null);
  public shopContactDetails$ = new BehaviorSubject<any>(null);
  public loadingIndicator = new BehaviorSubject<boolean>(false);

  private mainSliderDataCache: any[] = [];
  private categoriesDataCache: any[] = [];
  private productsDataCache: any[] = [];

  public lastDoc = new BehaviorSubject<any>(null);
  public hasMore = new BehaviorSubject<boolean>(true);
  public limit = new BehaviorSubject<number>(8);
  public filter = new BehaviorSubject<any>(null);
  public filterFromSidePanel = new BehaviorSubject<any>(null);
  public isSidePanelFilterClicked$ = new BehaviorSubject<boolean>(false);

  public lastDocMain = new BehaviorSubject<any>(null);
  public hasMoreMain = new BehaviorSubject<boolean>(true);
  public limitMain = new BehaviorSubject<number>(8);
  public filterMain = new BehaviorSubject<any>(null);
  public productsDataMainList = new BehaviorSubject<any>(null);

  public lastDocFilter = new BehaviorSubject<any>(null);
  public hasMoreFilter = new BehaviorSubject<boolean>(true);
  public limitFilter = new BehaviorSubject<number>(8);
  public filterFilter = new BehaviorSubject<any>(null);
  public productsDataFilterList = new BehaviorSubject<any>(null);

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {}

  updateMainSliderData(newData: any) { this.mainSliderData.next(newData); }
  updateThemeColor(newData: any) { this.themeColor.next(newData); }
  updatecategoryData(newData: any) { this.categoryData.next(newData); }
  updateProductsData(newData: any) { this.productsData.next(newData); }
  updateShopName(newData: any) { this.shopName.next(newData); }
  updateLoadingIndicator(isLoading: boolean) { this.loadingIndicator.next(isLoading); }

  getMainSliderData(): any[] {
    const cachedData = localStorage.getItem('mainShowData');
    return cachedData ? JSON.parse(cachedData) : [];
  }

  getCategoryData(): any[] {
    const cachedData = localStorage.getItem('categoriesData');
    return cachedData ? JSON.parse(cachedData) : [];
  }

  getThemeColor() { return this.themeColor.value; }
  getShopName() { return this.shopName.value; }

  getProductsData(): any[] {
    const cachedData = localStorage.getItem('Products');
    return cachedData ? JSON.parse(cachedData) : [];
  }

  clearCache(): void {
    this.mainSliderDataCache = [];
    this.categoriesDataCache = [];
    this.productsDataCache = [];
  }

  async getShopContact() {
    this.spinner.show();
    try {
      const contactDetail = await firstValueFrom(this.api.getContactDetails());
      return contactDetail;
    } catch (error) {
      this.toastr.success('my orders get faild');
      return [];
    } finally {
      this.spinner.hide();
    }
  }

  async addProduct(product: any): Promise<void> {
    this.spinner.show();
    try {
      const user = await this.authService.getCurrentUser();

      if (user) {
        await firstValueFrom(this.api.addToCart({
          productId: product.productId,
          imageUrl: product.imageUrl,
          title: product.title,
          price: product.price,
          size: product.size,
          quantity: product.quantity,
          label: product.label,
          color: product.color,
          category: product.category,
          description: product.description
        }));
        this.toastr.success('Product successfully added to Card');
      } else {
        this.storeProductInLocalStorage(product);
        this.toastr.success('Product successfully added to Card');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      this.toastr.warning('Product added to Card faild');
    } finally {
      this.spinner.hide();
    }
  }

  getUSerData() {
    return this.currentUser.value;
  }

  private storeProductInLocalStorage(product: any): void {
    let storedProducts = JSON.parse(localStorage.getItem('storedProducts') || '[]');
    storedProducts.push({
      id: product.productId,
      image: product.imageUrl[0],
      name: product.title,
      price: product.price,
      size: product.size,
      quantity: product.quantity,
      label: product.label,
      color: product.color,
      category: product.category,
      description: product.description,
      createdAt: new Date()
    });
    localStorage.setItem('storedProducts', JSON.stringify(storedProducts));
  }

  async syncLocalStorageToSupabase(): Promise<void> {
    this.spinner.show();
    try {
      const user = await this.authService.getCurrentUser();

      if (user && this.getUSerData() && !this.getUSerData().isAdmin) {
        const storedProducts = JSON.parse(localStorage.getItem('storedProducts') || '[]');

        if (storedProducts && storedProducts.length > 0) {
          await firstValueFrom(this.api.syncCart(storedProducts));
          localStorage.removeItem('storedProducts');
          this.toastr.success('Product successfully added to Card');
        }
      } else if (!user) {
        this.toastr.warning('Product added to Card failed');
        throw new Error('User is not logged in');
      }
    } catch (error) {
      console.error('Error syncing localStorage to Supabase:', error);
      this.toastr.warning('Product added to Card failed');
    } finally {
      this.spinner.hide();
    }
  }

  getProducts(limit: number, lastDoc?: any, filters?: Record<string, any>, component?: string): Observable<any[]> {
    this.spinner.show();
    const cursor = lastDoc?._cursor || lastDoc || undefined;

    return this.api.getProducts(limit, cursor, filters).pipe(
      map((response: any) => {
        const products = response.data || response;
        const hasMore = response.hasMore ?? (products.length === limit);
        const cursor = response.cursor;

        if (component === 'Main') {
          this.hasMoreMain.next(hasMore);
          this.lastDocMain.next(cursor);
        } else if (component === 'Product-List') {
          this.hasMore.next(hasMore);
          this.lastDoc.next(cursor);
        } else if (component === 'Filter-List') {
          this.hasMoreFilter.next(hasMore);
          this.lastDocFilter.next(cursor);
        }

        if (!hasMore && products.length === 0) {
          this.toastr.info('No more products to load');
        }

        return products;
      }),
      catchError((error: Error) => {
        this.toastr.error('Failed to load orders');
        throw error;
      }),
      finalize(() => this.spinner.hide())
    );
  }

  async getOrdersByUserId(userId: string) {
    this.spinner.show();
    try {
      const orders = await firstValueFrom(this.api.getOrdersByUserId(userId));
      return orders;
    } catch (error) {
      this.toastr.success('my orders get faild');
      return [];
    } finally {
      this.spinner.hide();
    }
  }

  async updateOrder(orderData: any) {
    this.spinner.show();
    try {
      await firstValueFrom(this.api.updateOrder(orderData.orderId, orderData));
    } catch (error) {
      console.error('Error storing order:', error);
      throw new Error('Failed to store the order. Please try again.');
    } finally {
      this.spinner.hide();
    }
  }

  async storeOdersForAdmin(orderData: any, card: any, user: any, orderId?: any) {
    this.spinner.show();
    try {
      await firstValueFrom(this.api.createOrder({
        cart: card,
        customer: orderData.customer || orderData.customerDetails,
        paymentMethod: orderData.paymentMethod,
        orderId
      }));
    } catch (error) {
      console.error('Error storing order:', error);
      throw new Error('Failed to store the order. Please try again.');
    } finally {
      this.spinner.hide();
    }
  }

  async storeOrders(orderData: any): Promise<void> {
    this.spinner.show();
    try {
      await firstValueFrom(this.api.createOrder({
        cart: orderData.cart,
        customer: orderData.customer,
        paymentMethod: orderData.paymentMethod
      }));

      orderData.cart.forEach((card: any) => {
        if (card == null) return;
        this.deleteProductFromCard(card);
      });

      this.toastr.success('Your order is confirmed!');
    } catch (error) {
      console.error('Error saving order:', error);
      this.toastr.warning('order save failed');
    } finally {
      this.spinner.hide();
    }
  }

  async getOrders(): Promise<any[]> {
    this.spinner.show();
    try {
      const orders = await firstValueFrom(this.api.getOrders());
      return orders || [];
    } catch (error) {
      console.error('Error in getOrders:', error);
      return [];
    } finally {
      this.spinner.hide();
    }
  }

  async getCustomerCardProducts(user?: any): Promise<any[]> {
    this.spinner.show();
    try {
      if (user) {
        const products = await firstValueFrom(this.api.getCartItems());
        return products || [];
      } else {
        const cartItems = JSON.parse(localStorage.getItem('storedProducts') || '[]');
        if (cartItems && cartItems.length > 0) {
          return cartItems;
        }
        return [];
      }
    } catch (error) {
      console.error('Error in getCustomerCardProducts:', error);
      return [];
    } finally {
      this.spinner.hide();
    }
  }

  async getProductById(productId: string): Promise<any> {
    this.spinner.show();
    try {
      const product = await firstValueFrom(this.api.getProductById(productId));
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      this.toastr.warning('Product added to cart failed');
      return null;
    } finally {
      this.spinner.hide();
    }
  }

  async getOrderById(orderId: string): Promise<any> {
    this.spinner.show();
    try {
      const order = await firstValueFrom(this.api.getOrderById(orderId));
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      this.toastr.warning('order get failed');
      return null;
    } finally {
      this.spinner.hide();
    }
  }

  async deleteProductFromCard(product: any): Promise<void> {
    this.spinner.show();
    try {
      const user = await this.authService.getCurrentUser();

      if (user) {
        await firstValueFrom(this.api.removeFromCart(product.id));
        if (user && this.getUSerData() && this.getUSerData().isAdmin) {
          this.toastr.success('Product successfully deleted');
        }
      } else {
        const cartItems = JSON.parse(localStorage.getItem('storedProducts') || '[]');
        this.toastr.success('Product successfully deleted');
        const updatedCartItems = cartItems.filter((item: { id: string }) => item.id !== product.id);
        localStorage.setItem('storedProducts', JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      this.toastr.warning('Product  delete faild');
    } finally {
      this.spinner.hide();
    }
  }

  async fetchCategoriesData(collection: string): Promise<any[]> {
    this.spinner.show();
    try {
      if (collection === 'catergories') {
        return await firstValueFrom(this.api.getCategories());
      } else if (collection === 'SliderShow') {
        return await firstValueFrom(this.api.getSliders());
      }
      return [];
    } catch (error) {
      console.error('Error fetching Categories Data:', error);
      this.toastr.warning('Failed to load categories data');
      return [];
    } finally {
      this.spinner.hide();
    }
  }

  handleDeleteByAdmin(collection1: string, collection2: string, productId: string, products: any[], index: number) {
    let deleteObs: Observable<any>;

    if (collection2 === 'product') {
      deleteObs = this.api.deleteProduct(productId);
    } else if (collection2 === 'catergories') {
      deleteObs = this.api.deleteCategory(productId);
    } else if (collection2 === 'SliderShow') {
      deleteObs = this.api.deleteSlider(productId);
    } else {
      return;
    }

    deleteObs.subscribe({
      next: async () => {
        if (collection2 === 'product') {
          products.splice(index, 1);
          this.productsData.next(products);
        } else if (collection2 === 'catergories') {
          const categories = await this.fetchCategoriesData(collection2);
          this.categoryData.next(categories);
        } else if (collection2 === 'SliderShow') {
          const sliders = await this.fetchCategoriesData(collection2);
          this.mainSliderData.next(sliders);
        }
        this.toastr.success(' product deleted successfully.');
      },
      error: (error) => {
        this.toastr.warning(error);
      }
    });
  }

  generateId(): string {
    return uuidv4();
  }
}
