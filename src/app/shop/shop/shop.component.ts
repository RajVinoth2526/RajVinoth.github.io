import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation/confirmation.component';
import { DataService } from 'src/app/service/dataService/data.service';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  isAdmin: boolean = true;
  products: any = [];
  isDeleteButtonClicked: boolean = false;
  matDialogRef!: MatDialogRef<ConfirmationComponent>;
  activeCategory: string | null = 'all';
  activeSubCategory: any | null = null;
  isMenCategoryClicked: boolean = false;
  isWomenCategoryClicked: boolean = false;

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
  constructor(private router: Router,
    private dataService: DataService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataService.productsData.subscribe((products: any) => {
      if (products === null) return

      this.products = products;
    })
    // Subscribe to NavigationEnd event
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if URL after redirects is defined
      if (event.urlAfterRedirects) {
        // Scroll to top of the page
        window.scrollTo(0, 0);
      }
    });
  }

  navigateWithObject(product: any) {
    this.router.navigate(['/product',product.productId], {
      state: { objectData: product }
    });
  }

  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }


  

  cancelDelete() {
    this.isDeleteButtonClicked = false;
  }

   // Select category
   selectCategory(category: string): void {
    this.isWomenCategoryClicked = category === 'women';
    this.isMenCategoryClicked = category === 'men';
    this.activeCategory = category;
    this.activeSubCategory = null; // Reset subcategory
  }
  

  // Select subcategory
  selectSubCategory(subCategory: any) {
    this.activeSubCategory = subCategory.key;
    this.items = this.allItems[subCategory.key]; // Load items for selected subcategory
  }

}
