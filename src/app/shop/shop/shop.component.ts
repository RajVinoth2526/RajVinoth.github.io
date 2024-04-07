import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products = [
    {
      name: 'Product 1',
      image: 'assets/img/shop_01.jpg',
      colors: ['#ff0000', '#0000ff', '#000000'], // Example colors
      stars: [1, 2, 3],
      emptyStars: [1, 2],
      price: '$250.00'
    },
    {
      name: 'Product 2',
      image: 'assets/img/shop_02.jpg',
      colors: ['#00ff00', '#ffff00', '#ff00ff'], // Example colors
      stars: [1, 2, 3],
      emptyStars: [1, 2],
      price: '$300.00'
    },
    {
    name: 'Product 3',
    image: 'assets/img/shop_03.jpg',
    colors: ['#00ff00', '#ffff00', '#ff00ff'], // Example colors
    stars: [1, 2, 3],
    emptyStars: [1, 2],
    price: '$300.00'
    },
    {
      name: 'Product 4',
      image: 'assets/img/shop_04.jpg',
      colors: ['#00ff00', '#ffff00', '#ff00ff'], // Example colors
      stars: [1, 2, 3],
      emptyStars: [1, 2],
      price: '$300.00'
    },
    {
      name: 'Product 5',
      image: 'assets/img/shop_05.jpg',
      colors: ['#ff0000', '#0000ff', '#000000'], // Example colors
      stars: [1, 2, 3],
      emptyStars: [1, 2],
      price: '$250.00'
    },
    {
      name: 'Product 6',
      image: 'assets/img/shop_06.jpg',
      colors: ['#00ff00', '#ffff00', '#ff00ff'], // Example colors
      stars: [1, 2, 3],
      emptyStars: [1, 2],
      price: '$300.00'
    },
    {
    name: 'Product 7',
    image: 'assets/img/shop_07.jpg',
    colors: ['#00ff00', '#ffff00', '#ff00ff'], // Example colors
    stars: [1, 2, 3],
    emptyStars: [1, 2],
    price: '$300.00'
    },
    {
      name: 'Product 8',
      image: 'assets/img/shop_08.jpg',
      colors: ['#00ff00', '#ffff00', '#ff00ff'], // Example colors
      stars: [1, 2, 3],
      emptyStars: [1, 2],
      price: '$300.00'
    }
    // Add more products as needed
  ];
  constructor(private router: Router) { }

  ngOnInit(): void {
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

}
