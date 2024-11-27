import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any = [];
  @Input() fromShopSingle = false;
  @Output() triggerGetProduct = new EventEmitter<string>();
  constructor(
    private dataService: DataService,
    private toster: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.productsData.subscribe((products: any) => {
      if (products === null) return

      this.products = products;

    })
  }

  navigateWithObject(product: any) {
    if(this.fromShopSingle) {
      this.triggerGetProduct.emit(product.productId);
    } else {
      this.router.navigate(['/product', product.productId], {
        state: { objectData: product }
      });
    }
   
  }

  disabledLoadMoreButton() {
    return this.products.length < this.dataService.limit.getValue();
  }

  loadMore() {
    if (!this.dataService.hasMore.getValue()) {
      this.toster.info('No more products to load'); // Notify user
      return;
    }
    this.dataService.limit.next(this.dataService.limit.getValue() + 8);
    this.dataService.getProducts(this.dataService.limit.getValue() , this.dataService.lastDoc.getValue()).subscribe((newProducts) => {
      this.products = [...this.products, ...newProducts]; // Append new products
      this.dataService.productsData.next(this.products);
    });
  }
  


}
