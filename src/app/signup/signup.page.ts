import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from "@angular/forms";
import { User } from "../shared/user.model";

import { UserService } from "../user.service";
import { Customer } from "../shared/customer.model";
import { Professionist } from "../shared/professionist.model";
import { Observable, pipe, timer, of } from "rxjs";
import { switchMap, map, first } from "rxjs/operators";
import { ApiService } from "./api.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  accountTypes = ["professional", "customer"]; //List of the account types
  invalidForm: boolean = true;
  interval: any;

  //Sign Up Form
  form = new FormGroup(
    {
      firstName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(15)
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(15)
      ]),
      username: new FormControl(null, [
        Validators.required,
        Validators.maxLength(9)
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      repassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      accountType: new FormControl(this.accountTypes[1], [Validators.required]),
      profession: new FormControl(null)
    },
    {
      validators: [this.conditionalProf.bind(this), this.checkPassword]
    }
  );

  constructor(private userService: UserService, private api: ApiService) {}

  ngOnInit() {
    this.form.get("accountType").valueChanges.subscribe(val => {
      if (val === this.accountTypes[0]) {
        //AccoutType at 0 = professional account
        this.form
          .get("profession")
          .setAsyncValidators(this.validateProfession.bind(this));
        console.log("Set");
      } else {
        this.form.get("profession").clearAsyncValidators();
        console.log("Clear");
      }

      this.form.get("profession").updateValueAndValidity();
    });

    this.form.statusChanges.subscribe(val => {
      if (val === "VALID") {
        this.invalidForm = false;
        console.log(val);
      } else {
        this.invalidForm = true;
        console.log(val);
      }
    });
  }

  checkPassword(form: FormGroup) {
    if (form.get("password").value !== form.get("repassword").value)
      return { passValid: true };
    else return null;
  }

  conditionalProf(form: FormGroup) {
    if (form.get("accountType").value === this.accountTypes[0]) {
      return [Validators.required(form.get("profession"))];
    } else {
      return null;
    }
  }

  // verifyProfession(form: FormGroup): Promise<any> | Observable<any> {
  //   if (form.get("accountType").value == this.accountTypes[0])
  //     return this.validateProfession(form.get("profession"));
  //   else return new Promise(resolve => resolve(null));
  // }

  validateProfession(control: AbstractControl): Promise<any> | Observable<any> {
    return this.api.getStatus(control.value);
  }

  async onSubmit() {
    let newUser: Customer | Professionist;

    if (this.form.get("accountType").value === "customer") {
      newUser = new Customer(
        "tmp",
        this.form.get("firstName").value,
        this.form.get("lastName").value,
        this.form.get("username").value,
        this.form.get("email").value,
        this.form.get("accountType").value
      );
    } else {
      newUser = new Professionist(
        "tmp",
        this.form.get("firstName").value,
        this.form.get("lastName").value,
        this.form.get("username").value,
        this.form.get("email").value,
        this.form.get("accountType").value,
        this.form.get("profession").value
      );
    }

    await this.userService.signUp(newUser, this.form.get("password").value);
    this.form.reset();
  }
}
