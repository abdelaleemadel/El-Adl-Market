import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  constructor(private _AuthService: AuthService, private _OrderService: OrderService) { }
  userId: string = '';
  allOrders: any;
  isAllOrders: boolean = false;
  ngOnInit(): void {
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
