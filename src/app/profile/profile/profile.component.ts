import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) { }

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.userData = this.dataService.currentUser.getValue();
    } else {
      this.router.navigate(['login']);
    }
  }

  goToOrders() {
    this.router.navigate(['/my-orders']);
  }

  logout() {
    this.authService.signOut().then(() => {
      this.dataService.currentUser.next(null);
      this.router.navigate(['login']);
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }
}
