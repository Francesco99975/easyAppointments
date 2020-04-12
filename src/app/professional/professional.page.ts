import { Component, OnInit } from "@angular/core";
import { Professionist } from "../shared/professionist.model";
import { UserService } from "../user.service";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { Platform, NavController, AlertController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-professional",
  templateUrl: "./professional.page.html",
  styleUrls: ["./professional.page.scss"],
})
export class ProfessionalPage implements OnInit {
  user: Professionist;
  subExit: Subscription;

  constructor(
    private userService: UserService,
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.subExit = this.platform.backButton.subscribeWithPriority(10000, () => {
      if (this.router.url == "/professional") {
        this.presentConfirm();
      } else {
        this.navCtrl.pop();
      }
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
            this.onLogout();
          },
        },
      ],
    });
    await alert.present();
  }

  ngOnInit() {
    try {
      this.storage
        .get("user")
        .then((data) => {
          this.user = new Professionist(
            data.uid,
            data.firstname,
            data.lastname,
            data.username,
            data.email,
            data.accountType,
            data.profession,
            data.settings,
            data.scheduleSettings,
            data.requestedAppointments
          );
        })
        .catch((error) => {
          console.log("Storage Error: " + error.message);
        });
    } catch (error) {
      console.log("Storage Error: " + error.message);
    }

    this.userService.setUser(this.user);
  }

  ngOnDestroy() {
    this.subExit.unsubscribe();
  }

  getTodayAppointments() {
    return this.user.getSchedule().filter((app) => {
      let today = new Date();
      let appDate = this.getDate(app);

      return (
        appDate.getFullYear() == today.getFullYear() &&
        appDate.getMonth() == today.getMonth() &&
        appDate.getDate() == today.getDate()
      );
    });
  }

  getDate(app: any) {
    if ((app.date as any).seconds > 1)
      return new Date((app.date as any).seconds * 1000);
    else return new Date(app.date);
  }

  updateVisibility(event: boolean) {
    console.log(event);
    console.log(this.user.getSetting());
    this.userService.changeVisibility(this.user);
  }

  onLogout() {
    this.userService.logout();
  }
}
