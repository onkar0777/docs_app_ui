import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customer: string;
  apiResponse = { message: '', success: null };

  constructor(private reqService: RequestsService) { }

  ngOnInit() {
  }

  createRequest() {
    this.reqService.addRequest(this.customer).subscribe(x => {
      this.apiResponse = x;
      this.customer = null;
    });
  }
}
