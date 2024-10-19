import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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

  // Declare and initialize the BehaviorSubject
  public mainSliderData = new BehaviorSubject<any>(null);
  public categoryData = new BehaviorSubject<any>(null);
  public productsData = new BehaviorSubject<any>(null);
  public themeColor = new BehaviorSubject<any>(null);
  public currentUser = new BehaviorSubject<any>(null);


  public loadingIndicator = new BehaviorSubject<boolean>(false);

  private mainSliderDataCache: any[] = [];
  private categoriesDataCache: any[] = [];
  private productsDataCache: any[] = [];







  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    // The constructor should not contain logic for initializing or updating the BehaviorSubject.
  }

  // Method to update the BehaviorSubject
  updateMainSliderData(newData: any) {
    this.mainSliderData.next(newData);
  }

  updateThemeColor(newData: any) {
    this.themeColor.next(newData);
  }

  updatecategoryData(newData: any) {
    this.categoryData.next(newData);
  }

  updateProductsData(newData: any) {
    this.productsData.next(newData);
  }

  updateLoadingIndicator(isLoading: boolean) {
    this.loadingIndicator.next(isLoading);
  }

  getMainSliderData(): any[] {
    const cachedData = localStorage.getItem('mainShowData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return []; // Return an empty array if no data is cached
  }


  getCategoryData(): any[] {
    const cachedData = localStorage.getItem('categoriesData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return [];
  }

  getThemeColor() {
    return this.themeColor.value;
  }


  getProductsData(): any[] {
    const cachedData = localStorage.getItem('Products');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return [];
  }

  clearCache(): void {
    this.mainSliderDataCache = [];
    this.categoriesDataCache = [];
    this.productsDataCache = [];
  }

  // Function to store product details with error handling
  async addProduct(product: any): Promise<void> {
    this.spinner.show();
    try {
      const user = await this.afAuth.currentUser; // Check if user is logged in

      if (user) {
        // If user is logged in, store product in Firebase Firestore
        const productId = this.firestore.createId(); // Create a unique ID for the product
        await this.firestore.collection('customerProductCard').doc(user.uid).collection('product').doc(product.productId).set({
          id: product.productId,
          image: product.imageUrl[0],
          name: product.title,
          price: product.price,
          size: product.size,
          label: product.label,
          category: product.category,
          description: product.description,
          userId: user.uid,
          createdAt: new Date()
        });
        this.spinner.hide();
        console.log('Product successfully added to Firestore');
        this.toastr.success('Product successfully added to Card');

      } else {
        // If user is not logged in, store product in localStorage
        this.storeProductInLocalStorage(product);
        console.log('Product stored in local storage');
        this.toastr.success('Product successfully added to Card');
        this.spinner.hide();

      }

    } catch (error) {
      // Handle any errors that occur
      console.error('Error adding product:', error);
      console.log('Product stored in local storage');
      this.toastr.warning('Product added to Card faild');

      this.spinner.hide();

      // Optionally, you can show an error message to the user
      // this.toastr.error('Failed to add product. Please try again later.');
    }
  }

  // Helper function to store product in localStorage
  private storeProductInLocalStorage(product: any): void {
    const productId = this.firestore.createId();
    let storedProducts = JSON.parse(localStorage.getItem('storedProducts') || '[]');
    storedProducts.push({
      id: product.productId,
      image: product.imageUrl[0],
      name: product.title,
      price: product.price,
      size: product.size,
      label: product.label,
      category: product.category,
      description: product.description,
      createdAt: new Date()
    });
    localStorage.setItem('storedProducts', JSON.stringify(storedProducts));
  }

  // Function to sync localStorage products to Firebase after login with error handling
  async syncLocalStorageToFirebase(): Promise<void> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser; // Ensure user is logged in

      if (user) {
        // Get the stored products from localStorage
        const storedProducts = JSON.parse(localStorage.getItem('storedProducts') || '[]');

        if (storedProducts.length > 0) {
          // Sync each product to Firebase
          for (const product of storedProducts) {
            const productId = this.firestore.createId(); // Generate a unique ID for each product

            // Add product to Firestore
            await this.firestore.collection('customerProductCard')
              .doc(user.uid)
              .collection('product')
              .doc(product.productId)
              .set({
                id: product.productId,
                image: product.imageUrl[0],
                name: product.title,
                price: product.price,
                size: product.size,
                label: product.label,
                category: product.category,
                description: product.description,
                userId: user.uid
              });
          }

          // Clear localStorage after syncing
          localStorage.removeItem('storedProducts');
          console.log('Products synced successfully to Firebase');
          this.toastr.success('Product successfully added to Card');

        } else {
          this.toastr.warning('Product added to Card faild');

          console.log('No products found in local storage to sync.');
          this.spinner.hide();

        }
      } else {
        throw new Error('User is not logged in'); // Error if user is not logged in
        this.toastr.warning('Product added to Card faild');
        this.spinner.hide();


      }
    } catch (error) {
      // Handle any errors that occur during the sync process
      console.error('Error syncing localStorage to Firebase:', error);
      this.toastr.warning('Product added to Card faild');
      this.spinner.hide();


      // Optionally, display an error message to the user
      // this.toastr.error('Failed to sync products to Firebase. Please try again.');
    }
  }

  // Function to get customer card products with error handling
  async getCustomerCardProducts(): Promise<any[]> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser; // Ensure the user is logged in

      if (user) {
        const productsObservable = this.firestore
          .collection('customerProductCard')
          .doc(user.uid)
          .collection('product')
          .valueChanges();

        // Convert the observable to a promise
        return new Promise((resolve, reject) => {
          const subscription = productsObservable.subscribe(
            (products) => {
              resolve(products); // Resolve the promise with the product data
              this.spinner.hide();

              subscription.unsubscribe(); // Unsubscribe after the first emission
            },
            (error) => {
              console.error('Error retrieving products:', error);
              this.spinner.hide();

              reject(error); // Reject the promise if there's an error
            }
          );
        });


      } else {
        this.spinner.hide();

        console.warn('User is not logged in');
        return []; // Return an empty array if the user is not logged in
      }
    } catch (error) {
      console.error('Error in getCustomerCardProducts:', error);
      this.spinner.hide();

      return []; // Return an empty array in case of any other error
    }
  }



  // Function to delete product from cart with error handling
  async deleteProductFromCard(product: any): Promise<void> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser;

      if (user) {
        // Delete the product from Firestore
        await this.firestore.collection('customerProductCard')
          .doc(user.uid)
          .collection('product')
          .doc(product.id)
          .delete();

        console.log(`Product with ID ${product.productId} deleted from Firestore.`);
        this.toastr.success('Product successfully deleted');
        this.spinner.hide();


      } else {
        // If user is not logged in, delete from local storage
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        this.toastr.success('Product successfully deleted');
        // Filter out the product to be deleted
        const updatedCartItems = cartItems.filter((item: { id: string }) => item.id !== product.productId);

        // Save the updated cart back to local storage
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        console.log(`Product with ID ${product.productId} deleted from local storage.`);
        this.spinner.hide();

      }

    } catch (error) {
      console.error('Error deleting product:', error);
      this.toastr.warning('Product  delete faild');
      this.spinner.hide();


      // Optionally, you could show an error message to the user
      // e.g., alert('Failed to delete product. Please try again.');
    }
  }


}
