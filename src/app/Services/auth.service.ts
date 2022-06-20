import { Injectable } from '@angular/core';
import { User_login } from '../model/user_login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../model/login.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Mail } from '../model/mail.model';
//import { User } from '../model/user.model';
import { map } from 'rxjs/operators';
import { Utilisateur } from '../model/utilisateur.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  header: HttpHeaders;
  headeroff: HttpHeaders;
  redirectUrl!: string;
  users: User_login;
 // private  urlServeurApi=environment.urlServeurApi;
  constructor(private httpClient: HttpClient, private router : Router) {
    this.users = new User_login();
  }
  loggedUser: string;

//   authenticates(login: Login): Observable <any> {

//     const UserData =  login.login + ':' + login.password;
//     this.header = new HttpHeaders({'Access-Control-Allow-Origin': '*','Authorization': 'Basic ' + btoa(UserData)});
//     this.header.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     this.header.append('Access-Control-Allow-Headers', 'Content-Type, application/x-www-form-urlencoded, X-Requested-With');
//     this.header.append('Status Code', '200');
//     // this.loggedUser = login.login;
//     return this.httpClient.post<any>('http://10.181.5.23:8686/FinalEfacture1/efacture/'+'authenticate', login).pipe(map(
//       userData=>{
//         let tokenStr = "Bearer " + userData.token;
//         localStorage.setItem("token", tokenStr);
//         console.log("--------------------");
//         console.log(userData);
//         console.log("--------------------");
//         return userData;
//       }
//     ));
//     // localStorage.setItem('username', login.login);
//     // localStorage.setItem('confirm', login.password);

// }

// authenticate(username : string, password: string): boolean{
// // this.users = this.authenticate(login);
//   if (username === "kone" && password === "koneraouf" ) {
//         localStorage.setItem('username', username)
//         this.loggedUser = username
//         return true;
//       } else {
//         return false;
//       }
//     }
public login(login:string, password:string):Observable<Utilisateur> {
  return this.httpClient.post<any>(environment.urlFinal +'efacture/login', { 'login': login, 'password':password })
}
// public authentification(login:string, password1:string):Observable<User> {
//   return this.http.post<any>(`${this.urlServeurApi}/connexion`, { 'login': login, 'password1':password1 })
// }
authentification(login: any, password1: string) {
  const UserData =  login + ':' + password1;

  this.header = new HttpHeaders({'Access-Control-Allow-Origin': '*','Authorization': 'Basic ' + btoa(UserData)});
  // this.header = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
  this.header.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  this.header.append('Access-Control-Allow-Headers', 'Content-Type, application/x-www-form-urlencoded, X-Requested-With');
  this.header.append('Status Code', '200');
  return this.httpClient
    .post<any>(environment.urlFinal+ "authenticate", { login, password1})
    .pipe(
      map(userData => {
        localStorage.setItem('login', login)
        this.loggedUser = login
        let tokenStr = "Bearer " + userData.token;
        localStorage.setItem("token", tokenStr);
        //let user = localStorage.getItem('client')
       // console.log("--------------------");
       // console.log(userData);
       // console.log("--------------------");
        return userData;
      })
    );
}


PremiereConnect(login: any, password: string) {

  return this.httpClient
    .post<any>(environment.urlFinal +'efacture/user/connexion', { login, password})
    .pipe(
      map(userData => {
        localStorage.setItem('login', login)
        this.loggedUser = login
        let tokenStr = "Bearer " + userData.token;
        localStorage.setItem("token", tokenStr);
        //let user = localStorage.getItem('client')
       // console.log("--------------------");
       // console.log(userData);
       // console.log("--------------------");
        return userData;
      })
    );
}
    ValeurStorage(client: string): void{
      sessionStorage.setItem('client', client);
      this.loggedUser = client;
    }

    isUserLoggedIn() {
      let user = sessionStorage.getItem('client')
      // console.log((user === null));
      // console.log('VALEURS USERS LOGIN' + user);
      return user;
    }

    logOut() {
      localStorage.removeItem('client');
      localStorage.removeItem('confirm')
      localStorage.clear()
      // console.log('DECONNEXION'+ localStorage.getItem('username') )
    }



    // public login(login:string, password:string):Observable<User> {
    //   return this.httpClient.post<User>(environment.apiUrl+'/login', { 'login': login, 'password':password })
    // }
    // public authentification(login:string, password1:string):Observable<User> {
    //   return this.httpClient.post<any>(environment.apiUrl+ '/connexion', { 'login': login, 'password1':password1 })
    // }
    public emails(data:Mail):Observable<Mail> {
      return this.httpClient.post<any>(`urlMail`, data)
    }

    // public firstconnexion(data:User):Observable<User> {
    //   return this.httpClient.put<any>(environment.apiUrl+'/firstLogin',data)
    // }
    public auditLogout(login:any):Observable<any> {
      return this.httpClient.get<any>(environment.urlFinal +'efacture/deconnexion/'+ login)
    }

    mpasse() {
      this.router.navigate(['app/modificationpassword']);
      }
    public firstconnexion(data:Utilisateur):Observable<Utilisateur> {
      return this.httpClient.put<any>(environment.urlFinal +'efacture/firstLogin',data)
    }

  }
