import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js';

import { financial } from '../../Entity/Financial';
import { FinancialService } from '../../Services/financial.service';

@Component({
  selector: 'app-emitent-details',
  templateUrl: './emitent-details.component.html',
  styleUrls: ['./emitent-details.component.css']
})
export class EmitentDetailsComponent implements AfterViewInit {

  @ViewChild('barChart', { static: false }) chart: ElementRef;

  _lbls: string[] = new Array();
  _data: any[] = new Array();
  _income: any[] = new Array();

  constructor(private financialService: FinancialService) { }

  ngAfterViewInit() {

    this.financialService.getAll().subscribe(finArr => {
      
      finArr.forEach((fin) => {
        this._lbls.push(fin.year.toString());
        this._data.push(fin.revenue);
        this._income.push(fin.operatingIncome);
      });

      this.createChart();
    });
  }

  createChart() {

    //var ctx = document.getElementById('myChart');
    const ctx = this.chart.nativeElement.getContext('2d');

    const revenueLineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this._lbls,
        datasets: [{
          label: 'Выручка',
          data: this._data,
          backgroundColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
          {
            label: 'Операционная прибыль',
            data: this._income,
            backgroundColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

}
