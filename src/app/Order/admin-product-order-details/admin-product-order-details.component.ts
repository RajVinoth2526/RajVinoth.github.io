import { Component, OnInit, Renderer2 } from '@angular/core';

interface Order {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-admin-product-order-details',
  templateUrl: './admin-product-order-details.component.html',
  styleUrls: ['./admin-product-order-details.component.css']
})
export class AdminProductOrderDetailsComponent implements OnInit {
  orders: Order[] = [
    { id: 1, customerName: 'John Doe', productName: 'Laptop', quantity: 1, price: 1200, status: 'Pending', paymentMethod: 'Cash' },
    { id: 2, customerName: 'Jane Smith', productName: 'Smartphone', quantity: 2, price: 800, status: 'Shipped', paymentMethod: 'Credit Card' },
  ];
  theme: any;

  constructor(private renderer: Renderer2) { 
    this.theme = {
      backgroundColor: '#210b12', // Specify background color
      textColor: '#210b12' // Specify text color
    };
  }

  ngOnInit(): void {
    //document.documentElement.style.setProperty('--primary-color', this.theme.primaryColor);
    
    
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'badge-warning';
      case 'Shipped':
        return 'badge-primary';
      case 'Delivered':
        return 'badge-success';
      case 'Cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  viewOrderDetails(orderId: number): void {
    console.log('Viewing details for order ID:', orderId);
  }
}
