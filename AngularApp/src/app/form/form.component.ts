import { UsersService } from './../service/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { error } from 'protractor';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  signupForm: FormGroup;
  submitted = true;
  obj: Object;
  constructor(private userservice: UsersService) {}
  //:NgForm

  onSubmit() {
    this.obj = this.signupForm.controls.userData.value;
    this.userservice.postItems(this.obj).subscribe(
      (response) => {
        // console.log(response);
        this.userservice.login.next(true);
        this.submitted = false;
      },
      (error) => {
        console.log(error);
      }
    );

    console.log(this.obj);
  }
  ngOnInit(): void {
    let a = this.userservice.getlocal();
    if (a) this.submitted = false;
    else this.submitted = true;
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('[a-zA-Z ]+'),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[0-9]{10}'),
        ]),
      }),
    });
  }
}
