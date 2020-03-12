import { Injectable } from "@angular/core";
import { User } from "./shared/user.model";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private currentUser: User;

  constructor(private authFire: AngularFireAuth) {}

  async signUp(newUser: User, hashedPassword: string) {
    const user = await this.authFire.auth.createUserWithEmailAndPassword(
      newUser.getEmail(),
      hashedPassword
    );

    console.log(user);
  }

  async login() {}

  async logout() {}
}
