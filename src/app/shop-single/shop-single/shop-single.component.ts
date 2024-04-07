import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shop-single',
  templateUrl: './shop-single.component.html',
  styleUrls: ['./shop-single.component.css']
})
export class ShopSingleComponent implements OnInit {

  slides: any[] = [];
  selectedImageSrc: string = "";
  selectedImageAlt: string = "";
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

  items = [
    { src: 'assets/img/product_single_01.jpg', alt: 'Product Image 1' },
    { src: 'assets/img/product_single_02.jpg', alt: 'Product Image 2' },
    { src: 'assets/img/product_single_03.jpg', alt: 'Product Image 3' },
    { src: 'assets/img/product_single_04.jpg', alt: 'Product Image 4' },
    { src: 'assets/img/product_single_05.jpg', alt: 'Product Image 5' },
    { src: 'assets/img/product_single_06.jpg', alt: 'Product Image 6' },
    { src: 'assets/img/product_single_07.jpg', alt: 'Product Image 7' },
    { src: 'assets/img/product_single_08.jpg', alt: 'Product Image 8' },
    { src: 'assets/img/product_single_09.jpg', alt: 'Product Image 9' }
  ];

  featuredProducts = [
    { name: 'Gym Weight', image: './assets/img/feature_prod_01.jpg', price: 240, reviews: 24 },
    { name: 'Cloud Nike Shoes', image: './assets/img/feature_prod_02.jpg', price: 480, reviews: 48 },
    { name: 'Summer Addides Shoes', image: './assets/img/feature_prod_03.jpg', price: 360, reviews: 74 },
    { name: 'Gym Weight', image: './assets/img/feature_prod_01.jpg', price: 240, reviews: 24 },
    { name: 'Gym Weight', image: './assets/img/feature_prod_01.jpg', price: 240, reviews: 24 },
  ];
  constructor(
    private router : Router,
    ) {
      this.generateSlides();
      this.selectedImageSrc = this.items[0].src;
      this.selectedImageAlt = this.items[0].alt;
     }

  ngOnInit(): void {
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

  generateSlides() {
    for (let i = 0; i < this.items.length; i += 3) {
      this.slides.push(this.items.slice(i, i + 3));
    }
  }

  updateSelectedImage(src: string, alt: string) {
    this.selectedImageSrc = src;
    this.selectedImageAlt = alt;
  }

  

}
