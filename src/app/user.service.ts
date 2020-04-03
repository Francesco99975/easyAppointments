import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { of, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { Professionist } from "./shared/professionist.model";
import { Customer } from "./shared/customer.model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  public currentUser: BehaviorSubject<Customer | Professionist>;

  constructor(
    private authFire: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router
  ) {}

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
    await this.toUser(uid).then(data => (usr = data));

    this.currentUser = new BehaviorSubject(usr);
    this.currentUser.next(usr);

    if (usr instanceof Customer) this.router.navigate(["/customer"]);
    else if (usr instanceof Professionist)
      this.router.navigate(["/professional"]);
  }

  async logout() {
    await this.authFire.auth.signOut();
    this.currentUser = null;
    return this.router.navigate(["/signin"]);
  }

  private updateCustomerData(user: Customer) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `customers/${user.getUid()}`
    );

    return userRef.set(
      {
        uid: user.getUid(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        username: user.getUsername(),
        email: user.getEmail(),
        accountType: user.getType(),
        //To be in SQLite
        favouriteProf: user.getFavourites(),
        scheduledAppointments: user.getAppointments()
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
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        username: user.getUsername(),
        email: user.getEmail(),
        accountType: user.getType(),
        profession: user.getProfession(),
        // To be in SQLite
        settings: user.getSetting(),
        scheduleSettings: user.getScheduleSettings(),
        requestedAppointments: user.getSchedule()
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
      await userRef.forEach(data => {
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

    return new Promise(resolve => resolve(curUsr));
  }
}
