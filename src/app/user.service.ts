import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from "@ionic/storage";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { of, BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";
import { Professionist } from "./shared/professionist.model";
import { Customer } from "./shared/customer.model";
import { map } from "rxjs/operators";
import { HelperService } from "./helper.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public currentUser: BehaviorSubject<
    Customer | Professionist
  > = new BehaviorSubject(null);

  public appointmentError: Subject<string> = new Subject<string>();
  public appointmentSent: Subject<string> = new Subject<string>();
  public settingsChanged: Subject<string> = new Subject<string>();

  constructor(
    private authFire: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router,
    private storage: Storage,
    private helper: HelperService
  ) {}

  setUser(user: Customer | Professionist) {
    this.currentUser = new BehaviorSubject(user);
  }

  async signUp(newUser: Customer | Professionist, password: string) {
    const fireUser = await this.authFire.auth.createUserWithEmailAndPassword(
      newUser.getEmail(),
      password
    );

    newUser.setUid(fireUser.user.uid);

    if (newUser instanceof Customer) {
      this.updateCustomerData(newUser);
    } else if (newUser instanceof Professionist) {
      this.updateProfessionistData(newUser);
    }

    this.router.navigateByUrl("/signin");
  }

  async login(email: string, password: string) {
    const fireUser = await this.authFire.auth.signInWithEmailAndPassword(
      email,
      password
    );

    const uid = fireUser.user.uid;

    let usr: Customer | Professionist;
    try {
      usr = await this.toUser(uid);
    } catch (error) {
      console.log("Error: " + error);
    }
    console.log(usr);
    console.log(usr == null);
    if (usr == null) usr = await this.toProf(uid);

    console.log(usr.getUsername());

    this.currentUser = new BehaviorSubject(usr);

    if (usr instanceof Customer) {
      this.storage
        .set("user", {
          uid: usr.getUid(),
          firstname: usr.getFirstName(),
          lastname: usr.getLastName(),
          username: usr.getUsername(),
          email: usr.getEmail(),
          accountType: usr.getType(),
          favouriteProf: usr.getFavourites(),
          scheduledAppointments: usr.getAppointments(),
        })
        .then(() => this.router.navigate(["/customer"]));
    } else if (usr instanceof Professionist) {
      this.storage
        .set("user", {
          uid: usr.getUid(),
          firstname: usr.getFirstName(),
          lastname: usr.getLastName(),
          username: usr.getUsername(),
          email: usr.getEmail(),
          accountType: usr.getType(),
          profession: usr.getProfession(),
          settings: usr.getSetting(),
          scheduleSettings: usr.getScheduleSettings(),
          requestedAppointments: usr.getSchedule(),
        })
        .then(() => this.router.navigate(["/professional"]));
    }
  }

  async logout() {
    await this.authFire.auth.signOut();
    this.currentUser = null;
    await this.storage.clear();
    return this.router.navigate(["/signin"]);
  }

  private updateCustomerData(user: Customer) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `customers/${user.getUid()}`
    );

    return userRef.set(
      {
        uid: user.getUid(),
        firstName: user.getFirstName().toLowerCase(),
        lastName: user.getLastName().toLowerCase(),
        username: user.getUsername().toLowerCase(),
        email: user.getEmail().toLowerCase(),
        accountType: user.getType(),
        favouriteProf: user.getFavourites(),
        scheduledAppointments: user.getAppointments(),
      },
      { merge: true }
    );
  }

  private updateProfessionistData(user: Professionist) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `professionists/${user.getUid()}`
    );

    console.log(user);

    return userRef.set(
      {
        uid: user.getUid(),
        firstName: user.getFirstName().toLowerCase(),
        lastName: user.getLastName().toLowerCase(),
        username: user.getUsername().toLowerCase(),
        email: user.getEmail().toLowerCase(),
        accountType: user.getType(),
        profession: user.getProfession(),
        settings: user.getSetting(),
        scheduleSettings: user.getScheduleSettings(),
        requestedAppointments: user.getSchedule(),
      },
      { merge: true }
    );
  }

  private async toProf(uid: string): Promise<Professionist> {
    let userRef = this.fireStore.doc(`professionists/${uid}`).get();

    let curUsr: Professionist;

    try {
      await userRef.forEach((data) => {
        curUsr = new Professionist(
          uid,
          data.get("firstName"),
          data.get("lastName"),
          data.get("username"),
          data.get("email"),
          data.get("accountType"),
          data.get("profession"),
          data.get("settings"),
          data.get("scheduleSettings"),
          data.get("requestedAppointments")
        );
      });
    } catch (error) {
      console.log(error.message);
    }
    return new Promise((resolve) => resolve(curUsr));
  }

  private async toUser(uid: string): Promise<Customer | Professionist> {
    return new Promise(async (resolve, reject) => {
      let userRef = this.fireStore.doc(`customers/${uid}`).get();

      let curUsr: Customer | Professionist;

      try {
        await userRef.forEach((data) => {
          if (data.exists) {
            console.log("Here");
            curUsr = new Customer(
              uid,
              data.get("firstName"),
              data.get("lastName"),
              data.get("username"),
              data.get("email"),
              data.get("accountType"),
              data.get("favouriteProf"),
              data.get("scheduledAppointments")
            );
            resolve(curUsr);
          } else {
            resolve(null);
          }
        });
      } catch (error) {
        console.log(error.message);
        reject("Something went wrong");
      }
    });
  }

  //Customer Fuctions

  addFav(pro: any) {
    let updatedUser: Customer;

    this.storage
      .get("user")
      .then((data) => {
        updatedUser = new Customer(
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
      .then(() => {
        updatedUser.addFavourite({
          uid: pro.uid,
          title: pro.lastName,
          profession: pro.profession,
        });
        this.updateCustomerData(updatedUser);
        this.currentUser.next(updatedUser);
        console.log("aup");
      })
      .catch((error) => console.log(error.message));
  }

  removeFav(pro: any) {
    let updatedUser: Customer;

    this.storage
      .get("user")
      .then((data) => {
        updatedUser = new Customer(
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
      .then(() => {
        updatedUser.removeFavourite(pro.uid);
        this.updateCustomerData(updatedUser);
        this.currentUser.next(updatedUser);
        console.log("rup");
      })
      .catch((error) => console.log(error.message));
  }

  async submitAppointment(
    uid: string,
    appointment: {
      title: string;
      profession: string;
      date: Date;
    }
  ) {
    let prof: Professionist;
    console.log(uid);
    await this.toProf(uid).then((usr) => {
      prof = usr;
    });
    let currentAppointments: Date[] = [];

    console.log(prof);
    console.log(prof.getEmail());
    console.log(prof.getScheduleSettings());

    if (prof.getSchedule().length > 0) {
      console.log((prof.getSchedule()[0].date as any).seconds);
      for (let i = 0; i < prof.getSchedule().length; i++) {
        currentAppointments.push(
          new Date((prof.getSchedule()[i].date as any).seconds * 1000)
        );
        console.log(currentAppointments);
      }
    }

    if (
      this.helper.isDayAvailable(
        //Check if day of the week is available
        appointment.date,
        prof.getScheduleSettings().availableDays
      ) &&
      this.helper.isTimeAvailable(
        //Check if time range is available
        appointment.date,
        prof.getScheduleSettings().from,
        prof.getScheduleSettings().to
      ) &&
      !this.helper.isOccupied(appointment.date, currentAppointments) // Check if spot is currently not occupied
    ) {
      let updatedUser: Customer;

      this.storage
        .get("user")
        .then((data) => {
          updatedUser = new Customer(
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
        .then(() => {
          prof.addToSchedule({
            customerName: updatedUser.getFullName(),
            date: new Date(appointment.date),
          });
        })
        .then(() => this.updateProfessionistData(prof))
        .then(() =>
          updatedUser.addAppointment({
            title: appointment.title,
            profession: appointment.profession,
            date: new Date(appointment.date),
          })
        )
        .then(() => this.updateCustomerData(updatedUser))
        .then(() => {
          this.currentUser.next(updatedUser);
          this.appointmentSent.next("Appointment successfully sent!");
        })
        .catch((err) => console.log(err.message));
    } else {
      this.appointmentError.next("Time unavailable. Try a different date...");
    }
  }

  cancelAppointment() {}

  //Professionist Functions

  changeVisibility(newProf: Professionist) {
    this.updateProfessionistData(newProf);
    this.currentUser.next(newProf);
  }

  changeScheduleSettings(settings: any) {
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

        tmp.setScheduleSettings(settings);
        return tmp;
      })
      .then((tmp) => {
        this.updateProfessionistData(tmp);
        return tmp;
      })
      .then((tmp) => this.currentUser.next(tmp))
      .then(() => this.settingsChanged.next("Settings Successfully Changed!"));
  }
}
