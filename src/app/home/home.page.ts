import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Platform, NavController, AlertController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnDestroy {
  subExit: Subscription;

  constructor(
    private router: Router,
    private platform: Platform,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.subExit = this.platform.backButton.subscribeWithPriority(10000, () => {
      if (this.router.url == "/home") {
        this.presentConfirm();
      } else {
        this.navCtrl.back();
      }
    });
  }

  ngOnDestroy() {
    this.subExit.unsubscribe();
  }

  async presentConfirm() {
    let alert = await this.alertCtrl.create({
      header: "Exit App?",
      subHeader: "",
      message: "Do you want to exit the app?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Yes",
          handler: () => {
            navigator["app"].exitApp();
          },
        },
      ],
    });
    await alert.present();
  }

  onSignIn() {
    this.router.navigate(["/signin"]);
  }

  onSignUp() {
    this.router.navigate(["/signup"]);
  }
}
