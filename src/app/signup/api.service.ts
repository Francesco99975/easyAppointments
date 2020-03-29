import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getJobs(input: string) {
    if (input.length > 0) {
      return this.http
        .get(
          "http://api.dataatwork.org/v1/jobs/autocomplete?begins_with=" + input
        )
        .pipe(
          map((res: any[]) => {
            let jobs: string[] = [];
            for (let i = 0; i < res.length; i++) {
              jobs.push(res[i].suggestion);
            }
            return jobs;
          })
        );
    } else {
      return of([]);
    }
  }
}
