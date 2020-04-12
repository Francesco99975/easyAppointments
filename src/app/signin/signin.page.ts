import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../user.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"],
})
export class SigninPage implements OnInit {
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  message: string = "";

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.userService.signInError.subscribe((message) => {
      this.message = message;
      this.presentAlert("Log In Error", "");
    });
  }

  async presentAlert(h: string, s: string) {
    const alert = await this.alertCtrl.create({
      header: h,
      subHeader: s,
      message: this.message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async onSubmit() {
    this.userService.login(
      this.form.get("email").value,
      this.form.get("password").value
    );

    this.form.reset();
  }
}
