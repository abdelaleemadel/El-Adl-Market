import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { AddressService } from '../../services/address.service';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartData: any;
  loggedUser: boolean = false;
  isAddress: Boolean = false;
  addresses: any;
  isCartEmpty: any = false;
  isLoading: boolean = false;
  constructor(
    private _CartService: CartService,
    private _ProductService: ProductsService, private _AddressService: AddressService,
    private _OrderService: OrderService,
    private _Router: Router,
    private _AuthService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.spinner.show('cart');
    /*Check if user is logged in  */
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) {
          this.loggedUser = true;
          this.getCart();
          this.getAddress();
        } else { this.loggedUser = false; this.spinner.hide('cart'); this._Router.navigate(['/home']) }
      }
    )
  }

  getCart(): void {
    /* Get the data in cart Data service (if there's) */
    this._CartService.cartData.subscribe(
      response => {
        if (Array.isArray(response.products)) {
          this.cartData = response;
          this.spinner.hide('cart');
          if (response.products.length == 0) {
            this.isCartEmpty = true;
          } else { this.isCartEmpty = false }
        } else if (response == 'error') {
          this.spinner.hide('cart')
        }
      }
    )
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
  async updateCart(event: Event): Promise<void> {
    this.spinner.show('cart');
    let inputs = $(event.target!).siblings('.data').find('input[title="count"]');
    await this.changeCart(inputs);
    this.spinner.hide();
  }

  async changeCart(inputs: JQuery<HTMLElement>): Promise<void> {
    let inputsLength = inputs.length;
    for (let i = 0; i < inputsLength; i++) {
      let id: string = String($(inputs[i]).attr('product.id'));
      let value = $(inputs[i]).val()
      if (Number(value) == 0) {
        this.removeFromCart(id)
      } else if (Number(value) > 0) {
        let count: string = String(value);
        this._CartService.updateCart(id, count).subscribe({
          next: (response) => this._CartService.cartData.next(response.data),
          error: (err) => { this.afterError(err) }
        })
      }
    }
  }

  /* Remove a product from Cart */
  removeFromCart(id: string): void {
    this.spinner.show();
    this._CartService.removeItem(id).subscribe({
      next: (response) => {
        this._CartService.cartData.next(response.data);
        this.spinner.hide();
      },
      error: (err) => {
        this.afterError(err)
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
    this._AddressService.addressData.subscribe({
      next: (response) => {
        if (response != 'error') {
          this.addresses = response;
          this.checkAddresses();
        }
      }
    })
  }
  /* Collect the data of the chosen Address For Shipping */
  procceedPayment(shippingAddressForm: FormGroup): void {
    this.spinner.show('cart')
    this.isLoading = true;
    const addressIndex = shippingAddressForm.value.shippingAddress;
    const paymentMethod = shippingAddressForm.value.paymentMethod;
    const cartId = this.cartData._id;
    if (addressIndex && cartId && paymentMethod && !this.isCartEmpty) {
      const { details, phone, city } = this.addresses[addressIndex];
      let shippingAddress = { shippingAddress: { details, phone, city } };
      if (paymentMethod === 'cash') {
        this.createCashOrder(cartId, shippingAddress);
      } else if (paymentMethod === 'online') {
        this.checkOutOrder(cartId, shippingAddress);
      }
    } else { this.spinner.hide('cart'); this.isLoading = false; }
  }
  /* Cash(ON delivery) payment */
  createCashOrder(cartId: string, shippingAddress: object): void {
    this._OrderService.createCashOrder(cartId, shippingAddress).subscribe({
      next: (response) => {
        console.log(response);
        this.spinner.hide('cart');
        this._OrderService.userId.next(response.data.user);
        this.isLoading = false;
        this.toastr.success(`Your Order has been placed`, `${response.status}`);
        this._Router.navigate(['allorders'])
      }, error: (err) => {
        this.afterError(err)
      }
    })
  }

  /* ONline payment */
  checkOutOrder(cartId: string, shippingAddress: object): void {
    this._OrderService.checkOutOrder(cartId, shippingAddress).subscribe({
      next: response => {
        window.open(window.location.href = response.session.url, '_blank');
        this.spinner.hide('cart')
        console.log(response);
        this.isLoading = false;
      },
      error: err => {
        this.afterError(err)
      }
    })
  }

  /* Close Cart Canvas (when direction to cart/home component) */
  closeCartCanvas(): void {
    this._CartService.closeCartCanvas();
  }

  afterError(err: any): void {
    this.spinner.hide('cart');
    this.toastr.error(`${err.error.message || err.statusText}`, `Cart/Orders  ${err.error.statusMsg || err.name}`);
    this.isLoading = false;
  }
}
