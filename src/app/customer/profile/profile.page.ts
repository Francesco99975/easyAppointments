import { Component, OnInit, OnDestroy } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Customer } from "src/app/shared/customer.model";
import { UserService } from "src/app/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: Customer;

  constructor(private userService: UserService, private storage: Storage) {}

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
