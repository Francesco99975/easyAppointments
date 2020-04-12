import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../user.service";
import { Customer } from "../shared/customer.model";
import { Storage } from "@ionic/storage";
import { Subscription } from "rxjs";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.page.html",
  styleUrls: ["./customer.page.scss"],
})
export class CustomerPage implements OnInit, OnDestroy {
  user: Customer;
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
      if (this.router.url == "/customer") {
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
          this.user = new Customer(
            data.uid,
            data.firstname,
            data.lastname,
            data.username,
            data.email,
            data.accountType,
            data.favouriteProf,
            data.scheduledAppointments
          );
        })
        .catch((error) => {
          console.log("Error: " + error.message);
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
    return this.user.getAppointments().filter((app) => {
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

  onLogout() {
    this.userService.logout();
  }
}
