import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService/data.service';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any;
  displayedColumns: string[] = ['position', 'name'];

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.authService.authState.subscribe(async (user) => {
      if (user) {
        this.orders = await this.dataService.getOrdersByUserId(user.id);
      }
    });
  }

  convertToDate(createdAt: any) {
    if (createdAt?.seconds) {
      const milliseconds = (createdAt.seconds * 1000) + (createdAt.nanoseconds / 1_000_000);
      return new Date(milliseconds);
    }
    return new Date(createdAt);
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

  getTotalAmount(order: any): number {
    if (Array.isArray(order.card)) {
      return order.card.reduce((total: any, product: any) => total + product.quantity * product.price, 0);
    } else {
      return order.card.quantity * order.card.price;
    }
  }

  viewOrderDetails(productId: any): void {
    this.router.navigate(['/product', productId]);
  }
}
