import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataService } from '../service/dataService/data.service';

@Component({
  selector: 'app-confirm-order-details',
  templateUrl: './confirm-order-details.component.html',
  styleUrls: ['./confirm-order-details.component.css']
})
export class ConfirmOrderDetailsComponent implements OnInit {
  order: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getProductByParamId();
  }

  async getProductByParamId() {
    const orderId = this.route.snapshot.paramMap.get('id')!;;
    this.order =  await this.dataService.getOrderById(orderId);
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

  onStatusChange(order: any) {
    if(order && order.cardItems.length > 0) {
      order.cardItems.forEach((card: any) => {
        card.status = order.cardItems[0].status;
      })
    }
    this.dataService.updateOrder(order);
  }

  getTotalAmount(order: any): number {
    return order.cardItems.reduce(
      (total:any, product:any) => total + product.quantity * product.price,
      0
    );
  }

  viewOrderDetails(productId: any): void {
    this.router.navigate(['/product',productId]);
  }
  orderDetails = {
    orderId: 'ORD12345',
    customerName: 'John Doe',
    customerEmail: 'johndoe@example.com',
    customerPhone: '+123456789',
    orderDate: new Date(),
    paymentMethod: 'Credit Card',
    status: 'Pending',
    products: [
      {
        name: 'Product A',
        quantity: 2,
        price: 100,
        image: 'https://via.placeholder.com/60'
      },
      {
        name: 'Product B',
        quantity: 1,
        price: 200,
        image: 'https://via.placeholder.com/60'
      },
      {
        name: 'Product C',
        quantity: 3,
        price: 150,
        image: 'https://via.placeholder.com/60'
      }
    ]
  };



}
