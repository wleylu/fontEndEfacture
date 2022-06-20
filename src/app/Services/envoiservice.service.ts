import { Injectable, OnInit } from '@angular/core';
import { Envoi } from '../model/envoi.model';

@Injectable({
  providedIn: 'root'
})
export class EnvoiserviceService {

  // envois: Envoi[] = [
  //   {
  //     identifiant:982732728,
  //     periode:'052016',
  //     dateLimite:'19/07/2021',
  //     montant:98800,
  //     numFacture:'236',
  //     numCpt:'1242526627',
  //     facturier:'SODECI',
  //     typespaiement:'Total'

  //   },
  //   {
  //     identifiant:123456789,
  //     periode:'20392',
  //     dateLimite:2021/12/21,
  //     montant:4200,
  //     numFacture:'236',
  //     numCpt:'2829202020',
  //     facturier:'CIE',
  //     typespaiement:'Partiel'
  //   }
  // ];


  // constructor() { }

  // onGet(){
  //   return this.envois
  // }

  // onGetEnvoi(id: Number){
  //   return this.envois.find(x=>x.identifiant === id);

  // }

  // onAdd(envoi: Envoi){
  //   this.envois.push(envoi);
  // }

  // onDelete(id: Number){
  //   let envoi = this.envois.find(x=>x.identifiant == id);
  //   let index = this.envois.indexOf(envoi,0);
  //   this.envois.splice(index,1);
  // }

  // onUpdate(envoi: Envoi){
  //   let oldEnvoi = this.envois.find(x=>x.identifiant === envoi.identifiant);

  //   oldEnvoi.montant = envoi.montant;
  //   oldEnvoi.numFacture = envoi.numFacture;
  // }
}
