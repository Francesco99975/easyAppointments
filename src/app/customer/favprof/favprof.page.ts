import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Customer } from "src/app/shared/customer.model";
import { UserService } from "src/app/user.service";

@Component({
  selector: "app-favprof",
  templateUrl: "./favprof.page.html",
  styleUrls: ["./favprof.page.scss"],
})
export class FavprofPage implements OnInit {
  favourites: { uid: string; title: string; profession: string }[] = [];

  constructor(private storage: Storage, private userService: UserService) {}

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

      this.favourites = tmp.getFavourites();
    });

    this.userService.currentUser.subscribe(
      (usr: Customer) => {
        if (usr instanceof Customer) {
          console.log("update Customer");
          this.storage.set("user", {
            uid: usr.getUid(),
            firstname: usr.getFirstName(),
            lastname: usr.getLastName(),
            username: usr.getUsername(),
            email: usr.getEmail(),
            accountType: usr.getType(),
            favouriteProf: usr.getFavourites(),
            scheduledAppointments: usr.getAppointments(),
          });
        }
      },
      (error) => {
        console.log("sub error");
      }
    );
  }

  onRemove(uid: string) {
    this.userService.removeFav(uid);
    let index = this.favourites.findIndex((fav) => fav.uid === uid);
    this.favourites.splice(index, 1);
  }
}
