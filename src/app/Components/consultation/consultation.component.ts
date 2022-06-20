import { HttpClient } from '@angular/common/http';
import { Consultation } from './../../model/consultation.model';
import { FactureService } from './../../Services/facture.service';
import { Envoi } from 'src/app/model/envoi.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvoiserviceService } from 'src/app/Services/envoiservice.service';
import { Component, OnInit } from '@angular/core';
import { SearchfilterPipe } from 'src/app/searchfilter.pipe';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AutoLogoutService } from 'src/app/Services/auto-logout.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css'],
})
export class ConsultationComponent implements OnInit {
  identifiant = new FormControl('');
  editForm: FormGroup;
  AllFacturier:any;
  ErrorForm : FormGroup;
  facturier = new FormControl('');
  searchTerm: string;
  searchString: string;
  searchString1: string;
  envois: any;
  allEnvois: any;
  p: number = 1;
  selectedConsultation: Consultation;
  idActuel: number;
  id: any;
  expiration:any;
  posts: any = [];
  collection = [];
  dateReglement : any;
  constructor(
    private envoiService: FactureService,
    public datepipe: DatePipe,
    private httpClient: HttpClient,
    private authLogin: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private factureService : FactureService,
    public autoLogoutService: AutoLogoutService
  ) {
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngOnInit() {
    this.ListHistorique();
    this.editForm = this.fb.group({
      startDate: [''],
      endDate :[''],
    });
    this.GetFacturier()
  }


  ListHistorique() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    this.httpClient
      .get<any>(environment.urlFinal +'efacture/consultation/' + localStorage.getItem('login'))
      .subscribe((Historique) => {
        console.log(Historique);
        this.allEnvois = Historique;
        this.dateReglement = Historique[0].dateRegle
        //alert(this.dateReglement)
        console.log(this.allEnvois)
      },
      (error)=>{
        console.log(error)
        this.ErrorForm = this.fb.group({

          httpStatusCode: error.status,
          methode : 'ListHistorique',
          login: localStorage.getItem('login'),
          message : JSON.stringify(error.name),
          description:JSON.stringify(error.message) + '\n'+ JSON.stringify(error.error),
        });
        this.factureService.Envoierror(this.ErrorForm.value).subscribe((res)=>{
          console.log(this.ErrorForm.value);
          console.log(res)
        })

       this.autoLogoutService.autoLogout(error.status,this.router);
        this.router.navigate(['home'])
      });
  }

  onSelect(envoi: Consultation) {
    this.router.navigate(['/consultation/print'], {
      queryParams: { data: envoi.id },
    });
  }

  // search(value: string): void {
  //   this.envois = this.allEnvois.filter((val) =>
  //     val.facturier.toString().toLowerCase().includes(value));
  // }

  // ListHistoriques() {
  //   this.httpClient
  //     .get<any>(environment.apiUrl + 'consultation/recherche/' + this.idActuel)
  //     .subscribe((Historique) => {
  //       console.log(Historique);
  //       this.allEnvois = Historique;

  //     });
  // }
  displayDate(startDate:any,endDate:any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });



      startDate=this.editForm.value.startDate;
    endDate=this.editForm.value.endDate;
  //  firstDate=this.formRechercheAudit.value.firstDate
  //  lastDate=this.formRechercheAudit.value.lastDate
     console.log(startDate +''+ endDate);
     this.factureService.rechercheByDateBetween(startDate,endDate).subscribe((data) => {
      console.log(data);
      this.allEnvois = data;

     },err => {
      this.autoLogoutService.autoLogout(err.status,this.router);
     })
    // let start_date =this.datepipe.transform(this.editForm.value.startDate, 'dd-MM-yyyy');
    // console.log(start_date + typeof start_date);
    // let end_date =this.datepipe.transform(this.editForm.value.endDate, 'dd-MM-yyyy');
    // console.log(end_date)


    //   // Here reverse the date format & then convert to TIMESTAMP
    //   function reverseAndTimeStamp(dateString) {
    //     const reverse = new Date(dateString.split("-").reverse().join("-"));
    //     return reverse.getTime();
    //     }
    //      // A simple array filter like what you did
    //      const  selectedMembers = this.allEnvois.filter(m => {
    //      return reverseAndTimeStamp(m.dateRegle) > reverseAndTimeStamp(start_date) && reverseAndTimeStamp(m.dateRegle) < reverseAndTimeStamp(end_date)
    //      }
    //      );
    //       this.allEnvois = selectedMembers;
    //       console.log(this.allEnvois); // the result objects

  }


  SearchUser1(startDate:any,endDate:any): void{
    startDate=this.editForm.value.startDate;
    endDate=this.editForm.value.endDate;
  //  firstDate=this.formRechercheAudit.value.firstDate
  //  lastDate=this.formRechercheAudit.value.lastDate
     console.log(startDate +''+ endDate);
     this.factureService.rechercheByDateBetween(startDate,endDate).subscribe((data) => {
      console.log(data);
      this.allEnvois = data;

     },err => {
      this.autoLogoutService.autoLogout(err.status,this.router);
     })

}

reset(){
 this.ngOnInit();
}


alphaNumberOnly (e) {  // Accept only alpha numerics, not special characters
  var regex = new RegExp("^[a-zA-Z0-9 ]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (regex.test(str)) {
      return true;
  }

  e.preventDefault();
  return false;
}

onPaste(e) {
  e.preventDefault();
  return false;
}

omit_special_char(event)
{
   var k;
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}

numberOnly(event): boolean {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

GetFacturier() {
  this.httpClient.get<any>(environment.urlFinal +'efacture/facturier/Allfacturier').subscribe(
    (ListeFacturier) => {
      this.AllFacturier = ListeFacturier;
      console.log(this.AllFacturier);
    },
    (error) => {
      this.ErrorForm = this.fb.group({
        httpStatusCode: '407',
        methode: 'GetFacturier',
        login: localStorage.getItem('client'),
        message: JSON.stringify(error.name),
        description:
          JSON.stringify(error.message) + '\n' + JSON.stringify(error.error),
      });
      this.factureService
        .Envoierror(this.ErrorForm.value)
        .subscribe((res) => {
          console.log(this.ErrorForm.value);
          console.log(res);
        });
        this.autoLogoutService.autoLogout(error.status,this.router);
    }
  );
}
onChange(valeur){
  //console.log(valeur);
  if(valeur == 'ALL'){
    //window.location.reload()
   // alert('OK')
   this.allEnvois = ''
  }
}
}
