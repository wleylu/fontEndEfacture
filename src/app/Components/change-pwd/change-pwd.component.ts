import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Password } from 'src/app/ForceMdp';
import { User } from 'src/app/model/user.model';
import { Utilisateur } from 'src/app/model/utilisateur.model';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent implements OnInit {

  firstConnexionForm! : FormGroup;
  password = '';
  password1 = '';
  password2 = '';
  submitted: boolean = false;
  user = new Utilisateur();
  compteuserObj = new Utilisateur();
  erreur = 0;
  z : boolean;
  errorAlert: boolean;
  errorAlert1: boolean;
  confirmErreur!:number;
  loginUser:any = localStorage.getItem('tentativeLogin');
  constructor( private authService : AuthService, private formbuilber: FormBuilder,
    private router:Router) { }

  ngOnInit(): void {
    this.firstConnexionForm = this.formbuilber.group({
      password : ['',Validators.required],
      password1 : ['',[Validators.required, Password, Validators.minLength(8)]],
      confirmPassword: ['',[Validators.required, Password, Validators.minLength(8)]]
      }
      );
      this.loginUser = localStorage.getItem('tentativeLogin');
  }

  get f(): { [key: string]: AbstractControl } {
    return this.firstConnexionForm.controls;
  }
  isControle(controlName: string, validationType: string){
    const control = this.firstConnexionForm.controls[controlName];
      if (!control) {
        return false;
      }
      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
  }

  tailleMdp(){
    if (this.firstConnexionForm.value.password1.lenght < 8) {
      this.z = true

    }
  }
// onLoggedin()
// {
//   this.authService.login(this.formValue.value.login, this.formValue.value.password).subscribe(res=>{
//     //console.log(res);
//     if(res !== null && res.status==1 && res.validation==1 && res.bloquser==0){
//       //console.log(res);
//       localStorage.setItem('isAuth',JSON.stringify(res));
//       this.router.navigate(['/firstConnection']);
//       //this.router.navigate(['app/compteconnexion']);
//     }else{
//       //console.log(res);
//       this.router.navigate(['/connection']);
//     }
//   },
//   err=>{
//     alert("une erreure c'est produite");
//   })

//    /* authentification()
//     { this.router.navigate(['/app/accueil'])} */

// }

  onLoggedin(){
    const controls = this.firstConnexionForm.controls;
    if (this.firstConnexionForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    //this.compteuserObj.password1 = this.firstConnexionForm.value.password;
    //console.log(this.firstConnexionForm.value.password1)
    //console.log(this.firstConnexionForm.value.confirmPassword)


    if (this.firstConnexionForm.value.password1 != null && this.firstConnexionForm.value.password1 != '') {
      //console.log('oook');
      //console.log(localStorage.getItem('login'));

      if (this.firstConnexionForm.value.password1===this.firstConnexionForm.value.confirmPassword) {

        //console.log("mot de passe modifier avec succes");
        this.compteuserObj.login=this.loginUser;
        this.compteuserObj.password=localStorage.getItem('dwp');
        this.compteuserObj.password1=this.firstConnexionForm.value.password1;
        console.log(this.compteuserObj.password1);
        console.log(this.compteuserObj.login);
        console.log(this.compteuserObj.password);
        //console.log(localStorage.getItem('login'))
        //console.log(localStorage.getItem('password'))
        //console.log(this.compteuserObj);
        //alert(this.loginUser +'loguser' + localStorage.getItem('logFirst') + localStorage.getItem('premCo'))
        if (this.firstConnexionForm.value.password === localStorage.getItem('confirmationTransation')) {
          this.authService.firstconnexion(this.compteuserObj).subscribe(res=>{
            if (res.password !== res.password1) {
              console.log(res);
              this.router.navigate(['/connexion'])
            } else {
              //console.log("erreurs");
              this.confirmErreur=5
            }

      },
      err=>{
        this.router.navigate(['/firstConnexion']);
        alert("une erreure c'est produite");
      })
        }  else {
         this.confirmErreur = 4
        }
        localStorage.removeItem('isAuth');
        localStorage.removeItem('bloquser');
        localStorage.removeItem('client');
        localStorage.removeItem('dateCreation');
        localStorage.removeItem('email');
        localStorage.removeItem('habilitation');
        localStorage.removeItem('login');
        localStorage.removeItem('nom');
        localStorage.removeItem('password');
        localStorage.removeItem('password1');
        localStorage.removeItem('password2');
        localStorage.removeItem('prenom');
        localStorage.removeItem('status');
        localStorage.removeItem('tel');
        localStorage.removeItem('typePlanfond');
        localStorage.removeItem('validation');
        // this.router.navigate(['/firstconnexion']);
        //this.router.navigate(['app/compteconnexion']);
       // alert("mot de passe modifier avec succes");

      }else{
        alert("erreur");
       this.errorAlert1 = true;
        this.confirmErreur=1;
      }
    }else{
      this.confirmErreur=2;
    }


  }
}
