import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../user.service";
import { Subscription } from "rxjs";
import { AlertController, Platform } from "@ionic/angular";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.page.html",
  styleUrls: ["./customer.page.scss"],
})
export class CustomerPage implements OnInit, OnDestroy {
  subExit: Subscription;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private userService: UserService
  ) {
    this.subExit = this.platform.backButton.subscribeWithPriority(10000, () => {
      this.presentConfirm();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subExit.unsubscribe();
  }

  async presentConfirm() {
    let alert = await this.alertCtrl.create({
      header: "Exit Account?",
      subHeader: "",
      message: "Do you want to Sign Out?",
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
            this.userService.logout();
          },
        },
      ],
    });
    await alert.present();
  }
}
