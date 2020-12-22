import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { AlertsStore } from './alerts.store';

@Component({
  selector: 'ngtwitch-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
  providers: [AlertsStore]
})
export class AlertsComponent implements OnInit {
  text$ = this.alertsStore.text$;
  opacity$ = this.text$.pipe(map(text => text ? 1 : 0));

  constructor(private alertsStore: AlertsStore) {}

  ngOnInit(): void {  
    this.alertsStore.init();
  }
}
