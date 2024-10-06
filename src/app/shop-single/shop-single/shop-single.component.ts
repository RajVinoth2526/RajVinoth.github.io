import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-shop-single',
  templateUrl: './shop-single.component.html',
  styleUrls: ['./shop-single.component.css']
})
export class ShopSingleComponent implements OnInit {

  slides: any[] = [];
  selectedImageSrc: string = "";
  selectedImageAlt: string = "";
  products: any[] = [];
  items: any = [];

  @ViewChild('targetElement', { static: true }) targetElement!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {

  }

  ngOnInit(): void {
    this.dataService.productsData.subscribe((products: any) => {
      if (products === null) return

      this.products = products;
    })
    this.route.paramMap.subscribe(params => {

      if (history.state.objectData && history.state && history.state.objectData) {
        localStorage.setItem('navigatedProduct', JSON.stringify(history.state.objectData.imageUrl));
        this.items = history.state.objectData.imageUrl
      } else {
        const navigatedProduct = localStorage.getItem('navigatedProduct');
        if (navigatedProduct) {
          this.items = JSON.parse(navigatedProduct);
        }
      }
    });
    this.generateSlides();
    this.selectedImageSrc = this.items[0];
    this.selectedImageAlt = this.items[0];
    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   // Check if URL after redirects is defined
    //   if (event.urlAfterRedirects) {
    //     // Scroll to top of the page
    //     window.scrollTo(0, 0);
    //   }
    // });
    this.scrollToElement();


  }

  generateSlides() {
    this.slides = [];
    for (let i = 0; i < this.items.length; i += 3) {
      this.slides.push(this.items.slice(i, i + 3));
    }
  }

  updateSelectedImage(src: string, alt: string) {
    this.selectedImageSrc = src;
    this.selectedImageAlt = alt;
  }

  scrollToElement() {
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  
  navigateWithObject(product: any) {
    localStorage.setItem('navigatedProduct', JSON.stringify(product.imageUrl));
    this.items = [];
    this.items = product.imageUrl;
    this.generateSlides();
    this.selectedImageSrc = this.items[0];
    this.selectedImageAlt = this.items[0];
    this.scrollToElement();
  }

}
