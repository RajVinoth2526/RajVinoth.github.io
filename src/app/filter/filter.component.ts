import { Component, OnInit } from '@angular/core';
import { Filter } from '../Model/x-mart.model';
import { DataService } from '../service/dataService/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  activeCategory: string | null = 'all';
  activeSubCategory: any | null = null;
  activeType: any | null = null;
  isMenCategoryClicked: boolean = false;
  isWomenCategoryClicked: boolean = false;
  filter = new Filter();
  // Define the type for subcategories and items
  subCategories: { name: string; image: string; key: string }[] = [
    { name: 'Casual', image: 'assets/img/feature_prod_03.jpg', key: 'casual' },
    { name: 'Formal', image: 'assets/img/feature_prod_03.jpg', key: 'formal' },
  ];

  items: { name: string; image: string }[] = []; // Initialize as an empty array

  allItems: any = {
    casual: [
      { name: 'T-shirt', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Shirt', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Denim', image: 'assets/img/feature_prod_03.jpg' },
    ],
    formal: [
      { name: 'Suit', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Blazer', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Shirt', image: 'assets/img/feature_prod_03.jpg' },
    ],
  };
  constructor(
    private dataService: DataService,
    private router: Router
  ) { 
    this.getFilter();
  }

  ngOnInit(): void {
  }

  getFilter() {
    this.dataService.filterFromSidePanel.subscribe((data) => {
      if(data == null) return;
      this.selectCategory(data.category);
      
      // Find subcategory with case-insensitive comparison
      const subCategory = this.subCategories.find((sub) => 
        sub.name.toLowerCase() === data.subCategory?.toLowerCase() || 
        sub.key.toLowerCase() === data.subCategory?.toLowerCase()
      );
      
      if(subCategory) {
        this.selectSubCategory(subCategory);
      }
      
      // Find type with case-insensitive comparison
      if(data.type && this.items.length > 0) {
        const type = this.items.find((item) => 
          item.name.toLowerCase() === data.type?.toLowerCase()
        );
        if(type) {
          this.selectType(type);
        }
      }
      
      this.getProductsData(); 
    })
  }
  // Select category
  selectCategory(category: string): void {
    this.isWomenCategoryClicked = category === 'women';
    this.isMenCategoryClicked = category === 'men';
    this.activeCategory = category;
    this.activeSubCategory = null; // Reset subcategory
    this.activeType = null; // Reset active type
    this.items = []; // Reset items array
    
    this.filter.category = category;
    if(category == 'all') {
      this.filter.category = '';
    }
    this.filter.subCategory = '';
    this.filter.type = '';
    this.dataService.filter.next(this.filter);
    this.getProductsData();
  }


  // Select subcategory
  selectSubCategory(subCategory: any) {
    this.activeSubCategory = subCategory.key;
    this.activeType = null; // Reset active type when selecting subcategory
    this.items = this.allItems[subCategory.key]; // Load items for selected subcategory
    this.filter.subCategory = subCategory.key;
    this.filter.type = ''; // Reset type when selecting subcategory
    this.dataService.filter.next(this.filter);
    this.getProductsData();
  }

  selectType(type: any) {
    if(type) {
      this.activeType = type;
      this.filter.type = type.name.toLowerCase();
      this.dataService.filter.next(this.filter);
      this.getProductsData();
    }
  }

  getProductsData(component?: string) {
    let comp;
    if(component) {
      comp = component;
    }
    const currentUrl = this.router.url; // Get the current URL
    if (currentUrl.includes('shop')) {
      comp = "Product-List"
    } else  if (currentUrl.includes('home')) {
      comp = "Main"
    } 
    
    // Create a clean filter object, removing empty values
    const cleanFilter = {
      category: this.filter.category || '',
      subCategory: this.filter.subCategory || '',
      type: this.filter.type || ''
    };
    
    this.dataService.getProducts(8, null, cleanFilter, comp).subscribe((data) => {
      if(data == null) return;

      if (currentUrl.includes('shop') || this.dataService.isSidePanelFilterClicked$.value) {
        this.dataService.productsData.next(data);
        this.dataService.isSidePanelFilterClicked$.next(false);
      } else  if (currentUrl.includes('home')) {
        this.dataService.productsDataMainList.next(data); 
      } else {
        this.dataService.productsDataFilterList.next(data);
      }
    });
  }

  // Method to clear all filters
  clearAllFilters(): void {
    this.activeCategory = 'all';
    this.activeSubCategory = null;
    this.activeType = null;
    this.isMenCategoryClicked = false;
    this.isWomenCategoryClicked = false;
    this.items = [];
    
    this.filter = new Filter();
    this.dataService.filter.next(this.filter);
    this.getProductsData();
  }

} 
