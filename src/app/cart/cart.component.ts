import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthserviceService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { AddressService } from '../services/address.service';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnChanges {
  @Input() homeCartData: any;
  cartData: any;
  isAddress: Boolean = false;
  addresses: any;
  isLoading: boolean = false;
  constructor(
    private _CartService: CartService,
    private _ProductService: ProductsService, private _AddressService: AddressService,
    private _OrderService: OrderService
  ) { }
  ngOnInit(): void {
    this.getCart();
    this.getAddress();
  }
  ngOnChanges(changes: SimpleChanges): void {
    /* Get the new Cart after adding an item in the home to display it */
    if (!changes['homeCartData']['firstChange']) {
      this.getCart()
    }
  }
  /* Get the user's cart from the api to display it */
  getCart(): void {
    this._CartService.getCart().subscribe({
      next: (response) => {
        this.cartData = response.data;
      },
      error: (err) => console.log(err),
    });
  }
  /* Increment the number of items of specific product by one */

  addItem(id: string, event: Event): void {
    this._ProductService.addItem(id, event);
  }
  /* Decrement the number of items of specific product by one */
  removeItem(id: string, event: Event): void {
    this._ProductService.removeItem(id, event);
  }
  /* Update(change) the cart with the new counts of products */
  updateCart(event: Event): void {
    let inputs = $(event.target!).siblings('.data').find('input[title="count"]');

    for (let input of inputs) {
      let id: string = String($(input).attr('product.id'));
      let value = $(input).val()
      if (Number(value) == 0) {
        this.removeFromCart(id)

      } else if (Number(value) > 0) {
        let count: string = String(value);
        this._CartService.updateCart(id, count).subscribe({
          next: (response) => this.cartData = response.data,
          error: (err) => console.log(err)
        })
      }
    }
  }
  /* Remove a product from Cart */
  removeFromCart(id: string): void {
    this._CartService.removeItem(id).subscribe({
      next: (response) => {

        this.cartData = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  shippingAddressForm: FormGroup = new FormGroup({
    shippingAddress: new FormControl('0'),
    paymentMethod: new FormControl('cash')
  })

  /* Check if this user has addresses */
  checkAddresses(): void {
    if (this.addresses?.length) {
      this.isAddress = true;
    } else { this.isAddress = false }
  }
  /* Get the User Addresses from api/store the response in Addresses */
  getAddress(): void {
    this._AddressService.getAddresses().subscribe({
      next: (response) => {
        this.addresses = response.data;
        this.checkAddresses();
      },
      error: (err) => console.log(err)
    })
  }
  /* Collect the data of the chosen Address For Shipping */
  procceedPayment(shippingAddressForm: FormGroup): void {
    this.isLoading = true;
    const addressIndex = shippingAddressForm.value.shippingAddress;
    const paymentMethod = shippingAddressForm.value.paymentMethod;
    const cartId = this.cartData._id;
    if (addressIndex && cartId && paymentMethod) {
      const { details, phone, city } = this.addresses[addressIndex];
      let shippingAddress = { shippingAddress: { details, phone, city } };
      if (paymentMethod === 'cash') {
        this.createCashOrder(cartId, shippingAddress);
      } else if (paymentMethod === 'online') {
        this.checkOutOrder(cartId, shippingAddress);
      }
    }
  }

  createCashOrder(cartId: string, shippingAddress: object): void {
    this._OrderService.createCashOrder(cartId, shippingAddress).subscribe({
      next: (response) => {
        console.log(response);
        this._OrderService.userId.next(response.data.user);
        this.isLoading = false;
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }
  checkOutOrder(cartId: string, shippingAddress: object): void {
    this._OrderService.checkOutOrder(cartId, shippingAddress).subscribe({
      next: response => {
        window.location.href = response.session.url;
        console.log(response);
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
