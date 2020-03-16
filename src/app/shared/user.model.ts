export class User {
  private uid: string;
  private firstName: string;
  private lastName: string;
  private username: string;
  private email: string;
  private accountType: string;
  private profession: string;

  constructor(
    uid: string,
    fistname: string,
    lastName: string,
    username: string,
    email: string,
    accountType: string,
    profession: string
  ) {
    this.uid = uid;
    this.firstName = fistname;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.accountType = accountType;
    if (this.isProfessionist()) this.profession = profession;
    else this.profession = null;
  }

  getUid() {
    return this.uid;
  }

  setUid(uid) {
    this.uid = uid;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getFullName() {
    if (this.accountType === "customer")
      return this.firstName + " " + this.lastName;
    else return this.profession + " " + this.lastName;
  }

  getUsername() {
    return this.username;
  }

  getEmail() {
    return this.email;
  }

  getType() {
    return this.accountType;
  }

  isProfessionist(): boolean {
    return this.accountType === "professional";
  }

  getProfession() {
    if (this.isProfessionist()) {
      return this.profession;
    } else {
      return null;
    }
  }
}
