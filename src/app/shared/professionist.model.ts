import { User } from "./user.model";

export class Professionist extends User {
  private profession: string;
  private settings: { visibility: boolean };
  private scheduleSettings: {
    availableDays: Array<boolean>;
    from: Date;
    to: Date;
  };
  private requestedAppointments: { customerName: string; date: Date }[];

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    accountType: string,
    profession: string,
    settings: { visibility: boolean } = { visibility: false },
    scheduleSettings: {
      availableDays: Array<boolean>;
      from: Date;
      to: Date;
    } = {
      availableDays: new Array<boolean>(7).fill(false),
      from: new Date(),
      to: new Date()
    },
    requestedAppointments: { customerName: string; date: Date }[] = []
  ) {
    super(uid, firstName, lastName, username, email, accountType);
    this.profession = profession;
    this.settings = settings;
    this.scheduleSettings = scheduleSettings;
    this.requestedAppointments = requestedAppointments;
  }

  getTitle() {
    return this.profession + " " + this.getLastName();
  }

  getProfession() {
    if (this.isProfessionist()) {
      return this.profession;
    } else {
      return null;
    }
  }

  setProfession(val: string) {
    this.profession = val;
  }

  getSetting() {
    return this.settings;
  }

  setSettings(val: { visibility: boolean }) {
    this.settings = val;
  }

  getScheduleSettings() {
    return this.scheduleSettings;
  }

  setScheduleSettings(val: {
    availableDays: Array<boolean>;
    from: Date;
    to: Date;
  }) {
    this.scheduleSettings = val;
  }

  getSchedule() {
    return this.requestedAppointments;
  }

  addToSchedule(apppointment: { customerName: string; date: Date }) {
    this.requestedAppointments.push(apppointment);
  }

  removeFromSchedule(index: number) {
    this.requestedAppointments.splice(index, 1);
  }
}
