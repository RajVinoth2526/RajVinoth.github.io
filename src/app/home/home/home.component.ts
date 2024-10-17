import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/dataService/data.service';
// carousel-item.model.ts
export interface CarouselItem {
  imgSrc: string;
  title: string;
  subtitle: string;
  content: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any = [];
  Categories: any = [];
  mainSliders: any = [];
  isAdmin: boolean = true;
  categories: any = [
    // { name: 'Dresses', image: './assets/img/category_img_01.jpg' },
    // { name: 'Shoes', image: './assets/img/category_img_02.jpg' },
    // { name: 'Accessories', image: './assets/img/category_img_03.jpg' },
    // Add more categories as needed
  ];
  products2 = [
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
  

  featuredProducts = [
    { name: 'Gym Weight', image: './assets/img/feature_prod_01.jpg', price: 240, reviews: 24 },
    { name: 'Cloud Nike Shoes', image: './assets/img/feature_prod_02.jpg', price: 480, reviews: 48 },
    { name: 'Summer Addides Shoes', image: './assets/img/feature_prod_03.jpg', price: 360, reviews: 74 },
    { name: 'Gym Weight', image: './assets/img/feature_prod_01.jpg', price: 240, reviews: 24 },
    { name: 'Gym Weight', image: './assets/img/feature_prod_01.jpg', price: 240, reviews: 24 },
  ];

  itemsPerRow: number = 2;
  constructor(
    private dataService: DataService,
    private router: Router,
    private firestore: AngularFirestore,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    //this.fetchData();
    this.dataService.mainSliderData.subscribe((sliders : any) => {
      if (sliders === null) return
      
      this.mainSliders = sliders;

    });

    this.dataService.categoryData.subscribe((category : any) => {
      if (category === null) return
      
      this.categories = category;

    })

    this.dataService.productsData.subscribe((products : any) => {
      if (products === null) return
      
      this.products = products;

    })
    

  }

  resetAnimation() {
    // Toggle the 'fade-in' class to reset animation
    const elements = this.elementRef.nativeElement.querySelectorAll('.fade-in');
    elements.forEach((element: HTMLElement) => {
      this.renderer.removeClass(element, 'fade-in');
      setTimeout(() => {
        this.renderer.addClass(element, 'fade-in');
      }, 10); // Delay to trigger reapply animation
    });
  }

  navigateWithObject(product: any) {
    this.router.navigate(['/product'], {
      state: { objectData: product }
    });
  }


}
