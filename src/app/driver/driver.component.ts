import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { ActivatedRoute } from '@angular/router';
import { IRequest } from '../request';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';

export interface DriverRequests {
  waiting_requests: IRequest[]; ongoing_requests: IRequest[]; complete_requests: IRequest[];
}

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  allRequests: DriverRequests;
  dataAvailable = false;
  driverId = this.route.snapshot.params.id;

  constructor(private reqService: RequestsService, private route: ActivatedRoute, private snackMsg: MatSnackBar) { }

  ngOnInit() {
    this.driverId = this.route.snapshot.params.id;
    if (this.driverId <= 5) {
      this.getDriverRequests();
    }
  }

  getDriverRequests() {
    this.dataAvailable = false;
    this.reqService.getDriverRequests(this.driverId).then(arr => {
      console.log(arr);
      this.allRequests = arr;
      [...this.allRequests.waiting_requests, ...this.allRequests.ongoing_requests, ...this.allRequests.complete_requests].map(x => {
        const duration = moment.duration(moment().diff(moment(x.created_at)));
        x.create_time = this.getFormattedTimeLapsed(duration);
      });
      [...this.allRequests.ongoing_requests, ...this.allRequests.complete_requests].map(x => {
        const duration = moment.duration(moment().diff(moment(x.accepted_at)));
        x.accept_time = this.getFormattedTimeLapsed(duration);
      });
      this.allRequests.complete_requests.map(x => {
        const duration = moment.duration(moment().diff(moment(x.completed_at)));
        x.complete_time = this.getFormattedTimeLapsed(duration);
      });
      this.dataAvailable = true;
    });
  }

  getFormattedTimeLapsed(duration) {
    // can be further extended for days
    if (duration.get('hours') > 0) {
      return `${duration.get('hours')} hours ${duration.get('minutes')} mins ${duration.get('seconds')} secs`;
    } else if (duration.get('minutes') > 0) {
      return `${duration.get('minutes')} mins ${duration.get('seconds')} secs`;
    } else {
      return `${duration.get('seconds')} secs`;
    }
  }

  selectRequest(req: IRequest) {
    this.reqService.selectRequest(req._id, this.driverId).then(res => {
      console.log(res);
      if (res.success) {
        this.allRequests.waiting_requests = this.allRequests.waiting_requests.filter(x => x._id !== req._id);
        res.data.create_time = this.getFormattedTimeLapsed(moment.duration(moment().diff(moment(res.data.created_at))));
        res.data.accept_time = this.getFormattedTimeLapsed(moment.duration(moment().diff(moment(res.data.accepted_at))));
        this.allRequests.ongoing_requests.unshift(res.data);
        // do some stuff
      } else {
        this.snackMsg.open(res.message, null, { duration: 1000 });
      }
    })
  }

}
