import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Customer } from "src/app/shared/customer.model";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.page.html",
  styleUrls: ["./schedule.page.scss"],
})
export class SchedulePage implements OnInit {
  appointments: {
    title: string;
    profession: string;
    date: Date;
  }[] = [];

  constructor(private storage: Storage) {}

  ngOnInit() {
    this.storage.get("user").then((data) => {
      let tmp: Customer = new Customer(
        data.uid,
        data.firstname,
        data.lastname,
        data.username,
        data.email,
        data.accountType,
        data.favouriteProf,
        data.scheduledAppointments
      );

      this.appointments = tmp.getAppointments();
    });
  }

  getDate(app: any) {
    if ((app.date as any).seconds > 1)
      return new Date((app.date as any).seconds * 1000);
    else return new Date(app.date);
  }
}
