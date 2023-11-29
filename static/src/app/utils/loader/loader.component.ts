// Copyright (C) 2019-2020 NSEIT Limited, Mumbai. All rights reserved.
//
// This program and the accompanying materials are made available
// under the terms described in the LICENSE file which accompanies
// this distribution. If the LICENSE file was not attached to this
// distribution or for further clarifications, please contact
// legal@nseit.com.

import { Component } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  color = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) {
  }
}
