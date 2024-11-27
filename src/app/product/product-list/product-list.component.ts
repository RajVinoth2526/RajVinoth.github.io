import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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


}
