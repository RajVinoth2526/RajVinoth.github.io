import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';  
import { DataService } from 'src/app/service/dataService/data.service';
import { Router } from '@angular/router';
export const Categories= [
  {
      category : 'men',
      id : 1
  },
  {
      category : 'women',
      id : 2
  }
];

export const subCategories= [
  {
      subCategory : 'casual',
      id : 1
  },
  {
    subCategory : 'formal',
      id : 2
  }
];

export const type = [
  {
      type : 't-shirt',
      id : 1
  },
  {
    type : 'shirt',
      id : 2
  },
  {
    type : 'denim',
      id : 3
  }, {
    type : 'accessories',
      id : 4
  }
];

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFiles: any [] = [];
  showSelectedFiles: any [] = [];
  selectedIndex: number = 0;
  defaultImageId: string = '';
  title: string = '';
  subTitle: string = '';
  specification: string = '';  
  colors: string = '';
  contant: string = '';
  selectedFile!: File;
  setupOption: string = '';
  price: number = 0;
  size: string = '';
  label: string = '';
  description: string = '';
  categoryId: number = 0;
  subCategoryId: number = 0;
  typeId: number = 0;
  primaryColor: string = '#6366f1';  // Modern default primary color
  secondaryColor: string = '#ec4899';  // Modern default secondary color
  predefinedPalettes = [
    { name: 'Indigo Pink', primary: '#6366f1', secondary: '#ec4899' },
    { name: 'Blue Amber', primary: '#3b82f6', secondary: '#f59e0b' },
    { name: 'Green Purple', primary: '#10b981', secondary: '#8b5cf6' },
    { name: 'Red Blue', primary: '#ef4444', secondary: '#3b82f6' },
    { name: 'Teal Rose', primary: '#14b8a6', secondary: '#f43f5e' },
    { name: 'Purple Green', primary: '#8b5cf6', secondary: '#22c55e' },
    { name: 'Monochrome', primary: '#1f2937', secondary: '#6b7280' }
  ];
  shopName: string = '';
  email!: string;
  phoneNumber!: string;
  address!: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
  isDarkMode: boolean = false;
  systemTheme: 'light' | 'dark' = 'light';
  
  // Additional Product Fields
  sku: string = '';  // Stock Keeping Unit
  stockQuantity: number = 0;  // Available stock
  weight: number = 0;  // Product weight
  dimensions: string = '';  // L x W x H
  material: string = '';  // Product material
  careInstructions: string = '';  // Care instructions
  tags: string = '';  // Search tags
  isActive: boolean = true;  // Product status
  isFeatured: boolean = false;  // Featured product
  discountPercentage: number = 0;  // Discount percentage
  compareAtPrice: number = 0;  // Original price for comparison
  seoTitle: string = '';  // SEO meta title
  seoDescription: string = '';  // SEO meta description
  
  // Multiple Colors Support
  productColors: Array<{id: string, name: string, hex: string, quantity: number, image?: string}> = [];
  newColorName: string = '';
  newColorHex: string = '#000000';
  newColorQuantity: number = 0;
  showColorPicker: boolean = false;


  
  constructor(private firestore: AngularFirestore,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
  private dataService: DataService,
  private router: Router  ) {
    this.dataService.currentUser.subscribe((data) => {
      if(data ==null)   
        this.router.navigate(['']);
    })
   }
  ngOnInit(): void {
    this.primaryColor = this.dataService.getThemeColor()[0]?.primaryColor || '#6366f1';
    this.secondaryColor = this.dataService.getThemeColor()[0]?.secondaryColor || '#ec4899';
    
    // Detect system theme
    this.detectSystemTheme();
    this.applySystemTheme();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectSystemTheme();
  }

  private detectSystemTheme(): void {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.systemTheme = 'dark';
      this.isDarkMode = true;
    } else {
      this.systemTheme = 'light';
      this.isDarkMode = false;
    }
  }

  private applySystemTheme(): void {
    const root = document.documentElement;
    
    if (this.isDarkMode) {
      root.classList.add('dark-theme');
      root.style.setProperty('--background-color', '#0f172a');
      root.style.setProperty('--surface-color', '#1e293b');
      root.style.setProperty('--text-primary', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
    } else {
      root.classList.remove('dark-theme');
      root.style.setProperty('--background-color', '#f8fafc');
      root.style.setProperty('--surface-color', '#ffffff');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
    }
  }
  onFilesDropped(event: any): void {

    if((this.setupOption == 'catergories' || this.setupOption == 'SliderShow' ) && this.selectedFiles.length == 1) {
      event.preventDefault();
      this.toastr.warning('Can not add more than one image !');
      return
    } else {
      event.preventDefault();
      const files = event.dataTransfer.files;
      this.handleFiles(files);
    }
  
  }

  onDragOver(event: any): void {
    event.preventDefault();
  }

  onFilesSelected(event: any): void {
    if((this.setupOption == 'catergories' || this.setupOption == 'SliderShow' ) && this.selectedFiles.length == 1) {
      return
    } else {
      const files = event.target.files;
      this.handleFiles(files);
    }
   
  }

  onShopNameChange(event: Event): void {
    const input = event.target as HTMLInputElement; // Get the input element
    this.shopName = input.value; // Update shopName with the input value
  }

  onPrimaryColorChange(event: string) {
    this.primaryColor = event;
  }

  onSecondaryColorChange(event: string) {
    this.secondaryColor = event;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.systemTheme = this.isDarkMode ? 'dark' : 'light';
    this.applySystemTheme();
  }

  applyPalette(palette: any): void {
    this.primaryColor = palette.primary;
    this.secondaryColor = palette.secondary;
  }

  clearProductForm(): void {
    // Reset all product fields
    this.title = '';
    this.sku = '';
    this.label = '';
    this.stockQuantity = 0;
    this.price = 0;
    this.compareAtPrice = 0;
    this.discountPercentage = 0;
    this.colors = '';
    this.size = '';
    this.material = '';
    this.weight = 0;
    this.dimensions = '';
    this.description = '';
    this.specification = '';
    this.careInstructions = '';
    this.tags = '';
    this.seoTitle = '';
    this.seoDescription = '';
    this.isActive = true;
    this.isFeatured = false;
    this.categoryId = 0;
    this.subCategoryId = 0;
    this.typeId = 0;
    this.selectedIndex = 0;
    this.defaultImageId = '';
    
    // Reset colors
    this.productColors = [];
    this.newColorName = '';
    this.newColorHex = '#000000';
    this.newColorQuantity = 0;
    this.showColorPicker = false;
  }

  // Color Management Methods
  addColor(): void {
    if (this.newColorName.trim() && this.newColorHex && this.newColorQuantity > 0) {
      const colorId = uuidv4();
      this.productColors.push({
        id: colorId,
        name: this.newColorName.trim(),
        hex: this.newColorHex,
        quantity: this.newColorQuantity
      });
      
      // Reset form
      this.newColorName = '';
      this.newColorHex = '#000000';
      this.newColorQuantity = 0;
      this.showColorPicker = false;
      
      this.toastr.success('Color added successfully!');
    } else {
      this.toastr.warning('Please enter color name, select a color, and specify quantity');
    }
  }

  removeColor(colorId: string): void {
    this.productColors = this.productColors.filter(color => color.id !== colorId);
    this.toastr.info('Color removed');
  }

  updateColorHex(colorId: string, newHex: string): void {
    const color = this.productColors.find(c => c.id === colorId);
    if (color) {
      color.hex = newHex;
    }
  }

  updateColorName(colorId: string, newName: string): void {
    const color = this.productColors.find(c => c.id === colorId);
    if (color) {
      color.name = newName;
    }
  }

  updateColorQuantity(colorId: string, newQuantity: number): void {
    const color = this.productColors.find(c => c.id === colorId);
    if (color) {
      color.quantity = newQuantity;
    }
  }

  toggleColorPicker(): void {
    this.showColorPicker = !this.showColorPicker;
  }

  getColorsAsString(): string {
    return this.productColors.map(color => color.name).join(', ');
  }

  getColorsAsArray(): Array<{name: string, hex: string, quantity: number}> {
    return this.productColors.map(color => ({
      name: color.name,
      hex: color.hex,
      quantity: color.quantity
    }));
  }


  private handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
      const file = files[i];
      const fileName = file.name; // Get the file name
      this.readFile(file, fileName); // Pass both file and file name to readFile

   //   const file = files[i];
   // const reader = new FileReader();

    // reader.onload = (e: any) => {
    //   const img = new Image();
    //   img.onload = () => {
    //     const canvas = document.createElement('canvas');
    //     const ctx = canvas.getContext('2d')!;
    //     canvas.width = 600;
    //     canvas.height = 800;
    //     ctx.drawImage(img, 0, 0, 600, 800);
    //     canvas.toBlob((blob) => {
    //       const resizedFile = new File([blob!], file.name, { type: 'image/jpeg', lastModified: Date.now() });
    //       // Now you can use `resizedFile` as the resized image
    //       this.selectedFiles.push(resizedFile);
    //     }, 'image/jpeg');
    //   };
    //   img.src = e.target.result;
    // };

    //reader.readAsDataURL(file);
    }
  }
  private readFile(file: File, fileName: string): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      // Now you have both the file name and content, you can handle them as needed
      this.showSelectedFiles.push({ name: fileName, content: fileContent });
    };
    reader.readAsDataURL(file);
  }
  deselectImage(index: number): void {
    this.showSelectedFiles.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    
    // Adjust selectedIndex if needed
    if (this.selectedIndex >= this.showSelectedFiles.length) {
      this.selectedIndex = Math.max(0, this.showSelectedFiles.length - 1);
    }
    
    // Update default image ID if needed
    this.updateDefaultImageId();
  }

  setDefaultImage(index: number): void {
    this.selectedIndex = index;
    this.updateDefaultImageId();
    this.toastr.info(`Image ${index + 1} set as default`);
  }

  updateDefaultImageId(): void {
    if (this.showSelectedFiles.length > 0 && this.selectedIndex < this.showSelectedFiles.length) {
      this.defaultImageId = `default_${this.selectedIndex}`;
    } else {
      this.defaultImageId = '';
    }
  }

  reorderImages(fromIndex: number, toIndex: number): void {
    // Move image in the array
    const image = this.showSelectedFiles.splice(fromIndex, 1)[0];
    const file = this.selectedFiles.splice(fromIndex, 1)[0];
    
    this.showSelectedFiles.splice(toIndex, 0, image);
    this.selectedFiles.splice(toIndex, 0, file);
    
    // Update selectedIndex if it was affected by the reorder
    if (this.selectedIndex === fromIndex) {
      this.selectedIndex = toIndex;
    } else if (fromIndex < this.selectedIndex && toIndex >= this.selectedIndex) {
      this.selectedIndex--;
    } else if (fromIndex > this.selectedIndex && toIndex <= this.selectedIndex) {
      this.selectedIndex++;
    }
    
    this.updateDefaultImageId();
  }
  // onFilesSelected(event: any) {
  //   const files: FileList = event.target.files;
  //   for (let i = 0; i < files.length; i++) {
  //     this.selectedFiles.push(files[i]);
  //   }
  // }

  

  openImagePicker() {
    // Trigger click event on the input element to open the file picker dialog
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  selectImage(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = -1; // Deselect if already selected
    } else {
      this.selectedIndex = index;
    }
  }


  openFileInput(): void {
    this.fileInput.nativeElement.click(); // Access nativeElement to trigger click event
  }

   findCategoryById(id: number) {
    for (let i = 0; i < Categories.length; i++) {
        if (Categories[i].id == id) {
            return Categories[i].category;
        }
    }
    return null; // Return null if no category with the given id is found
  }

  findSubCategoryId(id: number) {
    for (let i = 0; i < subCategories.length; i++) {
        if (subCategories[i].id == id) {
            return subCategories[i].subCategory;
        }
    }
    return null; // Return null if no category with the given id is found
  }

  findTypeId(id: number) {
    for (let i = 0; i < type.length; i++) {
        if (type[i].id == id) {
            return type[i].type;
        }
    }
    return null; // Return null if no category with the given id is found
  }



  async uploadProduct(): Promise<void> {
    // Step 1: Upload image to Firebase Storage
    this.spinner.show();
   let imageURLs : any [] = [];
   const promises = this.selectedFiles.map(async (img) => {
    const filePath = `product-images/${Date.now()}_${img.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, img);

    // Get the download URL of the uploaded image
    const imageUrl = await task.snapshotChanges().toPromise().then(async () => {
        return await fileRef.getDownloadURL().toPromise();
    }).catch(error => {
        console.error('Error uploading image:', error);
        throw error;
    });

    return imageUrl;
});
   // Wait for all promises to resolve
   const resolvedURLs = await Promise.all(promises);
   imageURLs.push(...resolvedURLs);


    // Step 3: Save product details to Firebase Firestore

    if (this.setupOption == 'catergories') {
      
      const productId = uuidv4();
      this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).doc(productId).set({
        title: this.title,
        category : this.findCategoryById(this.categoryId),
        imageUrl: imageURLs,
        productId : productId

      }).then(() => {
        this.spinner.hide();
        this.selectedFiles = [];
        this.showSelectedFiles = [];
        this.toastr.success(this.setupOption + 'details uploaded successfully.');
        console.log('Product details uploaded successfully.');
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });

    } else if(this.setupOption == 'SliderShow') {
      // Inside your component:
      const productId = uuidv4();
      this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).doc(productId).set({
        title: this.title,
        subTitle: this.subTitle,
        specification: this.specification,
        colors: this.colors,
        category : this.findCategoryById(this.categoryId),
        contant: '',
        imageUrl: imageURLs,
        productId : productId

      }).then(() => {
        this.spinner.hide();
        this.selectedFiles = [];
        this.showSelectedFiles = [];
        this.toastr.success(this.setupOption + 'details uploaded successfully.');
        console.log('Product details uploaded successfully.');
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'product') {
      const productId = uuidv4();
      this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).doc(productId).set({
        // Basic Information
        title: this.title,
        sku: this.sku,
        label: this.label,
        stockQuantity: this.stockQuantity,
        
        // Pricing
        price: this.price,
        compareAtPrice: this.compareAtPrice,
        discountPercentage: this.discountPercentage,
        
        // Product Details
        colors: this.getColorsAsString(), // Backward compatibility
        colorsArray: this.getColorsAsArray(), // New structured colors
        size: this.size,
        material: this.material,
        weight: this.weight,
        dimensions: this.dimensions,
        
        // Descriptions
        description: this.description,
        specification: this.specification,
        careInstructions: this.careInstructions,
        
        // Categories
        category: this.findCategoryById(this.categoryId),
        subCategory: this.findSubCategoryId(this.subCategoryId),
        type: this.findTypeId(this.typeId),
        
        // SEO & Marketing
        tags: this.tags,
        seoTitle: this.seoTitle,
        seoDescription: this.seoDescription,
        
        // Product Status
        isActive: this.isActive,
        isFeatured: this.isFeatured,
        
        // Images
        imageUrl: imageURLs,
        defaultImageIndex: this.selectedIndex,
        
        // Metadata
        productId: productId,
        createdAt: new Date(),
        updatedAt: new Date()

      }).then(() => {
        this.spinner.hide();
        this.selectedFiles = [];
        this.showSelectedFiles = [];
        this.toastr.success('Product uploaded successfully!');
        console.log('Product details uploaded successfully.');
        this.clearProductForm();
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning('Failed to upload product: ' + error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'themeColor') {
      const productId = uuidv4();
      this.firestore.collection('Theme').doc('Theme-colors').set({
        primaryColor: this.primaryColor,
        secondaryColor: this.secondaryColor

      }).then(async () => {
        let theme;
        const getThemePromise = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('Theme').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });
        theme = await getThemePromise;
        this.dataService.updateThemeColor(theme);
        document.documentElement.style.setProperty('--primary-color', this.dataService.getThemeColor()[0].primaryColor);
        document.documentElement.style.setProperty('--secondary-color', this.dataService.getThemeColor()[0].secondaryColor);
        this.spinner.hide();
    
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'shopName') {
      this.firestore.collection('ShopName').doc('Shop-Name').set({
        shopName: this.shopName,
        secondaryColor: this.secondaryColor

      }).then(async () => {
        let shopName;
        const getShopName = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('ShopName').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });
        shopName = await getShopName;
        this.dataService.shopName.next(shopName);
        this.spinner.hide();
    
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'contactDetails') {
      this.firestore.collection('contactDetail').doc('contactDetail').set({
        email : this.email,
        phoneNumber: this.phoneNumber,
        address: this.address,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country

      }).then(async () => {
        let contactDetail;
        const contactDetails = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('contactDetail').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });
        contactDetail = await contactDetails;
        this.dataService.shopContactDetails$.next(contactDetail);

        this.spinner.hide();
    
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    }
  } 
}
