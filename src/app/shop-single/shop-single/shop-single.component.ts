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
  availableColors: string[] = [];
  availableColorsArray: Array<{name: string, hex: string, quantity: number}> = [];
  selectedProduct: any;
  quantity: number = 1;
  productSize: string = '';
  selectedColor: string = '';
  selectedColorObject: {name: string, hex: string, quantity: number} | null = null;
  productId = 'S';

  @ViewChild('targetElement', { static: true }) targetElement!: ElementRef;
  fromShopSingle = true;
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
    this.updateSize('S');
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


  }

  triggerProductByid(productId: string) {
    this.getProductByParamId(productId);
  }

  async getProductByParamId(productId?: string) {
    this.availableColors = [];
    this.availableColorsArray = [];
    if(productId) {
      this.productId = productId;
    } else {
      this.productId = this.route.snapshot.paramMap.get('id')!;
    }

    this.selectedProduct =  await this.dataService.getProductById(this.productId);
    
    // Handle both old and new color formats
    if (this.selectedProduct?.colorsArray && this.selectedProduct.colorsArray.length > 0) {
      // New structured format
      this.availableColorsArray = this.selectedProduct.colorsArray;
      this.selectedColorObject = this.availableColorsArray[0];
      this.selectedColor = this.selectedColorObject.name;
      this.availableColors = this.availableColorsArray.map(color => color.hex);
    } else if (this.selectedProduct?.colors) {
      // Old format - backward compatibility
      this.availableColors = this.selectedProduct.colors.split(",").map((c: string) => c.trim());
      this.selectedColor = this.availableColors[0];
      // Convert to new format for consistency
      this.availableColorsArray = this.availableColors.map((color: string, index: number) => ({
        name: color,
        hex: this.getDefaultColorHex(color, index),
        quantity: 0 // Default quantity for old format
      }));
      this.selectedColorObject = this.availableColorsArray[0];
    }
    
    this.items = this.selectedProduct.imageUrl;
    this.generateSlides();
    
    // Set default image based on defaultImageIndex
    const defaultIndex = this.selectedProduct.defaultImageIndex || 0;
    this.selectedImageSrc = this.items[defaultIndex] || this.items[0];
    this.selectedImageAlt = this.items[defaultIndex] || this.items[0];
    this.scrollToElement();
    
  }


  updateQuantity(operator: string) {
    if(operator === '+' && this.quantity < 15) {
      this.quantity += 1;
    } else if( this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  selectColor(color: string, product: any): void {
    this.selectedColor = color;
    product.color = color;
    console.log('Selected Color:', this.selectedColor);
  }

  selectColorFromArray(colorObject: {name: string, hex: string, quantity: number}) {
    this.selectedColorObject = colorObject;
    this.selectedColor = colorObject.name;
    this.selectedProduct.color = colorObject.name;
    console.log('Selected Color Object:', this.selectedColorObject);
  }

  // Helper method to check if color is in stock
  isColorInStock(colorObject: {name: string, hex: string, quantity: number}): boolean {
    return colorObject.quantity > 0;
  }

  // Helper method to provide default hex colors for old format
  getDefaultColorHex(colorName: string, index: number): string {
    const colorMap: {[key: string]: string} = {
      'red': '#ef4444',
      'blue': '#3b82f6', 
      'green': '#22c55e',
      'yellow': '#eab308',
      'black': '#000000',
      'white': '#ffffff',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'navy': '#1e3a8a',
      'navy blue': '#1e3a8a',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'orange': '#f97316',
      'brown': '#a3a3a3'
    };

    const lowerColor = colorName.toLowerCase();
    if (colorMap[lowerColor]) {
      return colorMap[lowerColor];
    }

    // Default color palette for unknown colors
    const defaultColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#f97316', '#6b7280'];
    return defaultColors[index % defaultColors.length];
  }
  
  navigateWithObjectToConfirmOrder() {
    this.selectedProduct.quantity = this.quantity;
    this.selectedProduct.size = this.productSize;
    this.selectedProduct.color = this.selectedColor;
    this.selectedProduct.image = this.selectedProduct.imageUrl[0];
    this.selectedProduct.name = this.selectedProduct.title;
    this.selectedProduct.id = this.selectedProduct.productId;

    const data = [this.selectedProduct];
    this.router.navigateByUrl('/confirm-order', { state: { data } });
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
    this.scrollToElement();

  }

  scrollToElement() {
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  
  navigateWithObject(product: any) {
    this.router.navigate(['/product',product.productId], {
      state: { objectData: product }
    });
  }

  async addProductTocard(product: any ) {
    product.size = this.productSize;
    product.quantity =  this.quantity;
    product.color = this.selectedColor;
    this.spinner.show();
    await this.dataService.addProduct(product);
    this.spinner.hide();

  }

}
