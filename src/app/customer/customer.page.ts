import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Customer } from "../shared/customer.model";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.page.html",
  styleUrls: ["./customer.page.scss"]
})
export class CustomerPage implements OnInit {
  user: Customer;
  appointments: {
    title: string;
    profession: string;
    date: Date;
  }[] = [];

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(
      usr => {
        if (usr instanceof Customer) this.user = usr;
        else this.onLogout();
      },
      error => {
        console.log("Customer Page Error: " + error.message);
        this.onLogout();
      }
    );
  }

  onLogout() {
    this.userService.logout();
  }
}
