import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


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
  public loadingIndicator = new BehaviorSubject<boolean>(false);

  private mainSliderDataCache: any[] = [];
  private categoriesDataCache: any[] = [];
  private productsDataCache: any[] = [];


  




  constructor() {
    // The constructor should not contain logic for initializing or updating the BehaviorSubject.
  }

  // Method to update the BehaviorSubject
  updateMainSliderData(newData: any) {
    this.mainSliderData.next(newData);
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


}
