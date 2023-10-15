import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  constructor(private _AddressService: AddressService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.spinner.show();
  }
  /* To Show the form */
  newAddress: Boolean = false;
  addresses: any;
  isAddress: boolean = true;
  isLoading: boolean = false;
  ngOnInit(): void {
    /* Get and Show Addresses if they exist */
    this.getAddress();
  }

  addressForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    details: new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(50)]),
    city: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}/)]),
  })

  addAddress(addressForm: FormGroup): void {
    this.isLoading = true;
    this.spinner.show();
    this._AddressService.addAddress(addressForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._AddressService.addressData.next(response.data);
        this.toggleAddressForm();
        this.spinner.hide();
        this.newAddress = false;
        this.isAddress = true;
        this.toastr.success(response.message, response.status);
      },
      error: (err) => {
        this.afterError(err);
      }
    })
  }





  /* Get the User Addresses from api/store the response in Addresses */
  getAddress(): void {
    this._AddressService.addressData.subscribe((response) => {
      if (Array.isArray(response)) {
        this.addresses = response;
        this.spinner.hide();
        if (response.length == 0) {
          this.isAddress = false;
        } else { this.isAddress = true }
      } else if (response == 'error') {
        this.spinner.hide();
      }
    })
  }


  removeAddress(addressId: string): void {
    this.spinner.show();
    this._AddressService.removeAddress(addressId).subscribe({
      next: response => {
        this._AddressService.addressData.next(response.data);
        this.spinner.hide();
        this.toastr.success(response.message, response.status);
      },
      error: err => {
        this.afterError(err);
      }
    })
  }
  /* SHOW ADDING NEW ADDRESS FROM */
  toggleAddressForm(): void {
    this.newAddress = !this.newAddress;
  }
  /* Things to happen in case of api Error */
  afterError(err: any): void {
    this.spinner.hide();
    this.toastr.error(err.error.message || err.statusText, err.error.statusMsg || err.name);
    this.isLoading = false;
  }
}
