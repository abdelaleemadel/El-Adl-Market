import { Component, OnInit } from '@angular/core';
import { AddressService } from '../services/address.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  constructor(private _AddressService: AddressService) { }
  newAddress: Boolean = false;
  addresses: any;
  isLoading: boolean = false;
  ngOnInit(): void {
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
      next: (response) => console.log(response),
      error: (err) => console.log(err)
    })
    this.isLoading = false;
  }


}
