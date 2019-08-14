import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { security } from '../../Entity/Security';

import { SecurityService } from '../../Services/security.service';


@Component({
  selector: 'app-deal-add',
  templateUrl: './deal-add.component.html',
  styleUrls: ['./deal-add.component.css']
})
export class DealAddComponent implements OnInit {

  securities: security[];

  dealForm: FormGroup;

  constructor(private fb: FormBuilder, private securityService: SecurityService) {
    this.dealForm = fb.group({
      'securityId': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.securityService.getAll().subscribe(data => {
      this.securities = data;
    });
  }

}
