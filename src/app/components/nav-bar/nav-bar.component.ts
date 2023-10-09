import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any;
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  loggedUser: boolean = false;
  constructor(private _CartService: CartService, private _AuthService: AuthService) {
  }
  ngOnInit(): void {
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) {
          this.loggedUser = true;
        } else { this.loggedUser = false }
      }
    )
  }

  /* Close Cart Canvas (when direction to cart/home component) */
  closeCartCanvas(): void {
    this._CartService.closeCartCanvas();
  }

  /* LOGOUT Function! removes the token from the local storage and userData*/
  logout(): void {
    localStorage.removeItem('userToken');
    this._AuthService.userData.next('');
    console.log(this.loggedUser);
  }
}

