import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from 'src/app/service/dataService/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
  selectedProduct: any;
  quantity: number = 1;
  productSize: string = '';
  productId!: string;

  @ViewChild('targetElement', { static: true }) targetElement!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
    
  ) {

  }

  ngOnInit(): void {
    this.getProductByParamId();
    this.dataService.productsData.subscribe((products: any) => {
      if (products === null) return

      this.products = products;
    })
  
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if URL after redirects is defined
      if (event.urlAfterRedirects) {
        // Scroll to top of the page
        window.scrollTo(0, 0);
      }
    });
    this.scrollToElement();


  }

  async getProductByParamId() {
    this.productId = this.route.snapshot.paramMap.get('id')!;;
    this.selectedProduct =  await this.dataService.getProductById(this.productId);
    this.items = this.selectedProduct.imageUrl;
    this.generateSlides();
    this.selectedImageSrc = this.items[0];
    this.selectedImageAlt = this.items[0];
  }

  updateQuantity(operator: string) {
    if(operator === '+' && this.quantity < 15) {
      this.quantity += 1;
    } else if( this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  updateSize(size: string) {
    this.productSize = size;
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
    this.selectedProduct = product;
    localStorage.setItem('navigatedProduct', JSON.stringify(product.imageUrl));
    this.items = [];
    this.items = product.imageUrl;
    this.generateSlides();
    this.selectedImageSrc = this.items[0];
    this.selectedImageAlt = this.items[0];
    this.scrollToElement();
  }

  async addProductTocard(product: any ) {
    product.size = this.productSize;
    product.quantity =  this.quantity;
    this.spinner.show();
    await this.dataService.addProduct(product);
    this.spinner.hide();

  }

}
