import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Professionist } from "src/app/shared/professionist.model";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";

@Component({
  selector: "app-setup",
  templateUrl: "./setup.page.html",
  styleUrls: ["./setup.page.scss"],
})
export class SetupPage implements OnInit {
  weekDays: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  availables: Array<boolean>;
  from: { hour: number; minute: number };
  to: { hour: number; minute: number };

  form: FormGroup = new FormGroup({
    monday: new FormControl(null),
    tuesday: new FormControl(null),
    wednesday: new FormControl(null),
    thursday: new FormControl(null),
    friday: new FormControl(null),
    saturday: new FormControl(null),
    sunday: new FormControl(null),
    from: new FormControl(null, Validators.required),
    to: new FormControl(null, Validators.required),
  });

  constructor(private storage: Storage) {}

  ngOnInit() {
    this.storage
      .get("user")
      .then((data) => {
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

        this.availables = tmp.getScheduleSettings().availableDays;
        this.from = tmp.getScheduleSettings().from;
        this.to = tmp.getScheduleSettings().to;
      })
      .then(() => {
        this.form.get("monday").setValue(this.availables[0]);
        this.form.get("tuesday").setValue(this.availables[1]);
        this.form.get("wednesday").setValue(this.availables[2]);
        this.form.get("thursday").setValue(this.availables[3]);
        this.form.get("friday").setValue(this.availables[4]);
        this.form.get("saturday").setValue(this.availables[5]);
        this.form.get("sunday").setValue(this.availables[6]);
      });
  }

  private appendLeadingZeroes(n: string) {
    if (((n as unknown) as number) <= 9) {
      return "0" + n;
    }
    return n;
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

  onSubmit() {
    console.log(this.form.value);

    let ad: boolean[] = [
      this.form.get("monday").value,
      this.form.get("tuesday").value,
      this.form.get("wednesday").value,
      this.form.get("thursday").value,
      this.form.get("friday").value,
      this.form.get("saturday").value,
      this.form.get("sunday").value,
    ];

    let newScheduleSettings = {
      availableDays: ad,
      from: {
        hour: new Date(this.form.get("from").value).getHours(),
        minute: new Date(this.form.get("from").value).getMinutes(),
      },
      to: {
        hour: new Date(this.form.get("to").value).getHours(),
        minute: new Date(this.form.get("to").value).getMinutes(),
      },
    };

    console.log(newScheduleSettings);
  }
}
