import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  constructor(private _AuthService: AuthService, private _OrderService: OrderService,
    private _Router: Router) { }
  userId: string = '';
  loggedUser = false;
  allOrders: any;
  isAllOrders: boolean = false;
  ngOnInit(): void {

    /*Check if user is logged in  */
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) {
          this.loggedUser = true;
        } else { this.loggedUser = false; this._Router.navigate(['/home']) }
      }
    )

    this._OrderService.getUserOrders().subscribe({
      next: response => { this.allOrders = response.reverse() },
      error: err => {
        console.log(err);
      }
    })
  }
  /* to show all the previous orders not just the most recent */
  showAllOrders(): void {
    this.isAllOrders = true;
  }
  /* To show only the first order */
  showFirstOrder(): void {
    this.isAllOrders = false;
  }


}
