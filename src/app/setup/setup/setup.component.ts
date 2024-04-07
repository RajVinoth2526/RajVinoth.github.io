import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  title: string = '';
  subTitle: string = '';
  contant: string = '';
  selectedFile!: File;
  setupOption: string = '';
  price : number = 0;
  size : string = '';
  label : string = '';
  description : string = '';
  type : string = '';
  constructor( private firestore: AngularFirestore,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }
  ngOnInit(): void {
  }

  onFileSelected(event : any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


    async uploadProduct(): Promise<void> {
      // Step 1: Upload image to Firebase Storage
      if (!this.selectedFile) {
        console.error('No file selected.');
        return;
      }
  
      const filePath = `product-images/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);
  
      // Step 2: Get the download URL of the uploaded image
      const imageUrl = await task.snapshotChanges().toPromise().then(async () => {
        return await fileRef.getDownloadURL().toPromise();
      }).catch(error => {
        console.error('Error uploading image:', error);
        throw error;
      });
  
      // Step 3: Save product details to Firebase Firestore

      if(this.setupOption == 'catergories') {
       
        this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).add({
          title: this.title,
          imageUrl: imageUrl
        
        }).then(() => {
          console.log('Product details uploaded successfully.');
        }).catch(error => {
          console.error('Error uploading product details:', error);
        });
      } else {
        this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).add({
          title: this.title,
        subTitle: this.subTitle,
        contant: this.contant,
        imageUrl: imageUrl
        
        }).then(() => {
          console.log('Product details uploaded successfully.');
        }).catch(error => {
          console.error('Error uploading product details:', error);
        });
        
      }
      
      
    }
  

}
