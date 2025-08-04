import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth/auth.service'
import { StorageService } from '../services/storage/storage.service'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isSpinning: boolean = false;
  loginForm!: FormGroup;
  errorMessage: string = ''; // ← Add this line

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.isSpinning = true;
    this.errorMessage = ''; // ← Clear previous error

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isSpinning = false;

        if (res.userId != null) {
          const user = {
            id: res.userId,
            name: res.name,
            role: res.userRole
          };

          StorageService.saveUser(user);
          StorageService.saveToken(res.jwt);

          if (StorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl('/admin/dashboard');
            return;
          }

          if (StorageService.isCustomerLoggedIn()) {
            this.router.navigateByUrl('/customer/dashboard');
            return;
          }

          this.errorMessage = 'Invalid user role.';
        } else {
          this.errorMessage = 'Email or Password Is Incorrect';
        }
      },
      error: (err) => {
        this.isSpinning = false;
        this.errorMessage = 'Email or Password Is Incorrect';
      }
    });
  }
}
