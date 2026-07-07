import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataService } from 'src/app/service/dataService/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-product-order-details',
  templateUrl: './admin-product-order-details.component.html',
  styleUrls: ['./admin-product-order-details.component.css']
})
export class AdminProductOrderDetailsComponent implements OnInit {
  orders: any = [];
  orderItems: any = [];
  theme: any;
  currentUser: any;

  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.theme = {
      backgroundColor: '#210b12',
      textColor: '#210b12'
    };
  }

  async ngOnInit() {
    this.dataService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    await this.getOders();
  }

  async getOders() {
    this.orders = await this.dataService.getOrders();
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLocaleLowerCase()) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  viewOrderDetails(orderId: any): void {
    this.router.navigate(['/confirm-order-details', orderId]);
  }

  calculateTotalPrice(order: any) {
    return order.cardItems.reduce(
      (total: any, product: any) => total + product.quantity * product.price,
      0
    );
  }

  calculateTotalQuantity(order: any) {
    return order.cardItems.reduce(
      (total: any, product: any) => total + product.quantity,
      0
    );
  }
}
