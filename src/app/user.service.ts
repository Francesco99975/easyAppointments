import { Injectable } from "@angular/core";
import { User } from "./shared/user.model";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class UserService {
  public currentUser: Observable<User>;

  constructor(
    private authFire: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router
  ) {
    console.log("Run");
    this.currentUser = this.authFire.authState.pipe(
      switchMap(async user => {
        if (user) {
          return Observable.create(await this.toUser(user.uid)); //this.fireStore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signUp(newUser: User, password: string) {
    const fireUser = await this.authFire.auth.createUserWithEmailAndPassword(
      newUser.getEmail(),
      password
    );

    this.updateUserData(
      new User(
        fireUser.user.uid,
        newUser.getFirstName(),
        newUser.getLastName(),
        newUser.getUsername(),
        newUser.getEmail(),
        newUser.getType(),
        newUser.getProfession()
      )
    );

    this.router.navigateByUrl("/signin");
  }

  async login(email: string, password: string) {
    const fireUser = await this.authFire.auth.signInWithEmailAndPassword(
      email,
      password
    );

    const uid = fireUser.user.uid;

    let usr: User;
    await this.toUser(uid).then(data => (usr = data));

    this.currentUser = of(usr);

    this.router.navigate(["/customer"]);
  }

  async logout() {
    await this.authFire.auth.signOut();
    this.currentUser = of(null);
    return this.router.navigate(["/signin"]);
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.getUid()}`
    );

    return userRef.set(
      {
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        username: user.getUsername(),
        email: user.getEmail(),
        accountType: user.getType(),
        profession: user.getProfession()
      },
      { merge: true }
    );
  }

  private async toUser(uid: string): Promise<User> {
    const userRef = this.fireStore.doc(`users/${uid}`).get();

    let curUsr: User;
    await userRef.forEach(data => {
      curUsr = new User(
        uid,
        data.get("firstName"),
        data.get("lastName"),
        data.get("username"),
        data.get("email"),
        data.get("accountType"),
        data.get("profession")
      );
    });

    return new Promise(resolve => resolve(curUsr));
  }
}
