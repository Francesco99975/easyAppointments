import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/signup/api.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { Customer } from "src/app/shared/customer.model";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-findprof",
  templateUrl: "./findprof.page.html",
  styleUrls: ["./findprof.page.scss"],
})
export class FindprofPage implements OnInit {
  professionists: any[] = [];
  fav: string = "star-outline";
  message: string = "";

  form = new FormGroup({
    pro: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
  });

  constructor(
    private api: ApiService,
    private userService: UserService,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {
    console.log("Here");
  }

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

    this.userService.appointmentError.subscribe((error) => {
      this.message = error;
      this.presentAlert("Submission Error", "Could not Submit");
      this.form.reset();
    });

    this.userService.appointmentSent.subscribe((message) => {
      this.message = message;
      this.presentAlert("Appointment Sent", "");
      this.form.reset();
    });

    this.form.get("pro").valueChanges.subscribe((pro) => {
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

        try {
          if (tmp.getFavourites().findIndex((fav) => fav.uid === pro.uid) >= 0)
            this.fav = "star";
          else this.fav = "star-outline";
        } catch (error) {
          console.log("form resetted");
        }
      });
    });
  }

  private appendLeadingZeroes(n: string) {
    if (((n as unknown) as number) <= 9) {
      return "0" + n;
    }
    return n;
  }
  async presentAlert(h: string, s: string) {
    const alert = await this.alertCtrl.create({
      header: h,
      subHeader: s,
      message: this.message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  getMinDate(): string {
    let date: Date = new Date();

    return (
      date.getFullYear().toString() +
      "-" +
      this.appendLeadingZeroes(((date.getMonth() + 1) as unknown) as string) +
      "-" +
      this.appendLeadingZeroes(((date.getDate() + 1) as unknown) as string)
    );
  }

  getMaxDate(): string {
    let y: string = new Date().getFullYear().toString();

    return y + "-12-31";
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
    let appointment = {
      title: this.form.get("pro").value.lastName,
      profession: this.form.get("pro").value.profession,
      date: this.form.get("date").value,
    };

    console.log(appointment);

    this.userService.submitAppointment(
      this.form.get("pro").value.uid,
      appointment
    );
  }
}
