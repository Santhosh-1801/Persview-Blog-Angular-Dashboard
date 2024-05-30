import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  userEmail!:string;
  isLoggedIn$!:Observable<boolean>;

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      this.userEmail=JSON.parse(userString).email;
    }
    this.isLoggedIn$=this.authService.isLoggedIn();
  }
  constructor(private authService:AuthService){

  }
  onLogOut(){
    this.authService.logOut()
  }
}
