import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  name!: any;

  @Inject(MAT_DIALOG_DATA) data!: any
  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.name = this.data;
  }

  deleteProduct(productId: any) {
    this.api.deleteProduct(productId).subscribe({
      next: () => this.toastr.success(' product deleted successfully.'),
      error: (error) => this.toastr.warning(error)
    });
  }

  CloseDialog(flag: boolean) {
    this._mdr.close(flag);
  }
}
