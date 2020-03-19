import { User } from "./user.model";

export class Customer extends User {
  private favouriteProf: { uid: string; title: string; profession: string }[];
  private scheduledAppointments: {
    title: string;
    profession: string;
    date: Date;
  }[];

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    accountType: string,
    favouriteProf: { uid: string; title: string; profession: string }[] = [],
    scheduledAppointments: {
      title: string;
      profession: string;
      date: Date;
    }[] = []
  ) {
    super(uid, firstName, lastName, username, email, accountType);
    this.favouriteProf = favouriteProf;
    this.scheduledAppointments = scheduledAppointments;
  }

  getFavourites() {
    return this.favouriteProf;
  }

  addFavourite(fav: { uid: string; title: string; profession: string }) {
    this.favouriteProf.push(fav);
  }

  removeFavourite(index: number) {
    this.favouriteProf.splice(index, 1);
  }

  getAppointments() {
    return this.scheduledAppointments;
  }

  addAppointment(appointment: {
    title: string;
    profession: string;
    date: Date;
  }) {
    this.scheduledAppointments.push(appointment);
  }

  cancelAppointment(index: number) {
    this.scheduledAppointments.splice(index, 1);
  }
}
