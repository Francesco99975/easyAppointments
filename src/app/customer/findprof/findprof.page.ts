import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/signup/api.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { Customer } from "src/app/shared/customer.model";

@Component({
  selector: "app-findprof",
  templateUrl: "./findprof.page.html",
  styleUrls: ["./findprof.page.scss"],
})
export class FindprofPage implements OnInit {
  professionists: any[] = [];
  fav: string = "star-outline";

  form = new FormGroup({
    pro: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
    time: new FormControl(null, Validators.required),
  });

  constructor(
    private api: ApiService,
    private userService: UserService,
    private storage: Storage
  ) {}

  ngOnInit() {
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

  onSearchChange(event) {
    this.api.getProfessionist(event.srcElement.value).subscribe((data) => {
      console.log(data);
      this.professionists = data;
    });
  }

  onFav() {
    if (this.fav == "star-outline" && this.form.get("pro").value != null) {
      this.userService.addFav(this.form.get("pro").value);
      this.fav = "star";
    } else if (this.fav == "star" && this.form.get("pro").value != null) {
      this.userService.removeFav(this.form.get("pro").value);
      this.fav = "star-outline";
    } else {
      console.log("fav error");
    }
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
