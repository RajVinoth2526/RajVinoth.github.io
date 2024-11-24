import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders : any;
  displayedColumns: string[] = ['position', 'name']; // Adjust column IDs

  constructor(
    private dataService : DataService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  async ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => { // Add `async` to the callback
      if (user) {
        this.orders = await this.dataService.getOrdersByUserId(user.uid);
      }
    });
  }

  convertToDate(createdAt: any) {
    // Convert to milliseconds
    const milliseconds = (createdAt.seconds * 1000) + (createdAt.nanoseconds / 1_000_000);

    // Create a Date object
    return new Date(milliseconds);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getTotalAmount(order: any): number {
    console.log(order.card); // Log the card data to check its structure
    if (Array.isArray(order.card)) {
      return order.card.reduce((total: any, product: any) => total + product.quantity * product.price, 0);
    } else {
      console.error('order.card is not an array');
      return 0; // or handle it accordingly
    }
  }
  

  viewOrderDetails(productId: any): void {
    this.router.navigate(['/product',productId]);
  }
  

}
