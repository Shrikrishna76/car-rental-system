import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from './auth/components/services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'car-rental-angular';

  isCustomerLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;
  loggedInUserName: string = '';
  isHomeRoute: boolean = false;
  showNavbar: boolean = false;
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects || event.url;
        this.updateLoginStatus();

        const isAuthPage = ['/login', '/register'].includes(this.currentRoute);
        this.isHomeRoute = this.currentRoute === '/';
        this.showNavbar = !isAuthPage && !this.isHomeRoute && (this.isAdminLoggedIn || this.isCustomerLoggedIn);
      }
    });

    // On first load
    this.currentRoute = this.router.url;
    const isAuthPage = ['/login', '/register'].includes(this.currentRoute);
    this.updateLoginStatus();
    this.isHomeRoute = this.currentRoute === '/';
    this.showNavbar = !isAuthPage && !this.isHomeRoute && (this.isAdminLoggedIn || this.isCustomerLoggedIn);
  }

  updateLoginStatus() {
    this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn();
    this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
    this.loggedInUserName = StorageService.getUserName();
  }

  logout() {
    StorageService.logout();
    this.router.navigateByUrl('/login');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  isAuthPage(): boolean {
    return this.currentRoute === '/login' || this.currentRoute === '/register';
  }
}
