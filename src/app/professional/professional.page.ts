import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Platform, NavController, AlertController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-professional",
  templateUrl: "./professional.page.html",
  styleUrls: ["./professional.page.scss"],
})
export class ProfessionalPage implements OnInit {
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

  ngOnInit() {}

  ngOnDestroy() {
    this.subExit.unsubscribe();
  }
}
