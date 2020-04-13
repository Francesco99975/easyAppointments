import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { UserService } from "src/app/user.service";
import { Professionist } from "src/app/shared/professionist.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: Professionist;

  constructor(private userService: UserService, private storage: Storage) {}

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
    // console.log(event);
    // console.log(this.user.getSetting());
    this.userService.changeVisibility(this.user);
  }

  onLogout() {
    this.userService.logout();
  }
}
