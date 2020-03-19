import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"]
})
export class SigninPage implements OnInit {
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  constructor(private userService: UserService) {}

  ngOnInit() {}

  async onSubmit() {
    this.userService.login(
      this.form.get("email").value,
      this.form.get("password").value
    );

    this.form.reset();
  }
}
