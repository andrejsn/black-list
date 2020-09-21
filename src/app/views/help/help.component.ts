import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { ObjectsService } from "@shared/services";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"],
})
export class HelpComponent implements OnInit {
  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // set browser title
    this.title.setTitle("Help");
    // set breadcrumb menu
    this.objectsService.setBreadCrumb([
      { route: "/", name: "Home", active: false },
      { route: "/Help", name: "Help", active: true },
    ]);
  }
}
