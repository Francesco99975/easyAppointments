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

  onLogout() {
    this.userService.logout();
  }

  onClick() {
    console.log("Click");
  }
}
