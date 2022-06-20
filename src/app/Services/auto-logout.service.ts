import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  constructor(public authService: AuthService,   private modalService: NgbModal) { }
  public autoLogout(err:any,router:Router) {
    if (err==401) {
      console.log("ooook")
      this.authService.auditLogout(sessionStorage.getItem('authlogin')).subscribe(res=>{

        console.log(res);
     })
      localStorage.removeItem('authisAuth1');
      localStorage.removeItem('authbloquser');
      localStorage.removeItem('authclient');
      localStorage.removeItem('authdateCreation');
      localStorage.removeItem('authemail');
      localStorage.removeItem('authhabilitation');
      sessionStorage.removeItem('authlogin');
      localStorage.removeItem('authnom');
      localStorage.removeItem('authpassword');
      localStorage.removeItem('authpassword1');
      localStorage.removeItem('authpassword2');
      localStorage.removeItem('authprenom');
      localStorage.removeItem('authstatus');
      localStorage.removeItem('authtel');
      localStorage.removeItem('authtypePlanfond');
      localStorage.removeItem('authvalidation');
      sessionStorage.removeItem('client')
      localStorage.clear()

      localStorage.removeItem('authisAuth1');
      localStorage.removeItem('authbloquser');
      localStorage.removeItem('authclient');
      localStorage.removeItem('authdateCreation');
      localStorage.removeItem('authemail');
      localStorage.removeItem('authhabilitation');
      localStorage.removeItem('authlogin');
      localStorage.removeItem('authnom');
      localStorage.removeItem('authpassword');
      localStorage.removeItem('authpassword1');
      localStorage.removeItem('authpassword2');
      localStorage.removeItem('authprenom');
      localStorage.removeItem('authstatus');
      localStorage.removeItem('authtel');
      localStorage.removeItem('authtypePlanfond');
      localStorage.removeItem('authvalidation');
      localStorage.removeItem('client')
      localStorage.clear()
      localStorage.removeItem('tentativeLogin');
      localStorage.removeItem('userConnect');
      setTimeout(() => {
        router.navigate(['/connexion']);
      }, 1000);
      this.modalService.dismissAll()
    }
  }
}
