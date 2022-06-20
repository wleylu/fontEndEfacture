import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
//import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token') as string;
        req = req.clone({
          setHeaders: {
            Authorization: token
          }
        });
      }
      // console.log("9999999999999999999++++++++++++++++8888888888888888888888888");

      //   console.log(req);
      //   console.log("AZZZZZZZZZZZZZZZZZZZZZZZZAAAAAAAAAAAAAAAAAAAAAAGGGGGGGGGGGG");
      // console.log("9999999999999999999++++++++++++++++8888888888888888888888888");

      return next.handle(req);

    }
}
