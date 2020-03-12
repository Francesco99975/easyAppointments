import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../shared/user.model";
import * as bcrypt from "bcryptjs";

import { UserService } from "../user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  accountTypes = ["professional", "customer"]; //List of the account types

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
    { validators: [this.conditionalProf.bind(this), this.checkPassword] }
  );

  constructor(private userService: UserService) {}

  ngOnInit() {}

  checkPassword(form: FormGroup) {
    if (form.get("password").value !== form.get("repassword").value)
      return { passValid: true };
    else return null;
  }

  conditionalProf(form: FormGroup) {
    if (form.get("accountType").value === this.accountTypes[0]) {
      return Validators.required(form.get("profession"));
    } else {
      return null;
    }
  }

  async onSubmit() {
    const newUser = new User(
      this.form.get("firstName").value,
      this.form.get("lastName").value,
      this.form.get("username").value,
      this.form.get("email").value,
      this.form.get("accountType").value,
      this.form.get("profession").value
    );

    const hash = await bcrypt.hash(this.form.get("password").value, 10);

    await this.userService.signUp(newUser, hash);

    // const userObj = this.form.value;
    // const newUser = new User(
    //   userObj.firstName,
    //   userObj.lastName,
    //   userObj.username,
    //   userObj.email,
    //   userObj.accountType,
    //   userObj.profession
    // );

    // console.log(newUser.getFullName());
    // console.log(newUser.getUsername());
    // console.log(newUser.getEmail());
    // console.log(newUser.getType());
    // console.log(newUser.getProfession());
  }
}
