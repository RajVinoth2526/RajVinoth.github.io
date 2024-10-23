import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/dataService/data.service';


@Component({
  selector: 'app-user-order-detail',
  templateUrl: './user-order-detail.component.html',
  styleUrls: ['./user-order-detail.component.css']
})
export class UserOrderDetailComponent implements OnInit {
  cartItems: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  
  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ){}

  ngOnInit(): void {
     this.loadCart();
  }

  async loadCart(): Promise<void> {
    this.cartItems = await this.dataService.getCustomerCardProducts(); // Await the Promise here
    this.calculateTotals();


  }
  

  calculateTotals(): void {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * 1), 0);
  }

  async removeFromCart(product: any){
    await this.dataService.deleteProductFromCard(product);
    this.loadCart();
    this.cartItems = this.cartItems.filter(item => item.id !== product.productId);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.calculateTotals();
  }

  navigateWithObject() {
    const data = this.cartItems;
    this.router.navigateByUrl('/confirm-order', { state: { data } });
  }
}
