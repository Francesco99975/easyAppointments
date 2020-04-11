import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Professionist } from "src/app/shared/professionist.model";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.page.html",
  styleUrls: ["./requests.page.scss"],
})
export class RequestsPage implements OnInit {
  appointments: { customerName: string; date: Date }[] = [];

  constructor(private storage: Storage) {}

  ngOnInit() {
    this.storage.get("user").then((data) => {
      let tmp: Professionist = new Professionist(
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

      this.appointments = tmp.getSchedule();
    });
  }

  getDate(app: any) {
    if ((app.date as any).seconds > 1)
      return new Date((app.date as any).seconds * 1000);
    else return new Date(app.date);
  }
}
