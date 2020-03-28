import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getStatus(val: string) {
    return this.http
      .get<any>(
        `http://api.dataatwork.org/v1/jobs/autocomplete?contains=${val}`,
        { observe: "response" }
      )
      .pipe(
        map(res => res.status),
        map(
          status => {
            if (status == 200) {
              console.log("Good: " + status);
              return null;
            } else {
              console.log("Bad: " + status);
              return { invalidProf: true };
            }
          },
          error => {
            console.log("Error: " + error.message);
            return { invalidProf: true };
          }
        )
      );
  }
}
