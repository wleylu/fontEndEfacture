import { Login } from './../../model/login.model';
import { User_login } from 'src/app/model/user_login.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { Injectable } from '@angular/core';
import { NgxCaptchaModule } from 'ngx-captcha';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HomeComponent } from '../home/home.component';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FactureService } from 'src/app/Services/facture.service';
import { Utilisateur } from 'src/app/model/utilisateur.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from 'src/app/Services/auto-logout.service';
import { DatePipe } from '@angular/common';
import { expirationModel } from 'src/app/model/exp.model';
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class ConnexionComponent implements OnInit {
  cptBloque : boolean = false;
  formValue! : FormGroup;
  user = new Utilisateur();
  erreurAuth!:number;
  erreur: boolean;
  falseLogin : boolean;
  blockUser: boolean;
  mdpDate : any;
  invalidLogin = false;
  dated : any;
  datef: any;
  nbj : any;
  myDate =  new Date(Date.now());
  expiration : any;
  adresseEmail:any;
  constructor(
    public autoLogoutService: AutoLogoutService, public datePipe : DatePipe,
    private authService : AuthService, private formbuilber: FormBuilder,private router:Router, private httpClient:HttpClient) {}

  ngOnInit() {
    this.formValue = this.formbuilber.group({

      login : [''],
      password1: ['']

      })


this.expirationDate()
      //console.log(this.getDiffDays('07/01/2021', new Date()));
  }




expirationDate(){
  this.httpClient.get(environment.urlFinal +'efacture/pwdParam/allParam').subscribe((res)=>{
    this.expiration = res[0].nbJours;
    this.adresseEmail = res[0].mailEfacture;
    localStorage.setItem('expediteur',this.adresseEmail)
    console.log(res)
  })
}

  numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;

      }

  onLoggedin(){
    if (this.formValue.value.login === '' || this.formValue.value.password1 === '') {
      this.erreur = true;
    }else{
  console.log(this.formValue.value.login);
  console.log(this.formValue.value.password1);
  localStorage.setItem('tentativeLogin', this.formValue.value.login);
  this.authService.authentification(this.formValue.value.login, this.formValue.value.password1).subscribe(res=>{
    console.log(res);
    this.mdpDate = res.dateMdp;
    console.log(this.mdpDate);
    localStorage.setItem('dwp',res.password);

    var i = new Date(Date.now());
    //console.log(i + 'Date1');
    var p =  this.datePipe.transform(i,'yyyy-MM-dd')
    //console.log(p)

    this.dated = new Date(this.mdpDate).getTime();
    this.datef = new Date(p).getTime();
   this.nbj = (this.datef - this.dated)/86400000;
   //this.nbj = 41;

    console.log(this.nbj + 'vrai  ' + typeof this.nbj)
    localStorage.setItem('confirmationTransation', this.formValue.value.password1)
    if(this.nbj >= this.expiration){
      Swal.fire({
        title: 'Mots de passe expiré !',
        text: "Veuillez le mofifier s'il vous plaît...",
        icon: 'warning',
       showCancelButton: false,
        confirmButtonColor: '#00A300',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      this.router.navigate(['reinitialiser'])
    }
    else{
      //localStorage.setItem('confirmationTransation', this.formValue.value.password1)
      if ((res.habilitation == 'ROLE_USER_PERSO' || res.habilitation == 'ROLE_USER_COM')) {
        if(res.bloquser === 0 && res.validation ===1 && res.status === 1){

        var nomPrenom = res.nom + ' ' + res.prenom;
                    console.log(nomPrenom);
                    var nom = res.nom;
                    localStorage.setItem('nom', nom);
                    var login = res.login;
                    var prenom = res.prenom;
                    var contact = res.tel;
                    var email = res.email;
                    var typePlafond  = res.typePlafond;
                    var typeConfirmation = res.typeComfirmation;
                    var CptMaxTransaction = res.cptNbTransaction;
                    var CptMaxMontant = res.cptMontant;
                    localStorage.setItem('MaxMontant', CptMaxMontant);
                    localStorage.setItem('MaxTransac', CptMaxTransaction);
                    //localStorage.setItem('typePlafond', typePlafond);
                    //localStorage.setItem('typeConfirmation', typeConfirmation);
                    localStorage.setItem('email', email);
                    localStorage.setItem('prenom', prenom);
                    localStorage.setItem('contact', contact);
                    localStorage.setItem('nomPrenom', res.nom + ' ' + res.prenom);
                    localStorage.setItem('login',login);
                    localStorage.setItem('confirm', res.password1);
                    localStorage.setItem('rcCLient', res.client);

                    //this.loginservice.ValeurStorage(this.loginn.login);


                    localStorage.setItem('authisAuth1',JSON.stringify(res));
                    localStorage.setItem('authbloquser',JSON.stringify(res.bloquser));
                    localStorage.setItem('authclient',JSON.stringify(res.client));
                    localStorage.setItem('authdateCreation',JSON.stringify(res.dateCreation));
                    localStorage.setItem('authemail',JSON.stringify(res.email));
                    localStorage.setItem('authhabilitation',JSON.stringify(res.habilitation));
                    sessionStorage.setItem('authlogin',res.login);
                    localStorage.setItem('authnom',res.nom);
                    localStorage.setItem('authpassword',res.password);
                    localStorage.setItem('authpassword1',res.password1);
                    localStorage.setItem('authpassword2',res.password2);
                    localStorage.setItem('authprenom',JSON.stringify(res.prenom));
                    localStorage.setItem('authstatus',JSON.stringify(res.status));
                    localStorage.setItem('authtel',JSON.stringify(res.tel));
                    localStorage.setItem('authtypePlanfond',JSON.stringify(res.typePlafond));
                    localStorage.setItem('authtypeConfirm',JSON.stringify(res.typeComfirmation));
                    localStorage.setItem('authvalidation',JSON.stringify(res.validation));
                    let body ={tentative : 0}
                    this.httpClient.put(environment.urlFinal +'efacture/tentativeConnect/'+ localStorage.getItem('tentativeLogin'),body).subscribe((res : any)=>{
                      console.log(res + 'NEW')
                    },err => {
                      this.autoLogoutService.autoLogout(err.status,this.router);
                    });

                    let body2 ={bloquser : 0}
                    this.httpClient.put(environment.urlFinal +'efacture/bloqueUser/'+ localStorage.getItem('tentativeLogin'),body2).subscribe((res : any)=>{
                      console.log(res + 'NEW2')
                    },err => {
                      this.autoLogoutService.autoLogout(err.status,this.router);
                    });
                    //console.log(this.router.navigate(['home']))
                    this.router.navigate(['home']);
                    console.log(localStorage.getItem('authlogin'));
                    this.authService.ValeurStorage(sessionStorage.getItem('authlogin'));
                    //console.log(localStorage.getItem('authpassword'));
                    //this.router.navigate(['app/compteconnexion']);
                    this.invalidLogin = false;
                    // Toast.fire({
                    //   icon: 'success',
                    //   title: 'Connexion réussie !',
                    // });


      }else{
          //alert('1')
          this.falseLogin = false;
          this.blockUser = true;
    Toast.fire({
      icon: 'Erreur',
      title: 'Compte désactivé , Veuillez contacter l\'administrateur de la plateforme',
    });
        }

    } else {
      //console.log(res);
        this.erreurAuth=2;

        //alert('2')

    }
    }









  },

  err=>{
    this.httpClient.get(environment.urlFinal +'efacture/detailUser/'+ localStorage.getItem('tentativeLogin')).subscribe((res : any)=>{
      console.log(res)
      if(res != null){
        Toast.fire({
          icon: 'error',
          title: 'Identifiants incorrects',
        });
//alert('ok')
        let body ={tentative : res.tentative + 1}
        this.httpClient.put(environment.urlFinal +'efacture/tentativeConnect/'+ localStorage.getItem('tentativeLogin'),body).subscribe((newUser : any)=>{
          console.log(newUser + 'NEW')

          if(newUser.tentative ==  5){
            Toast.fire({
              icon: 'Erreur',
              title: 'Nombre de tentatives atteintes, Votre compte est désactivé',
            });
            let body2 = {bloquser : 1}
            this.httpClient.put(environment.urlFinal +'efacture/bloqueUser/' + localStorage.getItem('tentativeLogin'), body2).subscribe((user : any)=>{
              console.log(user + 'BLOK')
            },err => {
              this.autoLogoutService.autoLogout(err.status,this.router);
            })
          }
        },err => {
          this.autoLogoutService.autoLogout(err.status,this.router);
        });





      }
      else{
        Toast.fire({
          icon: 'error',
          title: 'Identifiants incorrects',
        });
      }

    },err => {
      this.autoLogoutService.autoLogout(err.status,this.router);
    })
   // alert("une erreure c'est produite");
    //alert('3')
    this.falseLogin = true;
            this.blockUser = false;
            // Toast.fire({
            //   icon: 'error',
            //   title: 'Identifiants incorrects',
            // });

  })

  }
  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}

}
