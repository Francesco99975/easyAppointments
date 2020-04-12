import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { of } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { LoaderService } from "../loader.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private fireStore: AngularFirestore,
    private loader: LoaderService
  ) {}

  getJobs(input: string) {
    if (input.length > 0) {
      this.loader.show();
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

  getProfessionist(input: string) {
    let profRef = this.fireStore.collection("professionists").snapshotChanges();

    return profRef.pipe(
      map((actions) => {
        return actions.map((a) => {
          const data: any = a.payload.doc.data();
          return { ...data };
        });
      }),
      map((docs: any[]) => {
        console.log(docs);
        return docs.filter((data) => {
          return (
            (((data.profession as String)
              .toLowerCase()
              .includes(input.toLowerCase()) &&
              input.length > 0) ||
              ((data.lastName as String).includes(input.toLowerCase()) &&
                input.length > 0) ||
              data.userame === input.toLowerCase() ||
              data.email === input.toLowerCase()) &&
            data.settings.visibility
          );
        });
      }),
      map((filtered: any[]) => {
        let arr: any[] = [];
        for (let i = 0; i < filtered.length; i++) {
          arr.push({
            uid: filtered[i].uid,
            lastName: filtered[i].lastName,
            profession: filtered[i].profession,
          });
        }
        return arr;
      })
    );
  }
}
