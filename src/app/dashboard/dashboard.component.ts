import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestsService } from '../requests.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['requestId', 'customerId', 'timeElapsed', 'status', 'driver'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public reqService: RequestsService) { }

  ngOnInit() {
    this.getRequests();
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

  getRequests() {
    this.reqService.getRequests().then(arr => {
      arr.map(x => {
        const duration = moment.duration(moment().diff(moment(x.created_at)));
        x.create_time = this.getFormattedTimeLapsed(duration);
      });
      this.dataSource = new MatTableDataSource(arr);
      this.dataSource.sort = this.sort;
    });
  }
}
