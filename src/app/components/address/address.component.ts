import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  constructor(private _AddressService: AddressService) { }
  /* To Show the form */
  newAddress: Boolean = false;
  addresses: any;
  isAddress: boolean = true;
  isLoading: boolean = false;
  ngOnInit(): void {
    /* Get and Show Addresses if they exist */
    console.log(this.newAddress, this.isAddress);

    this.getAddress();
    console.log(this.newAddress, this.isAddress);

  }

  addressForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    details: new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(50)]),
    city: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}/)]),
  })

  addAddress(addressForm: FormGroup): void {
    this.isLoading = true;
    this._AddressService.addAddress(addressForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._AddressService.addressData.next(response.data);
        this.toggleAddressForm();
      },
      error: (err) => { console.log(err); this.isLoading = false }
    })
  }



  /* Check if this user has addresses */
  checkAddresses(): void {
    console.log(this.addresses);
    if (this.addresses?.length) {
      this.isAddress = true;
    } else if (Array.isArray(this.addresses)) { this.isAddress = false }
  }

  /* Get the User Addresses from api/store the response in Addresses */
  getAddress(): void {
    this._AddressService.addressData.subscribe({
      next: (response) => {
        this.addresses = response;
        this.checkAddresses();
      },
      error: (err) => console.log(err)
    })
  }
  removeAddress(addressId: string): void {
    this._AddressService.removeAddress(addressId).subscribe({
      next: response => {
        console.log(response);
        this._AddressService.addressData.next(response.data)
      },
      error: err => {
        console.log(err);
      }
    })
  }
  /* SHOW ADDING NEW ADDRESS FROM */
  toggleAddressForm(): void {
    this.newAddress = !this.newAddress;
  }
}
