import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor() {}

  isDayAvailable(date: Date, days: boolean[]): boolean {
    console.log("week");
    let appDate = new Date(date);
    if (appDate.getDay() > 0) return days[appDate.getDay() - 1];
    else return days[days.length - 1];
  }

  isTimeAvailable(
    date: Date,
    from_: {
      hour: number;
      minute: number;
    },
    to_: {
      hour: number;
      minute: number;
    }
  ): boolean {
    console.log("time available?");
    let appDate = new Date(date);
    console.log(appDate);

    let from = new Date(
      appDate.getFullYear(),
      appDate.getMonth(),
      appDate.getDate()
    );
    from.setHours(from_.hour);
    from.setMinutes(from_.minute);
    console.log(from);

    let to = new Date(
      appDate.getFullYear(),
      appDate.getMonth(),
      appDate.getDate()
    );
    to.setHours(to_.hour);
    to.setMinutes(to_.minute);

    console.log(to);
    if (
      appDate.getTime() >= from.getTime() &&
      appDate.getTime() <= to.getTime()
    ) {
      console.log("yes");
      return true;
    } else {
      console.log("no");
      return false;
    }
  }

  isOccupied(date: Date, otherAppointments: Date[]): boolean {
    let appDate = new Date(date);
    let occupied: boolean = false;
    let myEnd: Date = new Date(appDate);
    let arr: Date[] = otherAppointments.filter((d: Date) => {
      console.log(d);
      console.log(typeof d);
      return (
        d.getDate() === appDate.getDate() && d.getMonth() === appDate.getMonth()
      );
    });
    console.log("occ: " + occupied);

    if (arr.length < 1) return occupied;

    myEnd.setHours(myEnd.getHours() + 1);

    console.log(appDate);
    console.log(myEnd);
    console.log(arr[0]);

    for (let i = 0; i < arr.length; i++) {
      let end: Date = new Date(arr[i]);
      end.setHours(end.getHours() + 1);
      console.log(end);
      if (
        (appDate.getTime() >= arr[i].getTime() &&
          appDate.getTime() <= end.getTime()) ||
        (myEnd.getTime() >= arr[i].getTime() &&
          myEnd.getTime() <= end.getTime())
      ) {
        occupied = true;
        break;
      }
    }

    console.log("Occupied: " + occupied);

    return occupied;
  }
}
