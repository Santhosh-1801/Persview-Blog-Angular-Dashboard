import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    
  }
  constructor(private authService:AuthService) {
    
  }
  onSubmit(formValues:any){
    this.authService.login(formValues.email,formValues.password)
  }
}
