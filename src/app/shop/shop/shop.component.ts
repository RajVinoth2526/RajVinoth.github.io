import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation/confirmation.component';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  isAdmin: boolean = true;
  products: any = [];
  isDeleteButtonClicked: boolean = false;
  matDialogRef!: MatDialogRef<ConfirmationComponent>;

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataService.productsData.subscribe((products: any) => {
      if (products === null) return;
      this.products = products;
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects) {
        window.scrollTo(0, 0);
      }
    });
  }

  navigateWithObject(product: any) {
    this.router.navigate(['/product', product.productId], {
      state: { objectData: product }
    });
  }

  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }

  cancelDelete() {
    this.isDeleteButtonClicked = false;
  }
}
