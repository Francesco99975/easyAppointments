import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"]
})
export class AppointmentComponent implements OnInit {
  @Input() professionistName: string;
  @Input() time: Date;

  constructor() {}

  ngOnInit() {}
}
