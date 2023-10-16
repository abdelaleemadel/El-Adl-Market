import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isLoading: boolean = false;
  statusMessage: string = '';
  failureMessage: string = '';
  constructor(private _HttpClient: HttpClient, private toastr: ToastrService) {
  }
  contactForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    message: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    email: new FormControl(null, [Validators.required, Validators.email]),

  })

  handleContact(contactForm: FormGroup): void {
    this.isLoading = true;
    if (contactForm.status == 'VALID') {
      this.sendForm(contactForm.value).subscribe({
        next: response => {
          this.isLoading = false;
          this.toastr.success('Thank You, we have recieved you message')
        },
        error: err => {
          this.isLoading = false;
          this.toastr.error(err.statusText || 'something happend during submission. Please, try again later.', err.name || 'Sorry')
        }
      })
    } else { this.isLoading = false; }
  }
  sendForm(contactForm: any): Observable<any> {
    return this._HttpClient.post(`https://formspree.io/f/mnqklody`, contactForm, { headers: { 'Accept': 'application/json' } })
  }
}
