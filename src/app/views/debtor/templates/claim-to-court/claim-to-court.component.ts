import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';

enum Courts {
  arbitration,
  state
}
interface ContractClaimToCourt extends Contract {
  place: string, number: string, judgesNumber: number, court: Courts, stateCourtName: string, stateCourtAddress: string, attachments: string[], claimToCourtDate: Date, saveDoc: boolean
}

@Component({
  selector: 'app-claim-to-court',
  templateUrl: './claim-to-court.component.html',
  styleUrls: ['./claim-to-court.component.css']
})
export class ClaimToCourtComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

