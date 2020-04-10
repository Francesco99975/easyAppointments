import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Customer } from "../shared/customer.model";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.page.html",
  styleUrls: ["./customer.page.scss"],
})
export class CustomerPage implements OnInit {
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
      let appDate = new Date((app.date as any).seconds);

      return (
        appDate.getFullYear() == today.getFullYear() &&
        appDate.getMonth() == today.getMonth() &&
        appDate.getDate() == today.getDate()
      );
    });
  }

  getDate(app: any) {
    return new Date((app.date as any).seconds);
  }

  onLogout() {
    this.userService.logout();
  }
}
