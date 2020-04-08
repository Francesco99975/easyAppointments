import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from "@ionic/storage";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { of, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { Professionist } from "./shared/professionist.model";
import { Customer } from "./shared/customer.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public currentUser: BehaviorSubject<
    Customer | Professionist
  > = new BehaviorSubject(null);

  constructor(
    private authFire: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router,
    private storage: Storage
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
    await this.toUser(uid).then((data) => (usr = data));

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

  private async toUser(uid: string): Promise<Customer | Professionist> {
    let cus: boolean = true;
    let userRef = this.fireStore.doc(`customers/${uid}`).get();

    if (!userRef) {
      userRef = this.fireStore.doc(`professionists/${uid}`).get();
      cus = false;
    }

    let curUsr: Customer | Professionist;

    try {
      await userRef.forEach((data) => {
        if (cus) {
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
        } else {
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
        }
      });
    } catch (error) {
      console.log(error.message);
    }

    return new Promise((resolve) => resolve(curUsr));
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
}
