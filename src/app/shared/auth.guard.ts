import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve) => {
      this.storage
        .get("user")
        .then((data) => {
          if (data) resolve(true);
          else {
            console.log("access denied!");
            this.router.navigate(["/home"]);
            resolve(false);
          }
        })
        .catch((err) => {
          console.log("Error: " + err.message);
          this.router.navigate(["/home"]);
          resolve(false);
        });
    });
  }
}
