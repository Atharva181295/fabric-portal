// Copyright (C) 2019-2020 NSEIT Limited, Mumbai. All rights reserved.
//
// This program and the accompanying materials are made available
// under the terms described in the LICENSE file which accompanies
// this distribution. If the LICENSE file was not attached to this
// distribution or for further clarifications, please contact
// legal@nseit.com.
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoaderService } from './utils/loader/loader.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(public loaderService: LoaderService) {
  }

  handleAuthError(err: HttpErrorResponse): Observable<never> {
    if (err.status === 403) {
      window.location.href = '/';
    }
    return throwError(err);
  }

  intercept(request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.loaderService.hide();
          return event = event.clone({
            body: event.body
          });
        }
        return event;
      },
        (error) => {
          this.handleAuthError(error);
        }
      ),
      finalize(() => {
        this.loaderService.hide();
      }),
    );
  }
}
