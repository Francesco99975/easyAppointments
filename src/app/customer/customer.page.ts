import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.page.html",
  styleUrls: ["./customer.page.scss"]
})
export class CustomerPage implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit() {}

  onLogout() {
    this.userService.logout();
  }
}
