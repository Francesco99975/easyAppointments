export abstract class User {
  private uid: string;
  private firstName: string;
  private lastName: string;
  private username: string;
  private email: string;
  private accountType: string;

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    accountType: string
  ) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.accountType = accountType;
  }

  getUid() {
    return this.uid;
  }

  setUid(uid: string) {
    this.uid = uid;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getFullName() {
    return this.firstName + " " + this.lastName;
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
}
