import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
}
