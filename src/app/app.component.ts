import { AuthService } from './Services/auth.service';
import { ConnexionComponent } from './Components/connexion/connexion.component';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AutoLogoutService } from './Services/auto-logout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../app/css/bootstrap.min.css'],
})
export class AppComponent    {
  public isMenuCollapsed = true;
  username: string;
  confirm: string;
  client: string;
  stringCompte: any;
  objCompte: any;
  f: [];
  title = 'Efacture';
  all : any
  constructor(public connexion: AuthService,
    private router: Router,private httpClient : HttpClient,public autoLogoutService: AutoLogoutService) {}

  // ngOnDestroy() {
  //   localStorage.clear();
  //   alert('close');
  //   localStorage.removeItem('username_key');
  //   localStorage.removeItem('raouf');
  //   localStorage.removeItem('client')
  // }

  ngOnInit() {
    // console.log(this.username);
    this.client = localStorage.getItem('nomPrenom');
    //this.Comptes()
  }

  public doUnload(): void {
    this.doBeforeUnload();
    localStorage.removeItem('username_key');
    localStorage.removeItem('raouf');
    localStorage.removeItem('client')
  }

  // Keep me Signed in
  public doBeforeUnload(): void {
    // Clear localStorage
    alert('asdasdasdjhfvyu');
    localStorage.removeItem('username_key');
    localStorage.removeItem('raouf');
    localStorage.removeItem('client')
  }

  public storeData(txt): void {
    alert('ok');
    localStorage.setItem('username_key', txt);
    localStorage.setItem('raouf', 'raouf');
  }



  // public Comptes() {
  //   this.httpClient
  //     .get(
  //       environment.UrlRacineT24 +
  //         localStorage.getItem('login')
  //     )
  //     .subscribe(
  //       (res: any) => {
  //         console.log(res);
  //         this.all = res;
  //         var i;

  //         this.stringCompte = JSON.stringify(this.all.comptes);

  //         this.objCompte = JSON.parse(this.stringCompte);
  //         for (i in this.objCompte) {
  //           this.f = this.objCompte[i].compte;

  //           //console.log(this.objCompte[i].compte);
  //           console.log(console.log(this.f));
  //         }
  //         console.log(this.objCompte);
  //         //console.log(this.stringCompte)
  //       },
  //       (err) => {
  //         this.autoLogoutService.autoLogout(err.status, this.router);
  //       }
  //     );
  //   return this.objCompte;
  // }


}
