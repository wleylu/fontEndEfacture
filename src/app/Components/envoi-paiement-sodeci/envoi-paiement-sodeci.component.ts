import { T24Transaction } from './../../model/t24Transaction.model';
import { envoiT24Transaction } from './../../model/envoiT24Transaction.model';
import { Consultation } from './../../model/consultation.model';
import { ListeConsul } from './../../model/listeConsultation.model';
import { Observable } from 'rxjs';
import { TransactionService } from './../../Services/transaction.service';
import { Paiement } from './../../model/paiement.model';
import { FactureService } from './../../Services/facture.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvoiserviceService } from './../../Services/envoiservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Identifiant } from './../../model/identifiant.model';
import { Envoi } from './../../model/envoi.model';
import {
  FormGroup,
  FormBuilder,
  NgForm,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Facture } from './../../model/facture.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Transaction } from 'src/app/model/transaction.model';
import { Commissions } from 'src/app/model/commission.model';
import { ConsultationComponent } from '../consultation/consultation.component';
import { environment } from 'src/environments/environment';
import { ModeleFacture } from 'src/app/model/cieFacture.model';
import { ListeCIE } from 'src/app/model/ListeDesFacturesCie.model';
import { Cietransaction } from 'src/app/model/cietransaction.model';
import { TraitementCie } from 'src/app/model/traitementCie.model';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { timeout } from 'rxjs/operators';
import { Taille } from 'src/app/form';
import { AutoLogoutService } from 'src/app/Services/auto-logout.service';
import { SodeciFacture } from 'src/app/model/testFacture.model';
import { EmissionSodeci } from 'src/app/model/EmissionSodeci.model';
import { ReglementSodeci } from 'src/app/model/ReglementSodeci.model';
import { NouveauTransaction } from 'src/app/model/NewT24Transact.model';

@Component({
  selector: 'app-envoi-paiement-sodeci',
  templateUrl: './envoi-paiement-sodeci.component.html',
  styleUrls: ['./envoi-paiement-sodeci.component.css'],
})
export class EnvoiPaiementSodeciComponent implements OnInit {
  newId: any
  id: any;
  noOper: any;
  identifiantHistorique: any;
  @ViewChild('modalTest') modalTest;
  @ViewChild('load') load;
  number: number;
  confirm: string;
  typeConfirmation: number;
  ErrorForm: FormGroup;
  show: boolean = false;
  show1: boolean = false;
  listeFactures: Facture;
  searchTerm: string;
  searchString: string;
  private deleteId: number;
  facturier = null;
  facturiers = [];
  closeResult: string;
  editForm: FormGroup;
  ConfirmForm: FormGroup;
  myForm: FormGroup;

  envois: Envoi[];
  allEnvois: Envoi[];
  testFacture: any;

  reponseT24: any;
  commissions: any;
  retour: any;
  mntTimbre: any;
  mntFrais: any;
  mntFraisMarchand: any;
  numCpt: any;
  consultation: any;
  identifiant = '';
  typeFact = '';
  identifiantFacture: Identifiant;
  paiementFacture: NouveauTransaction;
  facture: Facture;
  envoiis: Envoi;
  t24transaction: envoiT24Transaction;
  ReglementFactureSodeci: ReglementSodeci;
  historique: ListeConsul;
  ref: any;
  datePaiement: any;
  totalHisto: any;
  cie_sodeci: boolean = false;
  public statutT24: any;
  contrat: any;
  typePlafonnement: any;
  MessageTraitement: any;
  ReferenceContrat: any;
  AdresseTechnique: any;
  NombreFacture: any;
  MontantTotal: any;
  CodeTraitement: any;
  FactureSodeci: any;
  ListeFactureSodeci: number;
  errorMessage: any;
  stringJson: any;
  stringObject: any;
  sodeciTransaction: Cietransaction;
  ListeretourPaiementCie: any;
  maDate: any;
  NewDate: any;
  ReferenceT24: any;
  MailEnvoi: FormGroup;
  referenceCie: any;
  username: string;
  JsonServer: string = 'http://localhost:3000/FACTURE?AdresseTechnique=';
  erreurCode: boolean = false;
  mdp: any;
  otp: any;
  all: any;
  loginC: any;
  stringCompte: any;
  objCompte: any;
  Facture = {
    CodeTraitement: 1,
    MessageTraitement: 'SUCCES',
    ReferenceContrat: '024314767000',
    AdresseTechnique: '0240633900590',
    NombreFacture: 3,
    MontantTotal: 0.0,

    ListeDesFactures: [
      {
        CODE_TYP_FAC: 'EG',
        TYP_FAC: "Facture d'Emission Normale",
        PER_FAC: '03/2020',
        NUM_FAC: '000097870103202001',
        MONTANT_TOTAL: 8685,
        SOLDE_FACTURE: 6260,
        MONTANT_PENALITE: 2425,
        SIGNE: '+',
        DATE_LIMIT: '15/07/2020',
      },
      {
        CODE_TYP_FAC: 'ACC',
        TYP_FAC: 'Paiement par avance',
        PER_FAC: '12/2018',
        NUM_FAC: '000097870111201801',
        MONTANT_TOTAL: 8545,
        SOLDE_FACTURE: 8545,
        MONTANT_PENALITE: 0,
        SIGNE: '-',
        DATE_LIMIT: '',
      },
    ],
  };
  SODECIFACTURE: any;
  FacturierSodeci: string = 'SODECI';
  typeConfirm: any;
  Compteur: any;
  ComptTransacMax: any;
  ComptMontantMax: any;
  nbrMaxTransaction: any;
  nbrMaxMontant: any;
  Alltype: any;
  f: [];
  dat: any;
  mailEnvoyeur: any;
  collection = [];
  refExterne: any;
  paramCommissions: any;
  statutTransaction: string;
  constructor(
    private httpClient: HttpClient,
    private envoiService: EnvoiserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private factureService: FactureService,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    public autoLogoutService: AutoLogoutService
  ) {
    this.envoiis = new Envoi();
    this.identifiantFacture = new Identifiant();
    this.paiementFacture = new NouveauTransaction();
    this.numCpt = this.getComptes();
    this.facture = new Facture();
    this.historique = new ListeConsul();
    this.t24transaction = new envoiT24Transaction();
    this.sodeciTransaction = new Cietransaction();
    this.ReglementFactureSodeci = new ReglementSodeci();
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngAfterViewInit(): void {
    this.openModal();
  }
  toggleOut() {
    this.isShown = false;
  }
  ngOnInit() {

    this.httpClient
      .get<any>(environment.urlFinal + 'efacture/commissions')
      .subscribe((AllCommission) => {
        this.paramCommissions = AllCommission[0];
        console.log(this.paramCommissions)
      });
    var dt = new Date();
    var t = moment(dt, 'dd-MM-yyyy HH:mm');
    console.log(
      t.format('DD-MM-YYYY HH-mm') + typeof t.format('DD-MM-YYYY HH-mm-ss')
    );
    console.log(t);
    this.dat = t.format('DD-MM-YYYY HH-mm-ss');
    console.log(this.dat + typeof this.dat);
    this.loginC = localStorage.getItem('login');
    console.log(this.loginC + 'MON LOGIN');
    this.getComptes();
    // this.httpClient.get(environment.apiUrl +'detailUser/' + localStorage.getItem('login')).subscribe((detailUser)=>{
    //   console.log('detail User' + JSON.stringify(detailUser));
    //   this.Compteur = detailUser;
    //  // this.ComptMontantMax = this.Compteur.cptMontant;
    //   this.ComptTransacMax = this.Compteur.cptNbTransaction;
    //   console.log(this.ComptMontantMax +' '+ this.ComptTransacMax)
    // });
    this.httpClient
      .get(
        environment.urlFinal + 'efacture/consultation/compteur/' +
        localStorage.getItem('login') +
        '/' +
        this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      )
      .subscribe(
        (cmpt) => {
          console.log(cmpt + 'trans');
          this.ComptTransacMax = cmpt;
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    this.httpClient
      .get(
        environment.urlFinal + 'efacture/consultation/compteurMtn/' +
        localStorage.getItem('login') +
        '/' +
        this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      )
      .subscribe(
        (cmptMtn) => {
          console.log(cmptMtn + 'mtn');
          this.ComptMontantMax = cmptMtn;
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    this.type();
    this.typeConfirmation = Number(localStorage.getItem('authtypeConfirm'));
    this.confirm = localStorage.getItem('confirmationTransation');
    this.username = localStorage.getItem('username');
    compte: [0];
    this.httpClient.get('').subscribe(
      (data) => {
        this.facturiers = data as string[];
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );

    this.myForm = this.fb.group({
      identifiant: [
        '',
        [Validators.required, Taille],
        [Validators.minLength(9)],
        ,
        [Validators.maxLength(9)],
      ],
    });

    this.ConfirmForm = this.fb.group({
      motDePasse: [''],
      otpfield: [''],
    });

    this.editForm = this.fb.group({
      id: [''],
      identifiant: [''],
      dateLimiteFact: [''],
      nombreFact: [''],
      impayeFact: [''],
      numCpt: [''],
      typeFact: [''],
      montantPaye: [''],
      intituleFacturier: [''],
      montantFacture: [''],
      typePaye: [''],
      periode: [''],
      penalite: [''],
    });
    //// this.Envoyeur();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  get g(): { [key: string]: AbstractControl } {
    return this.myForm.controls;
  }
  type() {
    this.httpClient
      .get(
        environment.urlFinal + 'efacture/plafond/plafondType/' +
        localStorage.getItem('authtypePlanfond')
      )
      .subscribe((type) => {
        this.Alltype = type[0];
        this.nbrMaxMontant = this.Alltype.montantMax;
        this.nbrMaxTransaction = this.Alltype.nombreFacture;
        console.log(this.nbrMaxMontant + '' + this.nbrMaxTransaction);
      }, err => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      });
  }
  onSubmit(envoi: Envoi): Observable<any> {
    const url = environment.urlFinal + 'efacture/paie/paiement';
    return this.httpClient.post<Facture>(url, envoi);
    // .subscribe((_result) => {
    //   // console.log(_result);
    //   this.consultation = _result;
    //   console.log(this.consultation)
    //   // this.ngOnInit(); //reload the table
    // });
    // this.modalService.dismissAll(); //dismiss the modal
    // this.router.navigateByUrl('envoipaiement');
    // f.reset();
  }

  Envoyeur() {
    this.httpClient.get(environment.urlFinal + 'efacture/emails').subscribe((mails: any) => {
      console.log(mails[0].mail);
      // //'raouf.kone@banqueatlantique.net'
    }, err => {
      this.autoLogoutService.autoLogout(err.status, this.router);
    })
  }
  // }

  getReference() {
    return this.ref;
  }

  getComptes() {
    this.httpClient
      .get(
        environment.urlFinal + 'efacture/comptes/getCompteByStatut/' +
        localStorage.getItem('login')
      )
      .subscribe(
        (res: any) => {
          var z;

          this.stringCompte = JSON.stringify(res);
          this.objCompte = JSON.parse(this.stringCompte);
          for (z in this.objCompte) {
            this.f = this.objCompte[z].compte;

            //console.log(this.objCompte[i].compte);
            console.log(this.f);
          }
          // for (z in res) {
          //   console.log(res[z].compte+'ccccccccccccccc')

          //   //console.log(this.objCompte[i].compte);

          // }

          //// console.log(JSON.stringify(res.compte) + 'COMPTES');
          //this.all = res;
          //var i;

          // this.stringCompte = JSON.stringify(this.all.comptes);

          // this.objCompte = JSON.parse(this.stringCompte);
          // for (i in this.objCompte) {
          //   this.f = this.objCompte[i].compte;

          //   //console.log(this.objCompte[i].compte);
          //   console.log(console.log(this.f));
          // }
          // console.log(this.objCompte);
          //console.log(this.stringCompte)
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    return this.objCompte;
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }


  openConfirm(modalConfirm) {
    if (this.ComptTransacMax < this.nbrMaxTransaction && this.ComptMontantMax <= this.nbrMaxMontant) {

      this.typeConfirmation = Number(localStorage.getItem('authtypeConfirm'));
      console.log(this.typeConfirmation + 'type');
      this.modalService
        .open(modalConfirm, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );

      if (this.typeConfirmation === 1) {
        this.httpClient
          .get<any>(environment.urlFinal + 'efacture/user/mdp/generer')
          .subscribe((otpmdp) => {
            console.log(otpmdp.code);
            localStorage.setItem('OtpCode', otpmdp.code);
            this.otp = localStorage.getItem('OtpCode');
            console.log(this.otp);

            if (otpmdp) {
              var mdp = localStorage.getItem('OtpCode');
              this.MailEnvoi = this.fb.group({
                expediteur: localStorage.getItem('expediteur'),
                destinataire: localStorage.getItem('email'),
                objet: 'CODE DE CONFIRMATION TRANSACTION EFACTURE',
                message:
                  'Bonjour' +
                  ' ' +
                  localStorage.getItem('prenom') +
                  '\n' +
                  'Votre code de confirmation de transaction est:' +
                  ' ' +
                  mdp +
                  '\n' +
                  "Ignorez cet e-mail si vous n'aviez pas initié de transaction, ",
              });
              //console.log(this.MailEnvoi.value)
              this.factureService.EnvoiMail(this.MailEnvoi.value).subscribe(
                (data) => {
                  this.factureService.GetAll().subscribe((response) => {
                    this.factureService.list = response;
                  }, err => {
                    this.autoLogoutService.autoLogout(err.status, this.router);
                  });
                },
                (error) => {
                  console.log(
                    error + "Impossible de joindre le lien d'envoi de mail"
                  );
                  this.ErrorForm = this.fb.group({
                    httpStatusCode: '400',
                    methode: 'CheckId',
                    login: localStorage.getItem('login'),
                    message: JSON.stringify(error.message),
                    description: JSON.stringify(error.name),
                  });
                  this.factureService
                    .Envoierror(this.ErrorForm.value)
                    .subscribe((res) => {
                      console.log(this.ErrorForm.value);
                      console.log(res);
                    });
                  this.autoLogoutService.autoLogout(error.status, this.router);
                }
              );
            }
          }, err => {
            this.autoLogoutService.autoLogout(err.status, this.router);
          });

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger',
          },
          buttonsStyling: false,
        });

        swalWithBootstrapButtons
          .fire({
            title: 'Code de Confirmation',
            // text: 'Vous allez reçevoir un code confirmation sur votre boîte mail, Veuillez mentionner celui-ci sur l\'écran suivant',
            icon: 'warning',
            html: "<center>Vous allez reçevoir un code confirmation sur votre boîte mail<br>Veuillez mentionner celui-ci sur l'écran suivant</center>",
            confirmButtonText: 'OK',
            cancelButtonText: "Annuler l'opération",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
            }
          });
      }
    }
    else {
      Swal.fire({
        title: 'Attention',
        text: 'Veuillez réessayer plutard!',
        html: '<center>Vous avez atteint votre quota journalier de transaction<br>NB: Nombre Maximum de transaction = ' + this.nbrMaxTransaction + '<br>' + 'Montant Maximum de paiement= ' + this.nbrMaxMontant + 'Fcfa' + '</center>',
        icon: 'warning',
        footer:
          '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalService.dismissAll();
          this.router.navigate(['home']);
          this.ngOnInit();
        }
      });

    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  openEdit1(targetModal, _facture: ListeCIE) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    this.editForm.patchValue({
      identifiant: _facture.NUM_FAC,
      periode: _facture.PER_FAC,
      dateLimiteFact: _facture.DATE_LIMIT,
      montantFacture: _facture.MONTANT_TOTAL,
      penalite: _facture.MONTANT_PENALITE,
      // intituleFacturier: _facture.typeFact,
      // typePaye: _facture.typePaye,
    });
  }



  openEdit(targetModal, _facture: EmissionSodeci) {
    localStorage.setItem('idabon', _facture.idabon);
    localStorage.setItem('perfact', _facture.perfact);
    var per = _facture.perfact.slice(0, 2) + '/' + _facture.perfact.slice(2);
    //alert(per);
    var e = _facture.montfraisp;
    var z = +e;
    var x = _facture.montttc;
    var y = +x;
    console.log(z + typeof z);
    //console.log(typeof _facture.montant + typeof _facture.penalite)
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    this.editForm.patchValue({
      identifiant: _facture.numfact,
      periode: per,
      dateLimiteFact: this.datePipe.transform(_facture.datlimit, 'dd/MM/yyyy'),
      penalite: z,
      montantFacture: y + z,
      // intituleFacturier: _facture.typeFact,
      // typePaye: _facture.typePaye,
    });
  }
  // openConfirm() {
  //   this.modalService.open(modalConfirm, {
  //     backdrop: 'static',
  //     size: 'lg',
  //     centered: true,
  //   });
  // }

  // openDetails(targetModal, envoi: Envoi) {
  //   this.modalService.open(targetModal, {
  //     centered: true,
  //     backdrop: 'static',
  //     size: 'lg',
  //   });
  //   document.getElementById('periode').innerHTML = envoi.periode;
  // }

  // openConfirm(targetModal, _envois: Envoi) {
  //   this.deleteId = _envois.identifiant;
  //   this.modalService.open(targetModal, {
  //     backdrop: 'static',
  //     size: 'lg',
  //   });
  // }
  isShown: boolean = false;
  loader: boolean = false; // hidden by default
  toggleShow() {
    this.isShown = !this.isShown;
  }
  openModal() {
    this.modalService.open(this.modalTest, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
    });
  }
  openModal1() {
    this.modalService.open(this.load, {
      backdrop: 'static',
      size: '',
      centered: true,
    });
  }

  CheckId() {
    console.log(this.identifiant + typeof this.identifiant);
    this.id = this.identifiant;
    this.newId = this.id * 1;
    console.log(this.newId + typeof this.newId);
    var RefContrat = this.identifiant;
    localStorage.setItem('refContrat', this.id);
    this.modalService.dismissAll();
    this.cie_sodeci = true;
    // this.identifiantFacture.identifiant = this.identifiant;
    // this.factureService.SearchId(this.identifiantFacture).subscribe((response: Facture) => {
    // console.log()
    // this.listeFactures = response;

    this.httpClient
      .get(environment.urlFinal + 'Api/facture/sodeci/' + this.identifiant)
      //.get('http://localhost:3000/FACTURE?AdresseTechnique=')

      .subscribe(
        (testFacture: any) => {
          console.log(testFacture);

          console.log(JSON.stringify(testFacture) + "88")
          this.contrat = testFacture.ReferenceContrat
          console.log(this.contrat + 'CONTRAT');
          var njson = JSON.stringify(testFacture.ListeDesFactures);
          this.stringObject = JSON.parse(njson);
          console.log(this.stringObject + 'FINAL');
          this.SODECIFACTURE = this.stringObject;
          this.ListeFactureSodeci = testFacture.CodeTraitement;
          var rf: any = testFacture.ReferenceContrat;
          console.log(this.ListeFactureSodeci + ' LISTE');
          // this.FactureSodeci = testFacture;
          // this.ListeFactureSodeci = testFacture.CodeTraitement;
          // this.ReferenceContrat = testFacture.ReferenceContrat;
          // this.stringJson = JSON.stringify(testFacture.ListeDesFactures);

          // this.stringObject = JSON.parse(this.stringJson);
          // console.log(this.stringObject);

          // console.log(this.FactureSodeci);
          // console.log(this.stringJson);
          // this.CodeTraitement = testFacture.CodeTraitement;
          // this.MessageTraitement = this.testFacture.MessageTraitement;
          //this.ReferenceContrat = this.testFacture.ReferenceContrat;
          // this.AdresseTechnique = this.testFacture.AdresseTechnique;
          // this.NombreFacture = this.testFacture.NombreFacture;
          // this.MontantTotal = this.testFacture.MontantTotal;
          this.cie_sodeci = false;
          //if (testFacture != 0) {
            switch (this.ListeFactureSodeci) {
              case 0:
                console.log('SUCCES');
                // this.hideloader();
                this.show = true;
                this.show1 = true;
                this.modalService.dismissAll();
                break;
              case 10:
                this.show = false;
                this.show1 = false;
                this.modalService.dismissAll();
                Swal.fire({
                  title: 'Désole!',
                  html: '<center>Référence du contrat non fournie</center>',
                  iconHtml:
                    '<img style="width:313px; margin-top: 34px;" src="assets/duo.png">',
                  customClass: {
                    icon: 'no-border',
                  },
                  // footer:
                  //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['Choix_facturier']);
                  }
                });
                break;
              case 11:
                this.show = false;
                this.show1 = false;
                this.modalService.dismissAll();
                Swal.fire({
                  title: 'Désole!',
                  html: '<center>Client inexistant</center>',
                  iconHtml:
                    '<img style="width:313px; margin-top: 34px;" src="assets/duo.png">',
                  customClass: {
                    icon: 'no-border',
                  },
                  // footer:
                  //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['Choix_facturier']);
                  }
                });
                break;
              case 12:
                this.show = false;
                this.show1 = false;
                this.modalService.dismissAll();
                Swal.fire({
                  title: 'Désole!',
                  html: '<center>Client sans facture</center>',
                  iconHtml:
                    '<img style="width:313px; margin-top: 34px;" src="assets/duo.png">',
                  customClass: {
                    icon: 'no-border',
                  },
                  // footer:
                  //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['Choix_facturier']);
                  }
                });
                break;
              case 15:
                this.show = false;
                this.show1 = false;
                this.modalService.dismissAll();
                Swal.fire({
                  title: 'Désole!',
                  html: '<center>Echec dans le traitement</center>',
                  iconHtml:
                    '<img style="width:313px; margin-top: 34px;" src="assets/duo.png">',
                  customClass: {
                    icon: 'no-border',
                  },
                  // footer:
                  //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['Choix_facturier']);
                  }
                });
                break;
            }
            // if (this.ListeFactureSodeci === 0) {
            //   console.log('SUCCES');
            //   // this.hideloader();
            //   this.show = true;
            //   this.show1 = true;
            //   this.modalService.dismissAll();
            // } else {
            //   this.show = false;
            //   this.show1 = false;
            //   this.modalService.dismissAll();
            //   Swal.fire({
            //     title: 'Désole!',
            //     html: '<center>' + testFacture.MessageTraitement + '</center>',
            //     iconHtml:
            //       '<img style="width:313px; margin-top: 34px;" src="assets/duo.png">',
            //     customClass: {
            //       icon: 'no-border',
            //     },
            //     // footer:
            //     //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
            //   }).then((result) => {
            //     if (result.isConfirmed) {
            //       this.router.navigate(['Choix_facturier']);
            //     }
            //   });
            // }
        },
        (error) => {
          console.log(error + 'Impossible de joindre le lien');
          this.errorMessage = error;
          this.show = false;
          this.show1 = false;
          this.cie_sodeci = false;
          this.ErrorForm = this.fb.group({
            httpStatusCode: '400',
            methode: 'CheckId',
            login: localStorage.getItem('login'),
            message: JSON.stringify(error.message),
            description: JSON.stringify(error.name),
          });
          this.factureService
            .Envoierror(this.ErrorForm.value)
            .subscribe((res) => {
              console.log(this.ErrorForm.value);
              console.log(res);
            });
          Swal.fire({
            title: 'Erreur!',
            text: 'Impossible de joindre le lien',
            icon: 'warning',
            // footer:
            //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['home']);
            }
          });
          this.autoLogoutService.autoLogout(error.status, this.router);
        }
      );
  }

  // CheckId1() {
  //   var RefContrat = this.identifiant;
  //   localStorage.setItem('refContrat', RefContrat);
  //   this.modalService.dismissAll();
  //   this.cie_sodeci = true;
  //   // this.identifiantFacture.identifiant = this.identifiant;
  //   // this.factureService.SearchId(this.identifiantFacture).subscribe((response: Facture) => {
  //   // console.log()
  //   // this.listeFactures = response;
  //   console.log('MON ID :  '+ this.identifiant)
  //   this.httpClient
  //     .get(environment.urlFinal+'Api/facture/sodeci/' + this.identifiant)
  //     // .get(
  //     //   'http://10.100.10.12:3000/FACTURE?AdresseTechnique=' + this.identifiant
  //     // )
  //     .pipe(timeout(50000))
  //     .subscribe(
  //       (testFacture: ModeleFacture) => {
  //         //console.log(JSON.stringify(testFacture) +"88")
  //         var njson = JSON.stringify(testFacture.ListeDesFactures);
  //         this.stringObject = JSON.parse(njson);
  //         console.log(this.stringObject);
  //         this.ListeFactureSodeci = testFacture.CodeTraitement;
  //         //var rf: any = testFacture.ReferenceContrat;
  //         console.log(this.ListeFactureSodeci);
  //         // this.FactureSodeci = testFacture;
  //         // this.ListeFactureSodeci = testFacture.CodeTraitement;
  //         // this.ReferenceContrat = testFacture.ReferenceContrat;
  //         // this.stringJson = JSON.stringify(testFacture.ListeDesFactures);

  //         // this.stringObject = JSON.parse(this.stringJson);
  //         // console.log(this.stringObject);

  //         // console.log(this.FactureSodeci);
  //         // console.log(this.stringJson);
  //         // this.CodeTraitement = testFacture.CodeTraitement;
  //         // this.MessageTraitement = this.testFacture.MessageTraitement;
  //         //this.ReferenceContrat = this.testFacture.ReferenceContrat;
  //         // this.AdresseTechnique = this.testFacture.AdresseTechnique;
  //         // this.NombreFacture = this.testFacture.NombreFacture;
  //         // this.MontantTotal = this.testFacture.MontantTotal;
  //         this.cie_sodeci = false;

  //         if (this.ListeFactureSodeci === 0) {
  //           console.log('SUCCES');
  //           // this.hideloader();
  //           this.show = true;
  //           this.show1 = true;
  //           this.modalService.dismissAll();
  //         }
  //         if (this.ListeFactureSodeci === 10) {
  //           this.show = false;
  //           this.show1 = false;
  //           this.modalService.dismissAll();
  //           Swal.fire({
  //             title: 'Erreur!',
  //             text: 'Reference du contrat non fournie...',
  //             icon: 'error',
  //             footer:
  //               '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this.router.navigate(['home']);
  //             }
  //           });
  //         }
  //         if (this.ListeFactureSodeci === 11) {
  //           this.show = false;
  //           this.show1 = false;
  //           this.modalService.dismissAll();
  //           Swal.fire({
  //             title: 'Erreur!',
  //             html: '<div class="centrer">Client inexistant</div>',
  //             position: 'center',
  //             icon: 'error',
  //             footer:
  //               '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this.router.navigate(['home']);
  //             }
  //           });
  //         }
  //         if (this.ListeFactureSodeci === 12) {
  //           this.show = false;
  //           this.show1 = false;
  //           this.modalService.dismissAll();
  //           Swal.fire({
  //             title: 'Ooupss!',
  //             html: '<div class="centrer">Client inexistant</div>',
  //             icon: 'error',
  //             footer:
  //               '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this.router.navigate(['home']);
  //             }
  //           });
  //         }
  //         if (this.ListeFactureSodeci === 15) {
  //           this.show = false;
  //           this.show1 = false;
  //           this.modalService.dismissAll();
  //           Swal.fire({
  //             title: 'Erreur!',
  //             text: 'Echec dans le traitement...',
  //             icon: 'error',
  //             footer:
  //               '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this.router.navigate(['home']);
  //             }
  //           });
  //         }
  //         // else {
  //         //   this.show = false;
  //         //   this.show1 = false;
  //         //   this.modalService.dismissAll();
  //         //   Swal.fire({
  //         //     title: 'Ooupss!',
  //         //     text: 'Désole ! Aucune Facture impayée...',
  //         //     icon: 'error',
  //         //     footer:
  //         //       '<a href="/envoipaiementCie">Rechercher une autre facture?</a>',
  //         //   }).then((result) => {
  //         //     if (result.isConfirmed) {
  //         //       this.router.navigate(['home']);
  //         //     }
  //         //   });
  //         // }
  //       },
  //       (error) => {
  //         console.log(error + 'Impossible de joindre le lien');
  //         this.errorMessage = error;
  //         this.show = false;
  //         this.show1 = false;
  //         this.cie_sodeci = false;
  //         this.ErrorForm = this.fb.group({
  //           httpStatusCode: '400',
  //           methode: 'CheckId',
  //           login: localStorage.getItem('login'),
  //           message: JSON.stringify(error.message),
  //           description: JSON.stringify(error.name),
  //         });
  //         this.factureService
  //           .Envoierror(this.ErrorForm.value)
  //           .subscribe((res) => {
  //             console.log(this.ErrorForm.value);
  //             console.log(res);
  //           });
  //         Swal.fire({
  //           title: 'Erreur!',
  //           text: 'Impossible de joindre le lien',
  //           icon: 'warning',
  //           footer:
  //             '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.router.navigate(['home']);
  //           }
  //         });
  //         this.autoLogoutService.autoLogout(error.status,this.router);
  //       }
  //     );
  // }

  CheckId2() {
    console.log(this.identifiant);
    var RefContrat = this.identifiant;
    localStorage.setItem('refContrat', RefContrat);
    this.modalService.dismissAll();
    this.cie_sodeci = true;
    // this.identifiantFacture.identifiant = this.identifiant;
    // this.factureService.SearchId(this.identifiantFacture).subscribe((response: Facture) => {
    // console.log()
    // this.listeFactures = response;

    var njson = JSON.stringify(this.testFacture.ListeDesFactures);
    this.stringObject = JSON.parse(njson);
    console.log(this.stringObject);
    this.ListeFactureSodeci = this.testFacture.CodeTraitement;
    //var rf: any = testFacture.ReferenceContrat;
    console.log(this.ListeFactureSodeci);

    this.cie_sodeci = false;

    if (this.ListeFactureSodeci === 0) {
      console.log('SUCCES');
      // this.hideloader();
      this.show = true;
      this.show1 = true;
      this.modalService.dismissAll();
    }
    if (this.ListeFactureSodeci === 10) {
      this.show = false;
      this.show1 = false;
      this.modalService.dismissAll();
      Swal.fire({
        title: 'Erreur!',
        text: 'Reference du contrat non fournie...',
        icon: 'error',
        footer: '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['home']);
        }
      });
    }
    if (this.ListeFactureSodeci === 11) {
      this.show = false;
      this.show1 = false;
      this.modalService.dismissAll();
      Swal.fire({
        title: 'Erreur!',
        html: '<div class="centrer">Client inexistant</div>',
        position: 'center',
        icon: 'error',
        footer: '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['home']);
        }
      });
    }
    if (this.ListeFactureSodeci === 12) {
      this.show = false;
      this.show1 = false;
      this.modalService.dismissAll();
      Swal.fire({
        title: 'Ooupss!',
        html: '<div class="centrer">Client inexistant</div>',
        icon: 'error',
        footer: '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['home']);
        }
      });
    }
    if (this.ListeFactureSodeci === 15) {
      this.show = false;
      this.show1 = false;
      this.modalService.dismissAll();
      Swal.fire({
        title: 'Erreur!',
        text: 'Echec dans le traitement...',
        icon: 'error',
        footer: '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['home']);
        }
      });
    }
    // else {
    //   this.show = false;
    //   this.show1 = false;
    //   this.modalService.dismissAll();
    //   Swal.fire({
    //     title: 'Ooupss!',
    //     text: 'Désole ! Aucune Facture impayée...',
    //     icon: 'error',
    //     footer:
    //       '<a href="/envoipaiementCie">Rechercher une autre facture?</a>',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.router.navigate(['home']);
    //     }
    //   });
    // }
  }

  // OperationPaie() {
  //   //alert(this.confirm + '555' + this.ConfirmForm.value.motDePasse)
  //   this.mdp = this.ConfirmForm.value.motDePasse;
  //   if (
  //     this.ConfirmForm.value.motDePasse == this.confirm ||
  //     this.ConfirmForm.value.otpfield == this.otp
  //   ) {
  //     this.show1 = false;
  //     this.loader = true;
  //     this.modalService.dismissAll();
  //     var numero = this.editForm.value.numCpt;
  //     var typeReglement = this.editForm.value.typePaye;
  //     var expirationDate = this.editForm.value.dateLimiteFact;
  //     var montantFacture = this.editForm.value.montantFacture;
  //     var montantPaye = this.editForm.value.montantPaye;
  //     this.httpClient.get<any>(environment.urlFinal +'efacture/commission/'+ 3).subscribe(
  //       (AllCommission) => {

  //         this.commissions = AllCommission;

  //         if (AllCommission) {
  //           var rc = localStorage.getItem('rcCLient')
  //           this.paiementFacture.client = rc;
  //           //(this.paiementFacture.compteDebit = "145116420013");
  //           (this.paiementFacture.compteDebit = this.editForm.value.numCpt),
  //             (this.paiementFacture.facturier = this.FacturierSodeci);
  //           this.paiementFacture.identifiantFacture =
  //             this.editForm.value.identifiant;
  //           if (typeReglement === 'Total') {
  //             console.log(this.commissions.montantCommission + typeof this.commissions.montantCommission + typeof (this.editForm.value.montantFacture*1) )
  //             console.log( this.commissions.commissionFacturier  + typeof  this.commissions.commissionFacturier )

  //             this.paiementFacture.mntOper = this.editForm.value.montantFacture*1 +  this.commissions.montantCommission + this.commissions.commissionFacturier + 0;
  //             this.paiementFacture.mntFacture =
  //               this.editForm.value.montantFacture;
  //           } else {
  //             console.log(typeof this.editForm.value.montantPaye + typeof this.commissions.montantCommission + typeof this.commissions.commissionFacturier)
  //             this.paiementFacture.mntOper = this.editForm.value.montantPaye*1 +  this.commissions.montantCommission + this.commissions.commissionFacturier + 0;
  //             this.paiementFacture.mntFacture = this.editForm.value.montantPaye;
  //           }
  //           this.paiementFacture.mntFrais = this.commissions.montantCommission;
  //           (this.paiementFacture.mntFraisMarchand =
  //             this.commissions.commissionFacturier),
  //             (this.paiementFacture.mntTimbre = 0),

  //             console.log(JSON.stringify(this.paiementFacture) + 'SODECI')
  //           this.transactionService.Transaction(this.paiementFacture).subscribe(
  //             (T24: any) => {
  //               console.log('reponse T24:' + JSON.stringify(T24));
  //               this.reponseT24 = T24;
  //               this.ReferenceT24 = this.reponseT24.Nooper;
  //               this.noOper = T24.Nooper;
  //               this .refExterne = T24.refExterne;

  //              // localStorage.setItem('statutRetour', this.reponseT24.statut);
  //              // localStorage.setItem('NoOper', this.ReferenceT24);

  //               if(this.reponseT24.statut === 1){
  //                 swalWithBootstrapButtons.fire(
  //                   'Echec',
  //                   'Votre paiement a échoué !',
  //                   'error'
  //                 );
  //                 this.ngOnInit();
  //                 this.router.navigate(['home']);
  //                 console.log('ERREUR');
  //               }


  //               if (this.reponseT24.statut === 0) {


  //         /////////////////////INSERTION TABLE CONSULTATION/////////////////////////  

  //                 this.historique.identifiant =
  //                   localStorage.getItem('refContrat');
  //                 console.log(this.historique.identifiant + 'consul');
  //                 this.historique.dtExpFacture = expirationDate;
  //                 this.historique.login = this.loginC;
  //                 this.historique.facturier = this.FacturierSodeci;
  //                 this.historique.referenceFT =
  //                 this.noOper
  //                 console.log(this.historique.identifiant + 'consul');
  //                 // this.historique.reference =
  //                 // retourPaiementCie.ReferenceDeTransaction;

  //                 this.historique.numCpt = numero;
  //                 this.historique.typeRegle = typeReglement;
  //                 if (typeReglement === 'Total') {
  //                   this.historique.montantDebite = montantFacture;
  //                 } else {
  //                   this.historique.montantDebite = montantPaye;
  //                 }

  //                 this.factureService.AddHistorique(this.historique).subscribe(
  //                   (histfacture: Consultation) => {
  //                     console.log(JSON.stringify(histfacture) + 'Consultation');
  //                     if (histfacture) {
  //                       console.log('Table Historique OK')
  //                       let body = { statut: 'En attente' };
  //                       this.httpClient
  //                         .put<any>(
  //                           environment.urlFinal +'efacture/consultation/statut/' +
  //                             this.noOper,
  //                           body
  //                         )
  //                         .subscribe((newConsul) => {
  //                           if (newConsul) {
  //                           }
  //                           console.log(newConsul);
  //                         });
  //                     } else {
  //                       console.log('error Consul');
  //                     }
  //                   },
  //                   (error) => {
  //                     console.log('Table Consultation' + JSON.stringify(error));
  //                     this.loader = false;
  //                     this.ErrorForm = this.fb.group({
  //                       httpStatusCode: '401',
  //                       methode: 'Add To Table Consultation',
  //                       login: localStorage.getItem('login'),
  //                       message: JSON.stringify(error.name),
  //                       description:
  //                         JSON.stringify(error.message) +
  //                         '\n' +
  //                         JSON.stringify(error.error),
  //                     });
  //                     this.factureService
  //                       .Envoierror(this.ErrorForm.value)
  //                       .subscribe((res) => {
  //                         console.log(this.ErrorForm.value);
  //                         console.log(res);
  //                       });

  //                     Swal.fire({
  //                       title: 'Echec!',
  //                       text: 'Veuillez réessayer plutard!',
  //                       html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                       icon: 'error',
  //                       footer:
  //                         '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                     }).then((result) => {
  //                       if (result.isConfirmed) {
  //                         this.ngOnInit();
  //                         this.router.navigate(['home']);
  //                       }
  //                     });
  //                     this.autoLogoutService.autoLogout(
  //                       error.status,
  //                       this.router
  //                     );
  //                   }
  //                 );


  //     //************////****************FIN INSERTION TABLE CONSULTATION***********////////////**////***********  




  //            /////////////////////INSERTION TABLE TRANSACTION ///////////////////////////////////////  
  //                 this.t24transaction.facturier = this.FacturierSodeci;
  //                 this.t24transaction.datOper = this.datePaiement;
  //                 this.t24transaction.codOper = this.commissions.codOper;
  //                 this.t24transaction.identifiantFacture =
  //                   this.editForm.value.identifiant;
  //                 this.t24transaction.compteCredit = '';
  //                 this.t24transaction.compteDebit = this.editForm.value.numCpt;
  //                 if (this.editForm.value.typePaye === 'Total') {
  //                   this.t24transaction.mntOper =
  //                     this.editForm.value.montantFacture;
  //                 } else {
  //                   this.t24transaction.mntOper =
  //                     this.editForm.value.montantPaye;
  //                 }
  //                 this.t24transaction.mntFacture =
  //                   this.editForm.value.montantFacture;
  //                 this.t24transaction.mntFrais = this.commissions.mntFrais;
  //                 this.t24transaction.mntFraisMarchand =
  //                   this.commissions.mntFraisMarchand;
  //                 this.t24transaction.mntMarchand =
  //                   this.commissions.mntMarchand;
  //                 this.t24transaction.mntTimbre = this.commissions.mntTimbre;
  //                 this.t24transaction.libelleOper =
  //                   'PAIEMENT FACTURE' +
  //                   '_' +
  //                   this.paiementFacture.facturier +
  //                   '_' +
  //                   this.paiementFacture.identifiantFacture +
  //                   '_' +
  //                   this.paiementFacture.mntOper;
  //                 this.t24transaction.compteCom = '1';
  //                 this.t24transaction.codeTraitement = 0;
  //                 this.t24transaction.statutTraitement = 'En attente';

  //                 this.factureService
  //                   .AddTransaction(this.t24transaction)
  //                   .subscribe(
  //                     (t24Response) => {
  //                       console.log(t24Response);

  //                       localStorage.setItem('idTransac', t24Response.id);
  //                     },
  //                     (error) => {
  //                       console.log(
  //                         'Table Transaction' + JSON.stringify(error)
  //                       );
  //                       this.loader = false;
  //                       this.ErrorForm = this.fb.group({
  //                         httpStatusCode: '401',
  //                         methode: 'Add To Transaction Table',
  //                         login: localStorage.getItem('login'),
  //                         message: JSON.stringify(error.name),
  //                         description:
  //                           JSON.stringify(error.message) +
  //                           '\n' +
  //                           JSON.stringify(error.error),
  //                       });
  //                       this.factureService
  //                         .Envoierror(this.ErrorForm.value)
  //                         .subscribe((res) => {
  //                           console.log(this.ErrorForm.value);
  //                           console.log(res);
  //                         });

  //                       Swal.fire({
  //                         title: 'Echec!',
  //                         text: 'Veuillez réessayer plutard!',
  //                         html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                         icon: 'error',
  //                         footer:
  //                           '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                       }).then((result) => {
  //                         if (result.isConfirmed) {
  //                           this.ngOnInit();
  //                           this.router.navigate(['home']);
  //                         }
  //                       });
  //                       this.autoLogoutService.autoLogout(
  //                         error.status,
  //                         this.router
  //                       );
  //                     }
  //                   );
  //     //************////****************FIN INSERTION TABLE TRANSACTION***********////////////**////***********  



  //      ////////////////////////////////////// INSERTION TABLE PAIEMENT//////////////////////////////////////////
  //                 this.envoiis.identifiant = this.editForm.value.identifiant;
  //                 this.envoiis.montantFacture =
  //                   this.editForm.value.montantFacture;
  //                 this.envoiis.intituleFacturier = this.FacturierSodeci;
  //                 if (this.editForm.value.typePaye === 'Total') {
  //                   this.envoiis.montantPaye =
  //                     this.editForm.value.montantFacture;
  //                 } else {
  //                   this.envoiis.montantPaye = this.editForm.value.montantPaye;
  //                 }

  //                 this.envoiis.numCpt = this.editForm.value.numCpt;
  //                 this.envoiis.typePaye = this.editForm.value.typePaye;
  //                 this.onSubmit(this.envoiis).subscribe(
  //                   (paiement: Facture) => {
  //                     console.log('PAIEMENT' + JSON.stringify(paiement));
  //                   },
  //                   (error) => {

  //                       this.autoLogoutService.autoLogout(error.status,this.router);

  //                     console.log('Table Paiement' + JSON.stringify(error));
  //                     this.loader = false;
  //                     this.ErrorForm = this.fb.group({
  //                       httpStatusCode: '401',
  //                       methode: 'Add To Table Paiement',
  //                       login: localStorage.getItem('login'),
  //                       message: JSON.stringify(error.name),
  //                       description:
  //                         JSON.stringify(error.message) +
  //                         '\n' +
  //                         JSON.stringify(error.error),
  //                     });
  //                     this.factureService
  //                       .Envoierror(this.ErrorForm.value)
  //                       .subscribe((res) => {
  //                         console.log(this.ErrorForm.value);
  //                         console.log(res);
  //                       });

  //                     Swal.fire({
  //                       title: 'Echec!',
  //                       text: 'Veuillez réessayer plutard!',
  //                       html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                       icon: 'error',
  //                       footer:
  //                         '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                     }).then((result) => {
  //                       if (result.isConfirmed) {
  //                         this.ngOnInit();
  //                         this.router.navigate(['home']);
  //                       }
  //                     });
  //                   }
  //                 );
  //     //************////****************FIN INSERTION TABLE PAIEMENT***********////////////**////***********  



  //            ////////////////////////////////////// INSERTION TABLE REGLEMENT//////////////////////////////////////////

  //                 this.factureService
  //                   .FactureByIdAndPer(
  //                     localStorage.getItem('idabon'),
  //                     localStorage.getItem('perfact')
  //                   )
  //                   .subscribe((data:ReglementSodeci) => {
  //                     console.log(data);

  //                     if (data) {
  //                       this.ReglementFactureSodeci.codexp = data.codexp;
  //                       this.ReglementFactureSodeci.codmvt = "RG";
  //                       // this.ReglementFactureSodeci.dateEnr = new Date() ;
  //                       // this.ReglementFactureSodeci.dateRegle = new Date();
  //                       //this.ReglementFactureSodeci.idRgSodeci = 1;
  //                       this.ReglementFactureSodeci.idabon = data.idabon;
  //                       this.ReglementFactureSodeci.idabon2 = data.idabon;
  //                       this.ReglementFactureSodeci.montantRegle =  this.editForm.value.montantFacture;
  //                       this.ReglementFactureSodeci.numeroRecu = this.noOper;
  //                       this.ReglementFactureSodeci.numfact = data.numfact;
  //                       this.ReglementFactureSodeci.perfact = data.perfact;
  //                       this.ReglementFactureSodeci.refbranch = data.refbranch;
  //                       this.ReglementFactureSodeci.sens = data.sens;
  //                       this.ReglementFactureSodeci.statut = data.statut;
  //                       this.ReglementFactureSodeci.typeCanal = data.typeCanal;
  //                       this.ReglementFactureSodeci.typfact = data.typfact;
  //                       this.ReglementFactureSodeci.typmvt = data.typmvt;
  //                       this.transactionService
  //                         .ReglementCie(this.ReglementFactureSodeci)
  //                         .subscribe((rg: ReglementCie) => {
  //                           console.log(rg);

  //                           let idabon = localStorage.getItem('idabon');
  //                           let perfact = localStorage.getItem('perfact');
  //                           console.log(idabon + '' + perfact);
  //                           this.factureService.CieFactureByIdAndPer(idabon, perfact).subscribe((data) => {
  //                             console.log(data);

  //                             if (data) {
  //                               let body = { idabon: data.idabon, perfact: data.perfact, statut: 'V' };
  //                               this.httpClient
  //                                 .put<any>(environment.urlFinal +'efacture/em/CieUpdateStatut', body)
  //                                 .subscribe((newFacture) => {
  //                                   console.log(newFacture);

  //                                   if(newFacture !=0){
  //                                     swalWithBootstrapButtons.fire(
  //                                       'Succès',
  //                                       'Votre paiement a bien été effectué!',
  //                                       'success'
  //                                     );
  //                                     console.log('OK OK');
  //                                     this.ngOnInit();
  //                                     this.router.navigate(['home']);
  //                                   }
  //                                 },err => {
  //                                   this.autoLogoutService.autoLogout(err.status,this.router);
  //                                 });
  //                             }
  //                           },err => {
  //                             this.autoLogoutService.autoLogout(err.status,this.router);
  //                           });


  //                         },err => {
  //                           this.autoLogoutService.autoLogout(err.status,this.router);
  //                         });
  //                     }
  //                   },err => {
  //                     this.autoLogoutService.autoLogout(err.status,this.router);
  //                   });
  //     //************////****************FIN INSERTION TABLE REGLEMENT***********////////////**////***********  

  //                 if (
  //                     localStorage.getItem('statutRetour') === '0'
  //                   ) {
  //                     swalWithBootstrapButtons.fire(
  //                       'Succès',
  //                       'Votre paiement a bien été effectué s!',
  //                       'success'
  //                     );
  //                     console.log('OK OK');
  //                     this.ngOnInit();
  //                     this.router.navigate(['home']);
  //                   }
  //                 ////////////////////////////////////////////////// 2EME ETAPE ***PAYEMENT SODECI*** ////////////////////////////////////

  //                 // this.sodeciTransaction.CodeOperateur =
  //                 //   this.  .codeOperateur;
  //                 // console.log(this.sodeciTransaction.CodeOperateur);

  //                 // //DATE PAIEMENT//
  //                 // var madate = new Date();
  //                 // var Dates = madate.toLocaleString('fr-FR', {
  //                 //   month: 'numeric',
  //                 //   day: 'numeric',
  //                 //   year: 'numeric',
  //                 // });
  //                 // var Datess = Dates.toString();
  //                 // var Date_finale = Datess.replace(/\//g, '');

  //                 // this.sodeciTransaction.DateReglement = Date_finale;
  //                 // console.log(this.sodeciTransaction.DateReglement);
  //                 // if (typeReglement === 'Total') {
  //                 //   this.sodeciTransaction.MontantReglement =
  //                 //     this.editForm.value.montantFacture;
  //                 // } else {
  //                 //   this.sodeciTransaction.MontantReglement =
  //                 //     this.editForm.value.montantPaye;
  //                 // }

  //                 // //HEURE PAIEMENT//

  //                 // var heure = new Date();
  //                 // var sodeci = heure.toLocaleString('fr-FR', {
  //                 //   hour: 'numeric',
  //                 //   minute: 'numeric',
  //                 //   second: 'numeric',
  //                 //   hour12: false,
  //                 // });
  //                 // var heureEnvoi = sodeci.toString();
  //                 // var Heure_finale = heureEnvoi.replace(/:/g, '');

  //                 // this.sodeciTransaction.HeureReglement = Heure_finale;
  //                 // console.log(this.sodeciTransaction.HeureReglement);
  //                 // this.sodeciTransaction.NumeroRecu = this.ReferenceT24;
  //                 // console.log(this.sodeciTransaction.NumeroRecu + 'NUMERO RECU');
  //                 // this.sodeciTransaction.RefContrat =
  //                 //   localStorage.getItem('refContrat');
  //                 // console.log(this.sodeciTransaction.RefContrat + 'REF CONTRAT ');
  //                 // this.sodeciTransaction.RefFacture =
  //                 //   this.editForm.value.identifiant;
  //                 // console.log(this.sodeciTransaction.RefFacture + 'refff');
  //                 // this.sodeciTransaction.TypeCanal = this.commissions.typeCanal;
  //                 // console.log(this.sodeciTransaction.TypeCanal + 'TYPE CANAL');

  //                 // this.transactionService
  //                 //   .TransactionCie(this.sodeciTransaction)
  //                 //   .subscribe(
  //                 //     (retourPaiementCie) => {
  //                 //       if (retourPaiementCie) {
  //                 //         localStorage.setItem(
  //                 //           'codetraitement',
  //                 //           retourPaiementCie.CodeTraitement
  //                 //         );
  //                 //         console.log(
  //                 //           'RETOUR SODECI' +
  //                 //             JSON.stringify(retourPaiementCie) +
  //                 //             '' +
  //                 //             retourPaiementCie.CodeTraitement
  //                 //         );
  //                 //         //////////////////////*** INSERTION TABLE CONSULTATION ***///////////////////////////////////////
  //                 //         if (retourPaiementCie.CodeTraitement === 0) {
  //                 //           let bodyy = { reference: retourPaiementCie.ReferenceDeTransaction};
  //                 //           this.httpClient
  //                 //             .put<any>(
  //                 //               environment.apiUrl +
  //                 //                 'reference/' +
  //                 //                 localStorage.getItem('NoOper'),
  //                 //               bodyy
  //                 //             )
  //                 //             .subscribe((newConsul) => {
  //                 //               if (newConsul) {
  //                 //               }
  //                 //               console.log(newConsul);
  //                 //             });

  //                 //           let body = { statut: 'Succès' };
  //                 //           this.httpClient
  //                 //             .put<any>(
  //                 //               environment.apiUrl +
  //                 //                 'statut/' +
  //                 //                 localStorage.getItem('NoOper'),
  //                 //               body
  //                 //             )
  //                 //             .subscribe((newConsul) => {
  //                 //               if (newConsul) {
  //                 //               }
  //                 //               console.log(newConsul);
  //                 //             });

  //                 //             let bodyTransact = { codeTraitement: '1', statutTraitement: "Succès" };
  //                 //             this.httpClient
  //                 //               .put<any>(
  //                 //                 environment.apiUrl +
  //                 //                   'transaction/' +
  //                 //                   localStorage.getItem('idTransac'),
  //                 //                   bodyTransact
  //                 //               )
  //                 //               .subscribe((newConsul) => {
  //                 //                 if (newConsul) {
  //                 //                 }
  //                 //                 console.log(newConsul);
  //                 //               });
  //                 //           // this.ListeretourPaiementCie = retourPaiementCie;
  //                 //           // this.referenceCie =
  //                 //           //   this.ListeretourPaiementCie.ReferenceDeTransaction;
  //                 //           // console.log(this.referenceCie + 'reference SODECI');

  //                 //           /////////////////////////////// INSERTION TABLE PAIEMENT/////////////////////////
  //                 //           this.envoiis.identifiant =
  //                 //             this.editForm.value.identifiant;
  //                 //           this.envoiis.montantFacture =
  //                 //             this.editForm.value.montantFacture;
  //                 //           this.envoiis.intituleFacturier = this.FacturierSodeci;
  //                 //           if (this.editForm.value.typePaye === 'Total') {
  //                 //             this.envoiis.montantPaye =
  //                 //               this.editForm.value.montantFacture;
  //                 //           } else {
  //                 //             this.envoiis.montantPaye =
  //                 //               this.editForm.value.montantPaye;
  //                 //           }

  //                 //           this.envoiis.numCpt = this.editForm.value.numCpt;
  //                 //           this.envoiis.typePaye =
  //                 //             this.editForm.value.typePaye;
  //                 //           this.onSubmit(this.envoiis).subscribe(
  //                 //             (paiement: Facture) => {
  //                 //               console.log(
  //                 //                 'PAIEMENT' + JSON.stringify(paiement)
  //                 //               );
  //                 //             },
  //                 //             (error) => {
  //                 //               console.log(
  //                 //                 'Table Paiement' + JSON.stringify(error)
  //                 //               );
  //                 //               this.loader = false;
  //                 //               this.ErrorForm = this.fb.group({
  //                 //                 httpStatusCode: '401',
  //                 //                 methode: 'Add To Table Paiement',
  //                 //                 login: localStorage.getItem('login'),
  //                 //                 message: JSON.stringify(error.name),
  //                 //                 description:
  //                 //                   JSON.stringify(error.message) +
  //                 //                   '\n' +
  //                 //                   JSON.stringify(error.error),
  //                 //               });
  //                 //               this.factureService
  //                 //                 .Envoierror(this.ErrorForm.value)
  //                 //                 .subscribe((res) => {
  //                 //                   console.log(this.ErrorForm.value);
  //                 //                   console.log(res);
  //                 //                 });

  //                 //               Swal.fire({
  //                 //                 title: 'Echec!',
  //                 //                 text: 'Veuillez réessayer plutard!',
  //                 //                 html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                 //                 icon: 'error',
  //                 //                 footer:
  //                 //                   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                 //               }).then((result) => {
  //                 //                 if (result.isConfirmed) {
  //                 //                   this.ngOnInit();
  //                 //                   this.router.navigate(['home']);
  //                 //                 }
  //                 //               });
  //                 //             }
  //                 //           );

  //                 //           this.t24transaction.facturier = this.FacturierSodeci;
  //                 //           this.t24transaction.datOper = this.datePaiement;
  //                 //           this.t24transaction.codOper =
  //                 //             this.commissions.codOper;
  //                 //           this.t24transaction.identifiantFacture =
  //                 //             this.editForm.value.identifiant;
  //                 //           this.t24transaction.compteCredit = '149828810018';
  //                 //           this.t24transaction.compteDebit =
  //                 //             this.editForm.value.numCpt;
  //                 //           if (this.editForm.value.typePaye === 'Total') {
  //                 //             this.t24transaction.mntOper =
  //                 //               this.editForm.value.montantFacture;
  //                 //           } else {
  //                 //             this.t24transaction.mntOper =
  //                 //               this.editForm.value.montantPaye;
  //                 //           }
  //                 //           this.t24transaction.mntFacture =
  //                 //             this.editForm.value.montantFacture;
  //                 //           this.t24transaction.mntFrais =
  //                 //             this.commissions.mntFrais;
  //                 //           this.t24transaction.mntFraisMarchand =
  //                 //             this.commissions.mntFraisMarchand;
  //                 //           this.t24transaction.mntMarchand =
  //                 //             this.commissions.mntMarchand;
  //                 //           this.t24transaction.mntTimbre =
  //                 //             this.commissions.mntTimbre;
  //                 //           this.t24transaction.libelleOper =
  //                 //             'PAIEMENT FACTURE' +
  //                 //             '_' +
  //                 //             this.paiementFacture.facturier +
  //                 //             '_' +
  //                 //             this.paiementFacture.identifiantFacture +
  //                 //             '_' +
  //                 //             this.paiementFacture.mntOper;
  //                 //           this.t24transaction.compteCom = '1';

  //                 //           this.factureService
  //                 //             .AddTransaction(this.t24transaction)
  //                 //             .subscribe(
  //                 //               (t24Response: T24Transaction) => {
  //                 //                 console.log(t24Response);
  //                 //               },
  //                 //               (error) => {
  //                 //                 console.log(
  //                 //                   'Table Transaction' + JSON.stringify(error)
  //                 //                 );
  //                 //                 this.loader = false;
  //                 //                 this.ErrorForm = this.fb.group({
  //                 //                   httpStatusCode: '401',
  //                 //                   methode: 'Add To Transaction Table',
  //                 //                   login: localStorage.getItem('login'),
  //                 //                   message: JSON.stringify(error.name),
  //                 //                   description:
  //                 //                     JSON.stringify(error.message) +
  //                 //                     '\n' +
  //                 //                     JSON.stringify(error.error),
  //                 //                 });
  //                 //                 this.factureService
  //                 //                   .Envoierror(this.ErrorForm.value)
  //                 //                   .subscribe((res) => {
  //                 //                     console.log(this.ErrorForm.value);
  //                 //                     console.log(res);
  //                 //                   });

  //                 //                 Swal.fire({
  //                 //                   title: 'Echec!',
  //                 //                   text: 'Veuillez réessayer plutard!',
  //                 //                   html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                 //                   icon: 'error',
  //                 //                   footer:
  //                 //                     '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                 //                 }).then((result) => {
  //                 //                   if (result.isConfirmed) {
  //                 //                     this.ngOnInit();
  //                 //                     this.router.navigate(['home']);
  //                 //                   }
  //                 //                 });
  //                 //               }
  //                 //             );
  //                 //         }
  //                 //         if (retourPaiementCie.CodeTraitement === 1) {
  //                 //           this.ErrorForm = this.fb.group({
  //                 //             httpStatusCode: '401',
  //                 //             methode: 'Paiement chez CIE/SODECI',
  //                 //             login: localStorage.getItem('login'),
  //                 //             message: 'Code Traitement 1',
  //                 //             description:
  //                 //               ' Erreur lors du paiement a CIE/SODECI',
  //                 //           });
  //                 //           this.factureService
  //                 //             .Envoierror(this.ErrorForm.value)
  //                 //             .subscribe((res) => {
  //                 //               console.log(this.ErrorForm.value);
  //                 //               console.log(res);
  //                 //             });
  //                 //           Swal.fire({
  //                 //             title: 'Traitement en cours',
  //                 //             text: 'Opération en cours de traitement',
  //                 //             html: '<center>Veuillez consulter votre menu de consultation plutard!<br> Un traitement peut avoir une durée maximum de 24H</center>',
  //                 //             icon: 'warning',
  //                 //             footer:
  //                 //               '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                 //           }).then((result) => {
  //                 //             if (result.isConfirmed) {
  //                 //               this.ngOnInit();
  //                 //               this.router.navigate(['home']);
  //                 //             }
  //                 //           });
  //                 //         }
  //                 //         // if(retourPaiementCie.CodeTraitement === 1){
  //                 //         //   Swal.fire({
  //                 //         //     title: 'Echec!',
  //                 //         //     text: 'Veuillez réessayer plutard!',
  //                 //         //     html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                 //         //     icon: 'error',
  //                 //         //     footer:
  //                 //         //       '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                 //         //   }).then((result) => {
  //                 //         //     if (result.isConfirmed) {
  //                 //         //       this.ngOnInit();
  //                 //         //       this.router.navigate(['home']);
  //                 //         //     }
  //                 //         //   });
  //                 //         // }
  //                 //       }
  //                 //     },
  //                 //     (error) => {
  //                 //       console.log('Paiement SODECI' + JSON.stringify(error));
  //                 //       this.loader = false;
  //                 //       this.ErrorForm = this.fb.group({
  //                 //         httpStatusCode: '401',
  //                 //         methode: 'Paiement SODECI',
  //                 //         login: localStorage.getItem('login'),
  //                 //         message: JSON.stringify(error.name),
  //                 //         description:
  //                 //           JSON.stringify(error.message) +
  //                 //           '\n' +
  //                 //           JSON.stringify(error.error),
  //                 //       });
  //                 //       this.factureService
  //                 //         .Envoierror(this.ErrorForm.value)
  //                 //         .subscribe((res) => {
  //                 //           console.log(this.ErrorForm.value);
  //                 //           console.log(res);
  //                 //         });

  //                 //       Swal.fire({
  //                 //         title: 'Echec!',
  //                 //         text: 'Veuillez réessayer plutard!',
  //                 //         html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                 //         icon: 'error',
  //                 //         footer:
  //                 //           '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //                 //       }).then((result) => {
  //                 //         if (result.isConfirmed) {
  //                 //           this.ngOnInit();
  //                 //           this.router.navigate(['home']);
  //                 //         }
  //                 //       });
  //                 //       this.autoLogoutService.autoLogout(error.status,this.router);
  //                 //     }
  //                 //   );

  //                 // // 2EME ETAPE ***INSERTION DANS LA TABLE PAIEMENT***//

  //                 // if (
  //                 //   localStorage.getItem('statutRetour') === '0' &&
  //                 //   localStorage.getItem('codetraitement') === '0'
  //                 // ) {
  //                 //   swalWithBootstrapButtons.fire(
  //                 //     'Succès',
  //                 //     'Votre paiement a bien été effectué !',
  //                 //     'success'
  //                 //   );
  //                 //   console.log('OK OK');
  //                 //   this.ngOnInit();
  //                 //   this.router.navigate(['home']);
  //                 // }
  //               } else {
  //                 swalWithBootstrapButtons.fire(
  //                   'Echec',
  //                   '<center>Votre paiement a échoué!<br>' + this.noOper+'</center>',
  //                   'error'
  //                 );
  //                 this.ngOnInit();
  //                 this.router.navigate(['home']);
  //                 console.log('ERREUR');
  //                 // this.modalService.dismissAll();

  //                 // Toast.fire({
  //                 //   icon: 'success',
  //                 //   title: 'Connexion réussie !'
  //                 // });
  //               }
  //             },
  //             (error) => {
  //               console.log('Paiement T24' + JSON.stringify(error));
  //               this.loader = false;
  //               this.ErrorForm = this.fb.group({
  //                 httpStatusCode: '401' + this.erreurCode,
  //                 methode: 'OperationPaie T24',
  //                 login: localStorage.getItem('login'),
  //                 message: 'T24 indisponible',
  //                 description:
  //                   JSON.stringify(error.message) +
  //                   '\n' +
  //                   JSON.stringify(error.error),
  //               });
  //               this.factureService
  //                 .Envoierror(this.ErrorForm.value)
  //                 .subscribe((res) => {
  //                   console.log(this.ErrorForm.value);
  //                   console.log(res);
  //                 });

  //               Swal.fire({
  //                 title: 'Echec 222!',
  //                 text: 'Veuillez réessayer plutard!',
  //                 html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //                 icon: 'error',
  //                 footer:
  //                   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //               }).then((result) => {
  //                 if (result.isConfirmed) {
  //                   this.ngOnInit();
  //                   this.router.navigate(['home']);
  //                 }
  //               });
  //               this.autoLogoutService.autoLogout(error.status,this.router);
  //             }
  //           );
  //         }
  //       },
  //       (error) => {
  //         console.log('Commission' + JSON.stringify(error));
  //         this.loader = false;
  //         this.ErrorForm = this.fb.group({
  //           httpStatusCode: '401',
  //           methode: 'GetCommission',
  //           login: localStorage.getItem('login'),
  //           message: JSON.stringify(error.name),
  //           description:
  //             JSON.stringify(error.message) +
  //             '\n' +
  //             JSON.stringify(error.error),
  //         });
  //         this.factureService
  //           .Envoierror(this.ErrorForm.value)
  //           .subscribe((res) => {
  //             console.log(this.ErrorForm.value);
  //             console.log(res);
  //           });

  //         Swal.fire({
  //           title: 'Echec!',
  //           text: 'Veuillez réessayer plutard!',
  //           html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
  //           icon: 'error',
  //           footer:
  //             '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.ngOnInit();
  //             this.router.navigate(['home']);
  //           }
  //         });
  //         this.autoLogoutService.autoLogout(error.status,this.router);
  //       }
  //     );
  //   } else {
  //     this.erreurCode = true;
  //     this.ConfirmForm.reset();
  //     // this.erreurCode = false
  //   }

  //   //  if(this.typeConfirm === 1){

  //   //   const swalWithBootstrapButtons = Swal.mixin({
  //   //     customClass: {
  //   //       confirmButton: 'btn btn-success ml-2',
  //   //       cancelButton: 'btn btn-danger',
  //   //     },
  //   //     buttonsStyling: false,
  //   //   });

  //   //   swalWithBootstrapButtons.fire({
  //   //    title: 'Code de Confirmation',
  //   //    text: 'Vous allez reçevoir un code confirmation sur votre boîte mail, Veuillez mentionner celui-ci sur l\'écran suivant',
  //   //   icon:'warning',
  //   //   confirmButtonText: 'OK',
  //   //   cancelButtonText: 'Annuler l\'opération',
  //   //   }).then((result)=>{

  //   //     if(result.isConfirmed){

  //   //     }
  //   //   });
  //   //   alert('type2')
  //   // }

  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: 'btn btn-success ml-2',
  //       cancelButton: 'btn btn-danger',
  //     },
  //     buttonsStyling: false,
  //   });
  //   localStorage.removeItem('NoOper');
  // }
  OperationPaie() {
    //alert(this.confirm + '555' + this.ConfirmForm.value.motDePasse)
    this.mdp = this.ConfirmForm.value.motDePasse;
    if (
      this.ConfirmForm.value.motDePasse == this.confirm ||
      this.ConfirmForm.value.otpfield == this.otp
    ) {
      this.show1 = false;
      this.loader = true;
      this.modalService.dismissAll();
      var numero = this.editForm.value.numCpt;
      var typeReglement = this.editForm.value.typePaye;
      var expirationDate = this.editForm.value.dateLimiteFact;
      var montantFacture = this.editForm.value.montantFacture;
      var montant;
      if(typeReglement === 'Total'){
        montant = this.editForm.value.montantFacture;
        console.log(montant + ' '+ typeReglement)

      }
      else{
        montant = this.editForm.value.montantPaye;
        console.log(montant + ' '+ typeReglement)
      }
      var montantPaye = this.editForm.value.montantPaye;
      this.statutTransaction = 'Initité'
      this.httpClient.get<any>(environment.urlFinal + 'efacture/commission/' + this.FacturierSodeci +'/'+ montant).subscribe(
        (AllCommission) => {

          this.commissions = AllCommission;

          if (AllCommission) {
            var rc = localStorage.getItem('rcCLient')
            this.paiementFacture.client = rc;
            //(this.paiementFacture.compteDebit = "141590130012");
             (this.paiementFacture.compteDebit = this.editForm.value.numCpt),
              (this.paiementFacture.facturier = this.FacturierSodeci);
            this.paiementFacture.identifiantFacture =
              this.editForm.value.identifiant;
              if (typeReglement === 'Total') {
                console.log(this.commissions.montantCommission + typeof this.commissions.montantCommission + typeof (this.editForm.value.montantFacture * 1))
                console.log(this.commissions.commissionFacturier + typeof this.commissions.commissionFacturier)
  
                this.paiementFacture.mntOper = this.editForm.value.montantFacture * 1 + this.commissions.montantCommission + this.commissions.commissionFacturier + this.commissions.mntTimbre;
                this.paiementFacture.mntFacture =
                  this.editForm.value.montantFacture;
              } else {
                console.log(typeof this.editForm.value.montantPaye + typeof this.commissions.montantCommission + typeof this.commissions.commissionFacturier)
                this.paiementFacture.mntOper = this.editForm.value.montantPaye * 1 + this.commissions.montantCommission + this.commissions.commissionFacturier + this.commissions.mntTimbre;
                this.paiementFacture.mntFacture = this.editForm.value.montantPaye;
              }
              this.paiementFacture.mntFrais = this.commissions.commissionBanque;
              (this.paiementFacture.mntFraisMarchand =
                this.commissions.commissionFacturier),
                (this.paiementFacture.mntTimbre = this.commissions.mntTimbre),

              console.log(JSON.stringify(this.paiementFacture) + 'SODECI')
            this.transactionService.Transaction(this.paiementFacture).subscribe(
              (T24: any) => {
                console.log('reponse T24:' + JSON.stringify(T24));
                this.reponseT24 = T24;
                this.ReferenceT24 = this.reponseT24.Nooper;
                this.noOper = T24.Nooper;
                this.refExterne = T24.refExterne;
                localStorage.setItem('refExterne', this.refExterne)
                

                // localStorage.setItem('statutRetour', this.reponseT24.statut);
                // localStorage.setItem('NoOper', this.ReferenceT24);

                if (this.reponseT24.statut === 1) {
                  swalWithBootstrapButtons.fire(
                    'Echec',
                    'Votre paiement a échoué !',
                    'error'
                  );
                  this.ngOnInit();
                  this.router.navigate(['home']);
                  console.log('ERREUR');
                }


                if (this.reponseT24.statut === 0) {
                  this.statutTransaction = 'En Attente'
                  console.log(this.statutTransaction + 'STATUT TRANSACTION T24')



                  // 2EME ETAPE ***PAYEMENT SODECI*** //

                 // this.sodeciTransaction.CodeOperateur = this.commissions.codeOperateur;
                  console.log(this.sodeciTransaction.CodeOperateur);
                  //DATE PAIEMENT//
                  var madate = new Date();
                  var Dates = madate.toLocaleString('fr-FR', { month: 'numeric', day: 'numeric', year: 'numeric' });
                  var Datess = Dates.toString();
                  var Date_finale = Datess.replace(/\//g, '');

                  this.sodeciTransaction.DateReglement = Date_finale;
                  console.log(this.sodeciTransaction.DateReglement);
                  if (typeReglement === "Total") {
                    this.sodeciTransaction.MontantReglement = this.editForm.value.montantFacture;
                  }
                  else {
                    this.sodeciTransaction.MontantReglement = this.editForm.value.montantPaye;
                  }

                  //HEURE PAIEMENT//

                  var heure = new Date();
                  var sodeci = heure.toLocaleString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
                  var heureEnvoi = sodeci.toString();
                  var Heure_finale = heureEnvoi.replace(/:/g, '');

                  //SEND PARAMS TO SODECI
                  this.sodeciTransaction.CodeOperateur = this.paramCommissions.codeOperateur
                  console.log(this.sodeciTransaction.CodeOperateur + 'COD')
                  this.sodeciTransaction.HeureReglement = Heure_finale;
                  console.log(this.sodeciTransaction.HeureReglement)
                  this.sodeciTransaction.NumeroRecu = this.ReferenceT24;
                  console.log(this.sodeciTransaction.NumeroRecu)
                  this.sodeciTransaction.RefContrat = this.contrat;
                  console.log(this.sodeciTransaction.RefContrat)
                  this.sodeciTransaction.RefFacture = this.editForm.value.identifiant;
                  console.log(this.sodeciTransaction.RefFacture + 'refff')
                  this.sodeciTransaction.TypeCanal = this.paramCommissions.typeCanal;
                  console.log(this.sodeciTransaction.TypeCanal)


                  console.log(JSON.stringify(this.sodeciTransaction) + 'CIEEEEEE')

                  this.transactionService.TransactionSodeci(this.sodeciTransaction).subscribe((retourPaiementCie: TraitementCie) => {
                    console.log(retourPaiementCie);
                    this.ListeretourPaiementCie = retourPaiementCie;


                    /////////////////////INSERTION TABLE CONSULTATION///////////////////////// 
                    //this.ListeretourPaiementCie.CodeTraitement  = 1; 
                    if(this.ListeretourPaiementCie.CodeTraitement === 0){
                      this.statutTransaction = 'Succès'
                      console.log(this.statutTransaction + 'STATUT TRANSACTION CT 0')
                      this.historique.identifiant =
                      localStorage.getItem('refContrat');
                    console.log(this.historique.identifiant + 'consul');
                    this.historique.dtExpFacture = expirationDate;
                    this.historique.login = this.loginC;
                    this.historique.facturier = this.FacturierSodeci;
                    this.historique.referenceFT =
                      this.noOper
                    console.log(this.historique.identifiant + 'consul');
                    this.historique.reference = this.ListeretourPaiementCie.ReferenceDeTransaction;
                    this.historique.referenceExt =  this.refExterne;
                    this.historique.numCpt = numero;
                    this.historique.typeRegle = typeReglement;
                    if (typeReglement === 'Total') {
                      this.historique.montantDebite = montantFacture;
                    } else {
                      this.historique.montantDebite = montantPaye;
                    }
                    this.historique.statut = this.statutTransaction;
                    console.log(this.statutTransaction + 'STATUT TRANSACTION')

                    this.factureService.AddHistorique(this.historique).subscribe(
                      (histfacture: Consultation) => {
                        console.log(JSON.stringify(histfacture) + 'Consultation');
                        if (histfacture) {
 
                  /////////////////////INSERTION TABLE TRANSACTION /////////////////////////////////////// 

                  this.t24transaction.facturier = this.FacturierSodeci;
                  this.t24transaction.datOper = this.datePaiement;
                  this.t24transaction.codOper = this.paramCommissions.codOper;
                  this.t24transaction.identifiantFacture =
                    this.editForm.value.identifiant;
                  this.t24transaction.compteCredit = '';
                  this.t24transaction.compteDebit = this.editForm.value.numCpt;
                  if (this.editForm.value.typePaye === 'Total') {
                    this.t24transaction.mntOper =
                      this.editForm.value.montantFacture;
                  } else {
                    this.t24transaction.mntOper =
                      this.editForm.value.montantPaye;
                  }
                  this.t24transaction.mntFacture =
                    this.editForm.value.montantFacture;
                  this.t24transaction.mntFrais = this.paiementFacture.mntFrais;
                  this.t24transaction.mntFraisMarchand =
                    this.commissions.mntFraisMarchand;
                  this.t24transaction.mntMarchand =
                    this.commissions.mntMarchand;
                  this.t24transaction.mntTimbre = this.commissions.mntTimbre;
                  this.t24transaction.libelleOper =
                    'PAIEMENT FACTURE' +
                    '_' +
                    this.paiementFacture.facturier +
                    '_' +
                    this.paiementFacture.identifiantFacture +
                    '_' +
                    this.paiementFacture.mntOper;
                  this.t24transaction.compteCom = '1';
                  this.t24transaction.codeTraitement = 0;
                  this.t24transaction.statutTraitement = this.statutTransaction;
                  console.log( this.t24transaction.statutTraitement + 'STATUT TRANSACTION T TRANSC')
                  this.factureService
                    .AddTransaction(this.t24transaction)
                    .subscribe(
                      (t24Response) => {
                        console.log(t24Response);
                        if(t24Response){
                            ////////////////////////////////////// INSERTION TABLE PAIEMENT//////////////////////////////////////////
                  this.envoiis.identifiant = this.editForm.value.identifiant;
                  this.envoiis.montantFacture =
                    this.editForm.value.montantFacture;
                  this.envoiis.intituleFacturier = this.FacturierSodeci;
                  if (this.editForm.value.typePaye === 'Total') {
                    this.envoiis.montantPaye =
                      this.editForm.value.montantFacture;
                  } else {
                    this.envoiis.montantPaye = this.editForm.value.montantPaye;
                  }

                  this.envoiis.numCpt = this.editForm.value.numCpt;
                  this.envoiis.typePaye = this.editForm.value.typePaye;
                  this.envoiis.reference = this.noOper; 
                  this.envoiis.codeReponse = this.refExterne;
                  this.envoiis.frais = this.commissions.montantCommission;
                  this.envoiis.timbre = this.commissions.mntTimbre
                  this.onSubmit(this.envoiis).subscribe(
                    (paiement: Facture) => {
                      console.log('PAIEMENT' + JSON.stringify(paiement));
                      if(paiement){
                        swalWithBootstrapButtons.fire(
                          'Succès',
                          'Votre paiement a bien été effectué!',
                          'success'
                        );
                        console.log('OK OK');
                        this.ngOnInit();
                        this.router.navigate(['home']);
                      }
                    },
                    (error) => {

                      this.autoLogoutService.autoLogout(error.status, this.router);

                      console.log('Table Paiement' + JSON.stringify(error));
                      this.loader = false;
                      this.ErrorForm = this.fb.group({
                        httpStatusCode: '401',
                        methode: 'Add To Table Paiement',
                        login: localStorage.getItem('login'),
                        message: JSON.stringify(error.name),
                        description:
                          JSON.stringify(error.message) +
                          '\n' +
                          JSON.stringify(error.error),
                      });
                      this.factureService
                        .Envoierror(this.ErrorForm.value)
                        .subscribe((res) => {
                          console.log(this.ErrorForm.value);
                          console.log(res);
                        });

                      Swal.fire({
                        title: 'Echec!',
                        text: 'Veuillez réessayer plutard!',
                        html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                        icon: 'error',
                        // footer:
                        //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.ngOnInit();
                          this.router.navigate(['home']);
                        }
                      });
                    }
                  );
                  //************////****************FIN INSERTION TABLE PAIEMENT***********////////////**////***********  

                        }
                        //localStorage.setItem('idTransac', t24Response.id);
                      },
                      (error) => {
                        console.log(
                          'Table Transaction' + JSON.stringify(error)
                        );
                        this.loader = false;
                        this.ErrorForm = this.fb.group({
                          httpStatusCode: '401',
                          methode: 'Add To Transaction Table',
                          login: localStorage.getItem('login'),
                          message: JSON.stringify(error.name),
                          description:
                            JSON.stringify(error.message) +
                            '\n' +
                            JSON.stringify(error.error),
                        });
                        this.factureService
                          .Envoierror(this.ErrorForm.value)
                          .subscribe((res) => {
                            console.log(this.ErrorForm.value);
                            console.log(res);
                          });

                        Swal.fire({
                          title: 'Echec!',
                          text: 'Veuillez réessayer plutard!',
                          html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                          icon: 'error',
                          // footer:
                          //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.ngOnInit();
                            this.router.navigate(['home']);
                          }
                        });
                        this.autoLogoutService.autoLogout(
                          error.status,
                          this.router
                        );
                      }
                    );
                  //************////****************FIN INSERTION TABLE TRANSACTION***********////////////**////***********  

                          // console.log('Table Historique OK')
                          // let body = { statut: 'Initié' };
                          // this.httpClient
                          //   .put<any>(
                          //     environment.urlFinal + 'efacture/consultation/statut/' +
                          //     this.noOper,
                          //     body
                          //   )
                          //   .subscribe((newConsul) => {
                          //     if (newConsul) {
                          //     }
                          //     console.log(newConsul);
                          //   });
                        } else {
                          console.log('error Consul');
                        }
                      },
                      (error) => {
                        console.log('Table Consultation' + JSON.stringify(error));
                        this.loader = false;
                        this.ErrorForm = this.fb.group({
                          httpStatusCode: '401',
                          methode: 'Add To Table Consultation',
                          login: localStorage.getItem('login'),
                          message: JSON.stringify(error.name),
                          description:
                            JSON.stringify(error.message) +
                            '\n' +
                            JSON.stringify(error.error),
                        });
                        this.factureService
                          .Envoierror(this.ErrorForm.value)
                          .subscribe((res) => {
                            console.log(this.ErrorForm.value);
                            console.log(res);
                          });

                        Swal.fire({
                          title: 'Echec!',
                          text: 'Veuillez réessayer plutard!',
                          html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                          icon: 'error',
                          // footer:
                          //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.ngOnInit();
                            this.router.navigate(['home']);
                          }
                        });
                        this.autoLogoutService.autoLogout(
                          error.status,
                          this.router
                        );
                      }
                    );


                    //************////****************FIN INSERTION TABLE CONSULTATION***********////////////**////***********  


                    }
                    else{
                      this.historique.identifiant =
                      localStorage.getItem('refContrat');
                    console.log(this.historique.identifiant + 'consul');
                    this.historique.dtExpFacture = expirationDate;
                    this.historique.login = this.loginC;
                    this.historique.facturier = this.FacturierSodeci;
                    this.historique.referenceFT =
                      this.noOper
                    console.log(this.historique.identifiant + 'consul');
                    this.historique.reference = this.ListeretourPaiementCie.ReferenceDeTransaction;
                    this.historique.referenceExt =  this.refExterne;
                    this.historique.numCpt = numero;
                    this.historique.typeRegle = typeReglement;
                    if (typeReglement === 'Total') {
                      this.historique.montantDebite = montantFacture;
                    } else {
                      this.historique.montantDebite = montantPaye;
                    }
                    this.historique.statut = 'En attente'

                    this.factureService.AddHistorique(this.historique).subscribe(
                      (histfacture: Consultation) => {
                        console.log(JSON.stringify(histfacture) + 'Consultation');
                        if (histfacture) {
 
                  /////////////////////INSERTION TABLE TRANSACTION /////////////////////////////////////// 

                  this.t24transaction.facturier = this.FacturierSodeci;
                  this.t24transaction.datOper = this.datePaiement;
                  this.t24transaction.codOper = this.paramCommissions.codOper;
                  this.t24transaction.identifiantFacture =
                    this.editForm.value.identifiant;
                  this.t24transaction.compteCredit = '';
                  this.t24transaction.compteDebit = this.editForm.value.numCpt;
                  if (this.editForm.value.typePaye === 'Total') {
                    this.t24transaction.mntOper =
                      this.editForm.value.montantFacture;
                  } else {
                    this.t24transaction.mntOper =
                      this.editForm.value.montantPaye;
                  }
                  this.t24transaction.mntFacture =
                    this.editForm.value.montantFacture;
                  this.t24transaction.mntFrais = this.paiementFacture.mntFrais;
                  this.t24transaction.mntFraisMarchand =
                    this.commissions.mntFraisMarchand;
                  this.t24transaction.mntMarchand =
                    this.commissions.mntMarchand;
                  this.t24transaction.mntTimbre = this.commissions.mntTimbre;
                  this.t24transaction.libelleOper =
                    'PAIEMENT FACTURE' +
                    '_' +
                    this.paiementFacture.facturier +
                    '_' +
                    this.paiementFacture.identifiantFacture +
                    '_' +
                    this.paiementFacture.mntOper;
                  this.t24transaction.compteCom = '1';
                  this.t24transaction.codeTraitement = 0;
                  this.t24transaction.statutTraitement = 'En attente';

                  this.factureService
                    .AddTransaction(this.t24transaction)
                    .subscribe(
                      (t24Response) => {
                        console.log(t24Response);
                        if(t24Response){
                            ////////////////////////////////////// INSERTION TABLE PAIEMENT//////////////////////////////////////////
                  this.envoiis.identifiant = this.editForm.value.identifiant;
                  this.envoiis.montantFacture =
                    this.editForm.value.montantFacture;
                  this.envoiis.intituleFacturier = this.FacturierSodeci;
                  if (this.editForm.value.typePaye === 'Total') {
                    this.envoiis.montantPaye =
                      this.editForm.value.montantFacture;
                  } else {
                    this.envoiis.montantPaye = this.editForm.value.montantPaye;
                  }

                  this.envoiis.numCpt = this.editForm.value.numCpt;
                  this.envoiis.typePaye = this.editForm.value.typePaye;
                  this.envoiis.reference = this.noOper; 
                  this.envoiis.codeReponse = this.refExterne;
                  this.envoiis.frais = this.commissions.montantCommission;
                  this.envoiis.timbre = this.commissions.mntTimbre
                  this.onSubmit(this.envoiis).subscribe(
                    (paiement: Facture) => {
                      console.log('PAIEMENT' + JSON.stringify(paiement));
                      if(paiement){
                        // swalWithBootstrapButtons.fire(
                        //   'Succèees',
                        //   'Votre paiement a bien été effectué s!',
                        //   'success'
                        // );
                        // console.log('OK OK');
                        // this.ngOnInit();
                        // this.router.navigate(['home']);
                      }
                    },
                    (error) => {

                      this.autoLogoutService.autoLogout(error.status, this.router);

                      console.log('Table Paiement' + JSON.stringify(error));
                      this.loader = false;
                      this.ErrorForm = this.fb.group({
                        httpStatusCode: '401',
                        methode: 'Add To Table Paiement',
                        login: localStorage.getItem('login'),
                        message: JSON.stringify(error.name),
                        description:
                          JSON.stringify(error.message) +
                          '\n' +
                          JSON.stringify(error.error),
                      });
                      this.factureService
                        .Envoierror(this.ErrorForm.value)
                        .subscribe((res) => {
                          console.log(this.ErrorForm.value);
                          console.log(res);
                        });

                      Swal.fire({
                        title: 'Echec!',
                        text: 'Veuillez réessayer plutard!',
                        html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                        icon: 'error',
                        // footer:
                        //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.ngOnInit();
                          this.router.navigate(['home']);
                        }
                      });
                    }
                  );
                  //************////****************FIN INSERTION TABLE PAIEMENT***********////////////**////***********  

                        }
                        //localStorage.setItem('idTransac', t24Response.id);
                      },
                      (error) => {
                        console.log(
                          'Table Transaction' + JSON.stringify(error)
                        );
                        this.loader = false;
                        this.ErrorForm = this.fb.group({
                          httpStatusCode: '401',
                          methode: 'Add To Transaction Table',
                          login: localStorage.getItem('login'),
                          message: JSON.stringify(error.name),
                          description:
                            JSON.stringify(error.message) +
                            '\n' +
                            JSON.stringify(error.error),
                        });
                        this.factureService
                          .Envoierror(this.ErrorForm.value)
                          .subscribe((res) => {
                            console.log(this.ErrorForm.value);
                            console.log(res);
                          });

                        Swal.fire({
                          title: 'Echec!',
                          text: 'Veuillez réessayer plutard!',
                          html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                          icon: 'error',
                          // footer:
                          //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.ngOnInit();
                            this.router.navigate(['home']);
                          }
                        });
                        this.autoLogoutService.autoLogout(
                          error.status,
                          this.router
                        );
                      }
                    );
                  //************////****************FIN INSERTION TABLE TRANSACTION***********////////////**////***********  

                          // console.log('Table Historique OK')
                          // let body = { statut: 'Initié' };
                          // this.httpClient
                          //   .put<any>(
                          //     environment.urlFinal + 'efacture/consultation/statut/' +
                          //     this.noOper,
                          //     body
                          //   )
                          //   .subscribe((newConsul) => {
                          //     if (newConsul) {
                          //     }
                          //     console.log(newConsul);
                          //   });
                        } else {
                          console.log('error Consul');
                        }
                      },
                      (error) => {
                        console.log('Table Consultation' + JSON.stringify(error));
                        this.loader = false;
                        this.ErrorForm = this.fb.group({
                          httpStatusCode: '401',
                          methode: 'Add To Table Consultation',
                          login: localStorage.getItem('login'),
                          message: JSON.stringify(error.name),
                          description:
                            JSON.stringify(error.message) +
                            '\n' +
                            JSON.stringify(error.error),
                        });
                        this.factureService
                          .Envoierror(this.ErrorForm.value)
                          .subscribe((res) => {
                            console.log(this.ErrorForm.value);
                            console.log(res);
                          });

                        Swal.fire({
                          title: 'Echec!',
                          text: 'Veuillez réessayer plutard!',
                          html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                          icon: 'error',
                          // footer:
                          //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.ngOnInit();
                            this.router.navigate(['home']);
                          }
                        });
                        this.autoLogoutService.autoLogout(
                          error.status,
                          this.router
                        );
                      }
                    );

                     // Swal.fire({
                      //   title: 'Paiement initié !',
                      //   text: 'Votre requête sera prise en compte  ',
                      //   html: '<center>Veuillez vérifier plutard!<br>vos historiques de paiement</center>',
                      //   icon: 'warning',
                      //   footer:
                      //     '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                      // }).then((result) => {
                      //   if (result.isConfirmed) {
                      //     this.ngOnInit();
                      //     this.router.navigate(['home']);
                      //   }
                      // });

                      swalWithBootstrapButtons.fire(
                        'Succès',
                        'Votre paiement a bien été effectué!',
                        'success'
                      );
                      console.log('OK OK');
                      this.ngOnInit();
                      this.router.navigate(['home']);

                    }
               


                  });




                 



                


                  ////////////////////////////////////// INSERTION TABLE REGLEMENT//////////////////////////////////////////

                  // this.factureService
                  //   .FactureByIdAndPer(
                  //     localStorage.getItem('idabon'),
                  //     localStorage.getItem('perfact')
                  //   )
                  //   .subscribe((data: ReglementSodeci) => {
                  //     console.log(data);

                  //     if (data) {
                  //       this.ReglementFactureSodeci.codexp = data.codexp;
                  //       this.ReglementFactureSodeci.codmvt = "RG";
                  //       // this.ReglementFactureSodeci.dateEnr = new Date() ;
                  //       // this.ReglementFactureSodeci.dateRegle = new Date();
                  //       //this.ReglementFactureSodeci.idRgSodeci = 1;
                  //       this.ReglementFactureSodeci.idabon = data.idabon;
                  //       this.ReglementFactureSodeci.idabon2 = data.idabon;
                  //       this.ReglementFactureSodeci.montantRegle = this.editForm.value.montantFacture;
                  //       this.ReglementFactureSodeci.numeroRecu = this.noOper;
                  //       this.ReglementFactureSodeci.numfact = data.numfact;
                  //       this.ReglementFactureSodeci.perfact = data.perfact;
                  //       this.ReglementFactureSodeci.refbranch = data.refbranch;
                  //       this.ReglementFactureSodeci.sens = data.sens;
                  //       this.ReglementFactureSodeci.statut = data.statut;
                  //       this.ReglementFactureSodeci.typeCanal = data.typeCanal;
                  //       this.ReglementFactureSodeci.typfact = data.typfact;
                  //       this.ReglementFactureSodeci.typmvt = data.typmvt;
                  //       this.transactionService
                  //         .ReglementCie(this.ReglementFactureSodeci)
                  //         .subscribe((rg: ReglementCie) => {
                  //           console.log(rg);

                  //           let idabon = localStorage.getItem('idabon');
                  //           let perfact = localStorage.getItem('perfact');
                  //           console.log(idabon + '' + perfact);
                  //           this.factureService.CieFactureByIdAndPer(idabon, perfact).subscribe((data) => {
                  //             console.log(data);

                  //             if (data) {
                  //               let body = { idabon: data.idabon, perfact: data.perfact, statut: 'V' };
                  //               this.httpClient
                  //                 .put<any>(environment.urlFinal + 'efacture/em/CieUpdateStatut', body)
                  //                 .subscribe((newFacture) => {
                  //                   console.log(newFacture);

                  //                   if (newFacture != 0) {
                  //                     swalWithBootstrapButtons.fire(
                  //                       'Succès',
                  //                       'Votre paiement a bien été effectué!',
                  //                       'success'
                  //                     );
                  //                     console.log('OK OK');
                  //                     this.ngOnInit();
                  //                     this.router.navigate(['home']);
                  //                   }
                  //                 }, err => {
                  //                   this.autoLogoutService.autoLogout(err.status, this.router);
                  //                 });
                  //             }
                  //           }, err => {
                  //             this.autoLogoutService.autoLogout(err.status, this.router);
                  //           });


                  //         }, err => {
                  //           this.autoLogoutService.autoLogout(err.status, this.router);
                  //         });
                  //     }
                  //   }, err => {
                  //     this.autoLogoutService.autoLogout(err.status, this.router);
                  //   });
                  //************////****************FIN INSERTION TABLE REGLEMENT***********////////////**////***********  

                  // if (
                  //   localStorage.getItem('statutRetour') === '0'
                  // ) {
                  //   swalWithBootstrapButtons.fire(
                  //     'Succès',
                  //     'Votre paiement a bien été effectué s!',
                  //     'success'
                  //   );
                  //   console.log('OK OK');
                  //   this.ngOnInit();
                  //   this.router.navigate(['home']);
                  // }
                  ////////////////////////////////////////////////// 2EME ETAPE ***PAYEMENT SODECI*** ////////////////////////////////////

                  // this.sodeciTransaction.CodeOperateur =
                  //   this.  .codeOperateur;
                  // console.log(this.sodeciTransaction.CodeOperateur);

                  // //DATE PAIEMENT//
                  // var madate = new Date();
                  // var Dates = madate.toLocaleString('fr-FR', {
                  //   month: 'numeric',
                  //   day: 'numeric',
                  //   year: 'numeric',
                  // });
                  // var Datess = Dates.toString();
                  // var Date_finale = Datess.replace(/\//g, '');

                  // this.sodeciTransaction.DateReglement = Date_finale;
                  // console.log(this.sodeciTransaction.DateReglement);
                  // if (typeReglement === 'Total') {
                  //   this.sodeciTransaction.MontantReglement =
                  //     this.editForm.value.montantFacture;
                  // } else {
                  //   this.sodeciTransaction.MontantReglement =
                  //     this.editForm.value.montantPaye;
                  // }

                  // //HEURE PAIEMENT//

                  // var heure = new Date();
                  // var sodeci = heure.toLocaleString('fr-FR', {
                  //   hour: 'numeric',
                  //   minute: 'numeric',
                  //   second: 'numeric',
                  //   hour12: false,
                  // });
                  // var heureEnvoi = sodeci.toString();
                  // var Heure_finale = heureEnvoi.replace(/:/g, '');

                  // this.sodeciTransaction.HeureReglement = Heure_finale;
                  // console.log(this.sodeciTransaction.HeureReglement);
                  // this.sodeciTransaction.NumeroRecu = this.ReferenceT24;
                  // console.log(this.sodeciTransaction.NumeroRecu + 'NUMERO RECU');
                  // this.sodeciTransaction.RefContrat =
                  //   localStorage.getItem('refContrat');
                  // console.log(this.sodeciTransaction.RefContrat + 'REF CONTRAT ');
                  // this.sodeciTransaction.RefFacture =
                  //   this.editForm.value.identifiant;
                  // console.log(this.sodeciTransaction.RefFacture + 'refff');
                  // this.sodeciTransaction.TypeCanal = this.commissions.typeCanal;
                  // console.log(this.sodeciTransaction.TypeCanal + 'TYPE CANAL');

                  // this.transactionService
                  //   .TransactionCie(this.sodeciTransaction)
                  //   .subscribe(
                  //     (retourPaiementCie) => {
                  //       if (retourPaiementCie) {
                  //         localStorage.setItem(
                  //           'codetraitement',
                  //           retourPaiementCie.CodeTraitement
                  //         );
                  //         console.log(
                  //           'RETOUR SODECI' +
                  //             JSON.stringify(retourPaiementCie) +
                  //             '' +
                  //             retourPaiementCie.CodeTraitement
                  //         );
                  //         //////////////////////*** INSERTION TABLE CONSULTATION ***///////////////////////////////////////
                  //         if (retourPaiementCie.CodeTraitement === 0) {
                  //           let bodyy = { reference: retourPaiementCie.ReferenceDeTransaction};
                  //           this.httpClient
                  //             .put<any>(
                  //               environment.apiUrl +
                  //                 'reference/' +
                  //                 localStorage.getItem('NoOper'),
                  //               bodyy
                  //             )
                  //             .subscribe((newConsul) => {
                  //               if (newConsul) {
                  //               }
                  //               console.log(newConsul);
                  //             });

                  //           let body = { statut: 'Succès' };
                  //           this.httpClient
                  //             .put<any>(
                  //               environment.apiUrl +
                  //                 'statut/' +
                  //                 localStorage.getItem('NoOper'),
                  //               body
                  //             )
                  //             .subscribe((newConsul) => {
                  //               if (newConsul) {
                  //               }
                  //               console.log(newConsul);
                  //             });

                  //             let bodyTransact = { codeTraitement: '1', statutTraitement: "Succès" };
                  //             this.httpClient
                  //               .put<any>(
                  //                 environment.apiUrl +
                  //                   'transaction/' +
                  //                   localStorage.getItem('idTransac'),
                  //                   bodyTransact
                  //               )
                  //               .subscribe((newConsul) => {
                  //                 if (newConsul) {
                  //                 }
                  //                 console.log(newConsul);
                  //               });
                  //           // this.ListeretourPaiementCie = retourPaiementCie;
                  //           // this.referenceCie =
                  //           //   this.ListeretourPaiementCie.ReferenceDeTransaction;
                  //           // console.log(this.referenceCie + 'reference SODECI');

                  //           /////////////////////////////// INSERTION TABLE PAIEMENT/////////////////////////
                  //           this.envoiis.identifiant =
                  //             this.editForm.value.identifiant;
                  //           this.envoiis.montantFacture =
                  //             this.editForm.value.montantFacture;
                  //           this.envoiis.intituleFacturier = this.FacturierSodeci;
                  //           if (this.editForm.value.typePaye === 'Total') {
                  //             this.envoiis.montantPaye =
                  //               this.editForm.value.montantFacture;
                  //           } else {
                  //             this.envoiis.montantPaye =
                  //               this.editForm.value.montantPaye;
                  //           }

                  //           this.envoiis.numCpt = this.editForm.value.numCpt;
                  //           this.envoiis.typePaye =
                  //             this.editForm.value.typePaye;
                  //           this.onSubmit(this.envoiis).subscribe(
                  //             (paiement: Facture) => {
                  //               console.log(
                  //                 'PAIEMENT' + JSON.stringify(paiement)
                  //               );
                  //             },
                  //             (error) => {
                  //               console.log(
                  //                 'Table Paiement' + JSON.stringify(error)
                  //               );
                  //               this.loader = false;
                  //               this.ErrorForm = this.fb.group({
                  //                 httpStatusCode: '401',
                  //                 methode: 'Add To Table Paiement',
                  //                 login: localStorage.getItem('login'),
                  //                 message: JSON.stringify(error.name),
                  //                 description:
                  //                   JSON.stringify(error.message) +
                  //                   '\n' +
                  //                   JSON.stringify(error.error),
                  //               });
                  //               this.factureService
                  //                 .Envoierror(this.ErrorForm.value)
                  //                 .subscribe((res) => {
                  //                   console.log(this.ErrorForm.value);
                  //                   console.log(res);
                  //                 });

                  //               Swal.fire({
                  //                 title: 'Echec!',
                  //                 text: 'Veuillez réessayer plutard!',
                  //                 html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                  //                 icon: 'error',
                  //                 footer:
                  //                   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                  //               }).then((result) => {
                  //                 if (result.isConfirmed) {
                  //                   this.ngOnInit();
                  //                   this.router.navigate(['home']);
                  //                 }
                  //               });
                  //             }
                  //           );

                  //           this.t24transaction.facturier = this.FacturierSodeci;
                  //           this.t24transaction.datOper = this.datePaiement;
                  //           this.t24transaction.codOper =
                  //             this.commissions.codOper;
                  //           this.t24transaction.identifiantFacture =
                  //             this.editForm.value.identifiant;
                  //           this.t24transaction.compteCredit = '149828810018';
                  //           this.t24transaction.compteDebit =
                  //             this.editForm.value.numCpt;
                  //           if (this.editForm.value.typePaye === 'Total') {
                  //             this.t24transaction.mntOper =
                  //               this.editForm.value.montantFacture;
                  //           } else {
                  //             this.t24transaction.mntOper =
                  //               this.editForm.value.montantPaye;
                  //           }
                  //           this.t24transaction.mntFacture =
                  //             this.editForm.value.montantFacture;
                  //           this.t24transaction.mntFrais =
                  //             this.commissions.mntFrais;
                  //           this.t24transaction.mntFraisMarchand =
                  //             this.commissions.mntFraisMarchand;
                  //           this.t24transaction.mntMarchand =
                  //             this.commissions.mntMarchand;
                  //           this.t24transaction.mntTimbre =
                  //             this.commissions.mntTimbre;
                  //           this.t24transaction.libelleOper =
                  //             'PAIEMENT FACTURE' +
                  //             '_' +
                  //             this.paiementFacture.facturier +
                  //             '_' +
                  //             this.paiementFacture.identifiantFacture +
                  //             '_' +
                  //             this.paiementFacture.mntOper;
                  //           this.t24transaction.compteCom = '1';

                  //           this.factureService
                  //             .AddTransaction(this.t24transaction)
                  //             .subscribe(
                  //               (t24Response: T24Transaction) => {
                  //                 console.log(t24Response);
                  //               },
                  //               (error) => {
                  //                 console.log(
                  //                   'Table Transaction' + JSON.stringify(error)
                  //                 );
                  //                 this.loader = false;
                  //                 this.ErrorForm = this.fb.group({
                  //                   httpStatusCode: '401',
                  //                   methode: 'Add To Transaction Table',
                  //                   login: localStorage.getItem('login'),
                  //                   message: JSON.stringify(error.name),
                  //                   description:
                  //                     JSON.stringify(error.message) +
                  //                     '\n' +
                  //                     JSON.stringify(error.error),
                  //                 });
                  //                 this.factureService
                  //                   .Envoierror(this.ErrorForm.value)
                  //                   .subscribe((res) => {
                  //                     console.log(this.ErrorForm.value);
                  //                     console.log(res);
                  //                   });

                  //                 Swal.fire({
                  //                   title: 'Echec!',
                  //                   text: 'Veuillez réessayer plutard!',
                  //                   html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                  //                   icon: 'error',
                  //                   footer:
                  //                     '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                  //                 }).then((result) => {
                  //                   if (result.isConfirmed) {
                  //                     this.ngOnInit();
                  //                     this.router.navigate(['home']);
                  //                   }
                  //                 });
                  //               }
                  //             );
                  //         }
                  //         if (retourPaiementCie.CodeTraitement === 1) {
                  //           this.ErrorForm = this.fb.group({
                  //             httpStatusCode: '401',
                  //             methode: 'Paiement chez CIE/SODECI',
                  //             login: localStorage.getItem('login'),
                  //             message: 'Code Traitement 1',
                  //             description:
                  //               ' Erreur lors du paiement a CIE/SODECI',
                  //           });
                  //           this.factureService
                  //             .Envoierror(this.ErrorForm.value)
                  //             .subscribe((res) => {
                  //               console.log(this.ErrorForm.value);
                  //               console.log(res);
                  //             });
                  //           Swal.fire({
                  //             title: 'Traitement en cours',
                  //             text: 'Opération en cours de traitement',
                  //             html: '<center>Veuillez consulter votre menu de consultation plutard!<br> Un traitement peut avoir une durée maximum de 24H</center>',
                  //             icon: 'warning',
                  //             footer:
                  //               '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                  //           }).then((result) => {
                  //             if (result.isConfirmed) {
                  //               this.ngOnInit();
                  //               this.router.navigate(['home']);
                  //             }
                  //           });
                  //         }
                  //         // if(retourPaiementCie.CodeTraitement === 1){
                  //         //   Swal.fire({
                  //         //     title: 'Echec!',
                  //         //     text: 'Veuillez réessayer plutard!',
                  //         //     html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                  //         //     icon: 'error',
                  //         //     footer:
                  //         //       '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                  //         //   }).then((result) => {
                  //         //     if (result.isConfirmed) {
                  //         //       this.ngOnInit();
                  //         //       this.router.navigate(['home']);
                  //         //     }
                  //         //   });
                  //         // }
                  //       }
                  //     },
                  //     (error) => {
                  //       console.log('Paiement SODECI' + JSON.stringify(error));
                  //       this.loader = false;
                  //       this.ErrorForm = this.fb.group({
                  //         httpStatusCode: '401',
                  //         methode: 'Paiement SODECI',
                  //         login: localStorage.getItem('login'),
                  //         message: JSON.stringify(error.name),
                  //         description:
                  //           JSON.stringify(error.message) +
                  //           '\n' +
                  //           JSON.stringify(error.error),
                  //       });
                  //       this.factureService
                  //         .Envoierror(this.ErrorForm.value)
                  //         .subscribe((res) => {
                  //           console.log(this.ErrorForm.value);
                  //           console.log(res);
                  //         });

                  //       Swal.fire({
                  //         title: 'Echec!',
                  //         text: 'Veuillez réessayer plutard!',
                  //         html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                  //         icon: 'error',
                  //         footer:
                  //           '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                  //       }).then((result) => {
                  //         if (result.isConfirmed) {
                  //           this.ngOnInit();
                  //           this.router.navigate(['home']);
                  //         }
                  //       });
                  //       this.autoLogoutService.autoLogout(error.status,this.router);
                  //     }
                  //   );

                  // // 2EME ETAPE ***INSERTION DANS LA TABLE PAIEMENT***//

                  // if (
                  //   localStorage.getItem('statutRetour') === '0' &&
                  //   localStorage.getItem('codetraitement') === '0'
                  // ) {
                  //   swalWithBootstrapButtons.fire(
                  //     'Succès',
                  //     'Votre paiement a bien été effectué !',
                  //     'success'
                  //   );
                  //   console.log('OK OK');
                  //   this.ngOnInit();
                  //   this.router.navigate(['home']);
                  // }
                } else {
                  swalWithBootstrapButtons.fire(
                    'Echec',
                    '<center>Votre paiement a échoué!<br>' + this.noOper + '</center>',
                    'error'
                  );
                  this.ngOnInit();
                  this.router.navigate(['home']);
                  console.log('ERREUR');
                  // this.modalService.dismissAll();

                  // Toast.fire({
                  //   icon: 'success',
                  //   title: 'Connexion réussie !'
                  // });
                }
              },
              (error) => {
                console.log('Paiement T24' + JSON.stringify(error));
                this.loader = false;
                this.ErrorForm = this.fb.group({
                  httpStatusCode: '401' + this.erreurCode,
                  methode: 'OperationPaie T24',
                  login: localStorage.getItem('login'),
                  message: 'T24 indisponible',
                  description:
                    JSON.stringify(error.message) +
                    '\n' +
                    JSON.stringify(error.error),
                });
                this.factureService
                  .Envoierror(this.ErrorForm.value)
                  .subscribe((res) => {
                    console.log(this.ErrorForm.value);
                    console.log(res);
                  });

                Swal.fire({
                  title: 'Echec!',
                  text: 'Veuillez réessayer plutard!',
                  html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
                  icon: 'error',
                  // footer:
                  //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.ngOnInit();
                    this.router.navigate(['home']);
                  }
                });
                this.autoLogoutService.autoLogout(error.status, this.router);
              }
            );
          }
        },
        (error) => {
          console.log('Commission' + JSON.stringify(error));
          this.loader = false;
          this.ErrorForm = this.fb.group({
            httpStatusCode: '401',
            methode: 'GetCommission',
            login: localStorage.getItem('login'),
            message: JSON.stringify(error.name),
            description:
              JSON.stringify(error.message) +
              '\n' +
              JSON.stringify(error.error),
          });
          this.factureService
            .Envoierror(this.ErrorForm.value)
            .subscribe((res) => {
              console.log(this.ErrorForm.value);
              console.log(res);
            });

          Swal.fire({
            title: 'Echec!',
            text: 'Veuillez réessayer plutard!',
            html: '<center>Veuillez réessayer plutard!<br>Système indisponible actuellement</center>',
            icon: 'error',
            // footer:
            //   '<a href="/Choix_facturier">Rechercher une autre facture?</a>',
          }).then((result) => {
            if (result.isConfirmed) {
              this.ngOnInit();
              this.router.navigate(['home']);
            }
          });
          this.autoLogoutService.autoLogout(error.status, this.router);
        }
      );
    } else {
      this.erreurCode = true;
      this.ConfirmForm.reset();
      // this.erreurCode = false
    }

    //  if(this.typeConfirm === 1){

    //   const swalWithBootstrapButtons = Swal.mixin({
    //     customClass: {
    //       confirmButton: 'btn btn-success ml-2',
    //       cancelButton: 'btn btn-danger',
    //     },
    //     buttonsStyling: false,
    //   });

    //   swalWithBootstrapButtons.fire({
    //    title: 'Code de Confirmation',
    //    text: 'Vous allez reçevoir un code confirmation sur votre boîte mail, Veuillez mentionner celui-ci sur l\'écran suivant',
    //   icon:'warning',
    //   confirmButtonText: 'OK',
    //   cancelButtonText: 'Annuler l\'opération',
    //   }).then((result)=>{

    //     if(result.isConfirmed){

    //     }
    //   });
    //   alert('type2')
    // }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    localStorage.removeItem('NoOper');
  }
  getFactureIdAndPer() {

    let idabon = localStorage.getItem('idabon');
    let perfact = localStorage.getItem('perfact');
    console.log(idabon + '' + perfact);
    this.factureService.CieFactureByIdAndPer(idabon, perfact).subscribe((data) => {
      console.log(data);

      if (data) {
        let body = { idabon: data.idabon, perfact: data.perfact, statut: 'V' };
        this.httpClient
          .put<any>(environment.urlFinal + 'efacture/em/CieUpdateStatut', body)
          .subscribe((newFacture) => {
            console.log(newFacture);
          }, err => {
            this.autoLogoutService.autoLogout(err.status, this.router);
          });
      }
    }, err => {
      this.autoLogoutService.autoLogout(err.status, this.router);
    });
  }
  // swalWithBootstrapButtons
  //   .fire({
  //     title: 'Êtes vous sûr?',
  //     text: 'Vous ne pourrez pas revenir en arrière!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Oui',
  //     cancelButtonText: 'Non',
  //     reverseButtons: true,
  //   })
  //   .then((result) => {
  //     if (result.isConfirmed) {
  // this.show1 = false;
  // this.loader = true;
  // this.modalService.dismissAll();

  // 1ERE ETAPE ***PAYEMENT COREBANKING SUR T24***//

  // this.paiementFacture.codOper = 'U30';
  // console.log(this.paiementFacture.codOper);
  // this.paiementFacture.compteCredit = '149828810018';
  // (this.paiementFacture.compteDebit = this.editForm.value.numCpt),
  //   (this.paiementFacture.facturier = this.FacturierSodeci);
  // this.paiementFacture.identifiantFacture = this.editForm.value.identifiant;
  // if (typeReglement === 'Total') {
  //   this.paiementFacture.mntOper = this.editForm.value.montantFacture;
  //   this.paiementFacture.mntFacture = this.editForm.value.montantFacture;
  // } else {
  //   this.paiementFacture.mntOper = this.editForm.value.montantPaye;
  //   this.paiementFacture.mntFacture = this.editForm.value.montantPaye;
  // }
  // this.paiementFacture.mntFrais = this.commissions.mntFrais;
  // (this.paiementFacture.mntFraisMarchand =
  //   this.commissions.mntFraisMarchand),
  //   (this.paiementFacture.mntTimbre = this.commissions.mntTimbre),
  //   (this.paiementFacture.libelleOper =
  //     'PAIEMENT FACTURE' +
  //     '_' +
  //     this.FacturierSodeci +
  //     '_' +
  //     this.paiementFacture.identifiantFacture +
  //     '_' +
  //     this.paiementFacture.mntOper);

  // this.transactionService
  //   .Transaction(this.paiementFacture)
  //   .pipe(timeout(1000))
  //   .subscribe(
  //     (T24: Response) => {
  //       console.log(T24);
  //       this.reponseT24 = T24;
  //       this.ReferenceT24 = this.reponseT24.Nooper;
  //       console.log(this.ReferenceT24);
  //       console.log(this.reponseT24.statut);

  //       if (this.reponseT24.statut === 0) {
  //         // 2EME ETAPE ***PAYEMENT SODECI*** //

  //         this.sodeciTransaction.CodeOperateur =
  //           this.commissions.codeOperateur;
  //         console.log(this.sodeciTransaction.CodeOperateur);
  //         //DATE PAIEMENT//
  //         var madate = new Date();
  //         var Dates = madate.toLocaleString('fr-FR', {
  //           month: 'numeric',
  //           day: 'numeric',
  //           year: 'numeric',
  //         });
  //         var Datess = Dates.toString();
  //         var Date_finale = Datess.replace(/\//g, '');

  //         this.sodeciTransaction.DateReglement = Date_finale;
  //         console.log(this.sodeciTransaction.DateReglement);
  //         if (typeReglement === 'Total') {
  //           this.sodeciTransaction.MontantReglement =
  //             this.editForm.value.montantFacture;
  //         } else {
  //           this.sodeciTransaction.MontantReglement =
  //             this.editForm.value.montantPaye;
  //         }

  //         //HEURE PAIEMENT//

  //         var heure = new Date();
  //         var sodeci = heure.toLocaleString('fr-FR', {
  //           hour: 'numeric',
  //           minute: 'numeric',
  //           second: 'numeric',
  //           hour12: false,
  //         });
  //         var heureEnvoi = sodeci.toString();
  //         var Heure_finale = heureEnvoi.replace(/:/g, '');

  // this.sodeciTransaction.HeureReglement = Heure_finale;
  // console.log(this.sodeciTransaction.HeureReglement);
  // this.sodeciTransaction.NumeroRecu = this.ReferenceT24;
  // console.log(this.sodeciTransaction.NumeroRecu);
  // this.sodeciTransaction.RefContrat = this.ReferenceContrat;
  // console.log(this.sodeciTransaction.RefContrat);
  // this.sodeciTransaction.RefFacture = this.editForm.value.identifiant;
  // console.log(this.sodeciTransaction.RefFacture + 'refff');
  // this.sodeciTransaction.TypeCanal = this.commissions.typeCanal;
  // console.log(this.sodeciTransaction.TypeCanal);

  // this.transactionService
  //   .TransactionCie(this.sodeciTransaction)
  //   .subscribe((retourPaiementCie: TraitementCie) => {
  //     console.log(retourPaiementCie);
  //     this.ListeretourPaiementCie = retourPaiementCie;

  //     this.referenceCie =
  //       this.ListeretourPaiementCie.ReferenceDeTransaction;
  //     console.log(this.referenceCie + 'reference SODECI');

  //this.ListeretourPaiementCie.ReferenceDeTransaction

  //*** INSERTION TABLE CONSULTATION ***//
  //   this.historique.identifiant = this.sodeciTransaction.RefFacture;
  //   console.log(this.historique.identifiant + 'consul');
  //   this.historique.dtExpFacture = expirationDate;
  //   this.historique.login = this.username;
  //   this.historique.facturier = this.FacturierSodeci;
  //   this.historique.reference =
  //     this.ListeretourPaiementCie.ReferenceDeTransaction;
  //   this.historique.dateRegle = this.datePaiement;
  //   this.historique.numCpt = numero;
  //   this.historique.typeRegle = typeReglement;
  //   if (typeReglement === 'Total') {
  //     this.historique.montantDebite = montantFacture;
  //   } else {
  //     this.historique.montantDebite = montantPaye;
  //   }

  //   this.factureService
  //     .AddHistorique(this.historique)
  //     .subscribe((histfacture: Consultation) => {
  //       console.log(histfacture);
  //     });
  // });
  // this.envoiis.identifiant = this.editForm.value.identifiant;
  // this.envoiis.montantFacture = this.editForm.value.montantFacture;
  // this.envoiis.intituleFacturier = this.FacturierSodeci;
  // if (this.editForm.value.typePaye === 'Total') {
  //   this.envoiis.montantPaye = this.editForm.value.montantFacture;
  // } else {
  //   this.envoiis.montantPaye = this.editForm.value.montantPaye;
  // }
  // this.envoiis.numCpt = this.editForm.value.numCpt;
  // this.envoiis.typePaye = this.editForm.value.typePaye;
  // this.onSubmit(this.envoiis).subscribe((paiement: Facture) => {
  //   console.log(paiement);

  //   //TABLE CONSULTATION
  // });

  //       this.t24transaction.facturier = this.FacturierSodeci;
  //       this.t24transaction.datOper = this.datePaiement;
  //       this.t24transaction.codOper = this.commissions.codOper;
  //       this.t24transaction.identifiantFacture =
  //         this.editForm.value.identifiant;
  //       this.t24transaction.compteCredit = '149828810018';
  //       this.t24transaction.compteDebit = this.editForm.value.numCpt;
  //       if (this.editForm.value.typePaye === 'Total') {
  //         this.t24transaction.mntOper =
  //           this.editForm.value.montantFacture;
  //       } else {
  //         this.t24transaction.mntOper = this.editForm.value.montantPaye;
  //       }
  //       this.t24transaction.mntFacture =
  //         this.editForm.value.montantFacture;
  //       this.t24transaction.mntFrais = this.commissions.mntFrais;
  //       this.t24transaction.mntFraisMarchand =
  //         this.commissions.mntFraisMarchand;
  //       this.t24transaction.mntMarchand = this.commissions.mntMarchand;
  //       this.t24transaction.mntTimbre = this.commissions.mntTimbre;
  //       this.t24transaction.libelleOper =
  //         'PAIEMENT FACTURE' +
  //         '_' +
  //         this.paiementFacture.facturier +
  //         '_' +
  //         this.paiementFacture.identifiantFacture +
  //         '_' +
  //         this.paiementFacture.mntOper;
  //       this.t24transaction.compteCom = '1';

  //       if (this.statutT24 === 0) {
  //         this.t24transaction.codeTraitement = 0;
  //         this.t24transaction.statutTraitement = 'succès';
  //       }

  //       // });
  //       this.factureService
  //         .AddTransaction(this.t24transaction)
  //         .subscribe((t24Response: T24Transaction) => {
  //           console.log(t24Response);
  //         });

  //       // 2EME ETAPE ***INSERTION DANS LA TABLE PAIEMENT***//

  //       this.loader = false;
  //       swalWithBootstrapButtons.fire(
  //         'Succès',
  //         'Votre paiement à bien été effectué !',
  //         'success'
  //       );
  //       console.log('OK OK');
  //       this.ngOnInit();
  //       this.router.navigate(['home']);
  //     } else {
  //       swalWithBootstrapButtons.fire(
  //         'Echec',
  //         'Votre paiement à échoué !',
  //         'error'
  //       );
  //       this.ngOnInit();
  //       this.router.navigate(['home']);
  //       console.log('ERREUR');
  //       // this.modalService.dismissAll();

  //       // Toast.fire({
  //       //   icon: 'success',
  //       //   title: 'Connexion réussie !'
  //       // });
  //     }
  //   },
  //   (error) => {
  //     console.log('erreur' + error);
  //     this.loader = false;
  //     swalWithBootstrapButtons.fire(
  //       'Echec',
  //       'Votre paiement à échoué !',
  //       'error'
  //     );
  //   }
  // );

  // insertion dans la table transaction
  //this.AddTransactions();
  //}
  // else if (
  //   /* Read more about handling dismissals below */
  //   result.dismiss === Swal.DismissReason.cancel
  // ) {
  //   swalWithBootstrapButtons.fire(
  //     'Paiement Annulé',
  //     'Votre paiement a été annulé',
  //     'error'
  //   );
  // }
  // });
  // } else {
  //   this.erreurCode = true;
  //   this.ConfirmForm.reset();
  //   // this.erreurCode = false
  // }

  // const Toast = Swal.mixin({
  //   toast: true,
  //   position: 'top-end',
  //   icon: 'center',
  //   showConfirmationButton: false,
  //   timer: 2300,
  //   timerProgressBar: true,
  //   didOpen: (toast) => {
  //     toast.addEventListener('mouseenter', Swal.stopTimer);
  //     toast.addEventListener('mouseleave', Swal.resumeTimer);
  //   }
  // });

  Rg() {
    this.ReglementFactureSodeci.codexp = '139';
    this.ReglementFactureSodeci.codmvt = 'RG';
    // this.ReglementFactureSodeci.dateEnr = new Date() ;
    // this.ReglementFactureSodeci.dateRegle = new Date();
    //this.ReglementFactureSodeci.idRgSodeci = 1;
    this.ReglementFactureSodeci.idabon = '139057144';
    this.ReglementFactureSodeci.idabon2 = '139057144';
    this.ReglementFactureSodeci.montantRegle = 0;
    this.ReglementFactureSodeci.numeroRecu = 'GFGRGRR';
    this.ReglementFactureSodeci.numfact = '0000';
    this.ReglementFactureSodeci.perfact = '122018';
    this.ReglementFactureSodeci.refbranch = '139074020710';
    this.ReglementFactureSodeci.sens = '+';
    this.ReglementFactureSodeci.statut = 'N';
    this.ReglementFactureSodeci.typeCanal = 'EN';
    this.ReglementFactureSodeci.typfact = 'EN';
    this.ReglementFactureSodeci.typmvt = '01';
    this.transactionService
      .ReglementSodeci(this.ReglementFactureSodeci)
      .subscribe((rg: ReglementSodeci) => {
        console.log(rg);
        this.getFactureIdAndPer();
      });
  }

  AddTransactions() {
    this.t24transaction.facturier = this.editForm.value.intituleFacturier;
    this.t24transaction.datOper = this.datePaiement;
    this.t24transaction.codOper = this.commissions.codOper;
    this.t24transaction.identifiantFacture = this.editForm.value.identifiant;
    this.t24transaction.compteCredit = '149828810018';
    this.t24transaction.compteDebit = this.editForm.value.numCpt;
    if (this.editForm.value.typePaye === 'Total') {
      this.t24transaction.mntOper = this.editForm.value.montantFacture;
    } else {
      this.t24transaction.mntOper = this.editForm.value.montantPaye;
    }
    this.t24transaction.mntFacture = this.editForm.value.montantFacture;
    this.t24transaction.mntFrais = this.commissions.mntFrais;
    this.t24transaction.mntFraisMarchand = this.commissions.mntFraisMarchand;
    this.t24transaction.mntMarchand = this.commissions.mntMarchand;
    this.t24transaction.mntTimbre = this.commissions.mntTimbre;
    this.t24transaction.libelleOper =
      'PAIEMENT FACTURE' +
      '_' +
      this.paiementFacture.facturier +
      '_' +
      this.paiementFacture.identifiantFacture +
      '_' +
      this.paiementFacture.mntOper;
    this.t24transaction.compteCom = '1';

    if (this.statutT24 === 0) {
      this.t24transaction.codeTraitement = 7;
      this.t24transaction.statutTraitement = 'succès';
    }
    // else {
    //   this.t24transaction.codeTraitement = 2;
    //   this.t24transaction.statutTraitement = "en attente"
    // }

    this.factureService.AddTransaction(this.t24transaction).subscribe(
      (t24Response: T24Transaction) => {
        console.log(t24Response);
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  // OperationPaies() {
  //   this.httpClient
  //     .get<any>(environment.apiUrl + 'commissions')
  //     .subscribe((AllCommission) => {
  //       this.commissions = AllCommission[0];
  //     });
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: 'btn btn-success ml-2',
  //       cancelButton: 'btn btn-danger',
  //     },
  //     buttonsStyling: false,
  //   });
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: 'Êtes vous sûr?',
  //       text: 'Vous ne pourrez pas revenir en arrière!',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Oui',
  //       cancelButtonText: 'Non',
  //       reverseButtons: true,
  //     })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         this.show1 = false;
  //         this.loader = true;
  //         this.modalService.dismissAll();

  //       // 1ERE ETAPE ***PAYEMENT COREBANKING SUR T24***//

  //         this.paiementFacture.codOper = this.commissions.codOper;
  //         this.paiementFacture.compteCredit = '149828810018';
  //         this.paiementFacture.compteDebit = this.editForm.value.numCpt,
  //         this.paiementFacture.facturier = this.FacturierSodeci;
  //             // this.editForm.value.intituleFacturier),
  //         this.paiementFacture.identifiantFacture = this.editForm.value.identifiant;
  //           console.log(this.identifiant);
  //         this.paiementFacture.mntOper = this.editForm.value.montantFacture;
  //         this.paiementFacture.mntFacture = this.editForm.value.montantFacture;
  //         this.paiementFacture.mntFrais = this.commissions.mntFrais;
  //         this.paiementFacture.mntFraisMarchand = this.commissions.mntFraisMarchand,
  //         this.paiementFacture.mntTimbre = this.commissions.mntTimbre,
  //         this.paiementFacture.libelleOper =
  //             'PAIEMENT FACTURE' +
  //             '_' +
  //             this.FacturierSodeci +
  //             '_' +
  //             this.paiementFacture.identifiantFacture +
  //             '_' +
  //             this.paiementFacture.mntOper;
  //         console.log(this.paiementFacture.libelleOper);
  //        this.transactionService.Transaction(this.paiementFacture).subscribe((T24 : Response)=>{
  //        console.log(T24)
  //       this.reponseT24 = T24;
  //       this.ReferenceT24 = this.reponseT24.Nooper;
  //       console.log(this.ReferenceT24);

  //       console.log(this.reponseT24.statut)
  //       if(this.reponseT24.statut === 0){

  //           // 2EME ETAPE ***PAYEMENT SODECI*** //

  //         this.sodeciTransaction.CodeOperateur = this.commissions.codeOperateur;
  //         console.log( this.sodeciTransaction.CodeOperateur);
  //           //DATE PAIEMENT//
  //           var madate = new Date();
  //           var Dates = madate.toLocaleString('fr-FR', { month: 'numeric', day:'numeric', year:'numeric'});
  //           var Datess = Dates.toString();
  //           var Date_finale= Datess.replace(/\//g, '');

  //         this.sodeciTransaction.DateReglement = Date_finale;
  //         console.log( this.sodeciTransaction.DateReglement);
  //         this.sodeciTransaction.MontantReglement = this.editForm.value.montantFacture;
  //         console.log( this.sodeciTransaction.MontantReglement);

  //           //HEURE PAIEMENT//

  //         var heure = new Date();
  //         var sodeci = heure.toLocaleString('fr-FR', { hour: 'numeric', minute:'numeric', second:'numeric', hour12: false });
  //         var heureEnvoi = sodeci.toString();
  //         var Heure_finale = heureEnvoi.replace(/:/g, '');

  //         this.sodeciTransaction.HeureReglement = Heure_finale;
  //         console.log( this.sodeciTransaction.HeureReglement)
  //         this.sodeciTransaction.NumeroRecu = this.ReferenceT24;
  //         console.log( this.sodeciTransaction.NumeroRecu)
  //         this.sodeciTransaction.RefContrat= this.ReferenceContrat;
  //         console.log( this.sodeciTransaction.RefContrat)
  //         this.sodeciTransaction.RefFacture = this.editForm.value.identifiant;
  //         console.log( this.sodeciTransaction.RefFacture)
  //         this.sodeciTransaction.TypeCanal = this.commissions.typeCanal;
  //         console.log(  this.sodeciTransaction.TypeCanal)
  //         this.transactionService.TransactionCie(this.sodeciTransaction).subscribe((retourPaiementCie : TraitementCie)=>{
  //         console.log(retourPaiementCie);
  //         this.ListeretourPaiementCie = retourPaiementCie;

  //       // 2EME ETAPE ***INSERTION DANS LA TABLE PAIEMENT***//

  //       this.envoiis.identifiant = this.editForm.value.identifiant;
  //       this.envoiis.montantFacture = this.editForm.value.montantFacture;
  //       this.envoiis.intituleFacturier = this.FacturierSodeci;
  //       if (this.editForm.value.typePaye === 'Total') {
  //           this.envoiis.montantPaye = this.editForm.value.montantFacture;
  //       } else {
  //          this.envoiis.montantPaye = this.editForm.value.montantPaye;
  //       }
  //          this.envoiis.numCpt = this.editForm.value.numCpt;
  //          this.envoiis.typePaye = this.editForm.value.typePaye;
  //          this.onSubmit(this.envoiis).subscribe((paiement: Facture) => {
  //          //this.identifiantHistorique = paiement;
  //          console.log(paiement)
  //          //console.log(this.identifiantHistorique.identifiant);
  //       });

  //       // 3EME ETAPE ***INSERTION DANS LA TABLE CONSULTATION***//

  //       this.historique.identifiant = this.editForm.value.identifiant;
  //       this.historique.dtExpFacture = this.editForm.value.dateLimiteFact;
  //       this.historique.facturier = this.FacturierSodeci;
  //       this.historique.reference = this.ReferenceT24;
  //       this.historique.dateRegle = this.datePaiement;
  //       this.historique.numCpt = this.editForm.value.numCpt;
  //       this.historique.typeRegle = this.editForm.value.typePaye;
  //       if (this.editForm.value.typePaye === 'Total') {
  //         this.historique.montantDebite =
  //           this.editForm.value.montantFacture;
  //       } else {
  //         this.historique.montantDebite =
  //           this.editForm.value.montantPaye;
  //       }

  //       this.factureService
  //         .AddHistorique(this.historique)
  //         .subscribe((histfacture: Consultation) => {
  //           console.log(histfacture);
  //       });

  //       // this.historique.identifiant = this.editForm.value.identifiant;
  //       // this.historique.dtExpFacture = moment(this.maDate).format('L');
  //       // this.historique.facturier = this.FacturierSodeci;
  //       // this.historique.reference = this.reponseT24.Nooper;
  //       // this.historique.dateRegle = this.datePaiement;
  //       // this.historique.numCpt = this.editForm.value.numCpt;
  //       // this.historique.typeRegle = this.editForm.value.typePaye;
  //       // if (this.editForm.value.typePaye === 'Total') {
  //       //   this.historique.montantDebite =
  //       //     this.editForm.value.montantFacture;
  //       // } else {
  //       //   this.historique.montantDebite =
  //       //     this.editForm.value.montantPaye;
  //       // }

  //       // this.factureService
  //       //   .AddHistorique(this.historique)
  //       //   .subscribe((histfacture: Consultation) => {
  //       //     console.log(histfacture);
  //       // });

  //        });
  //        this.loader = false;
  //       }
  //     });
  //   }

  consul() {
    this.historique.identifiant = this.editForm.value.identifiant;
    this.historique.dtExpFacture = this.editForm.value.dateLimiteFact;
    this.historique.facturier = this.FacturierSodeci;
    this.historique.reference = '0';
    this.historique.dateRegle = this.datePaiement;
    this.historique.numCpt = this.editForm.value.numCpt;
    console.log(this.historique.numCpt);
    this.historique.typeRegle = this.editForm.value.typePaye;
    if (this.editForm.value.typePaye === 'Total') {
      this.historique.montantDebite = this.editForm.value.montantFacture;
    } else {
      this.historique.montantDebite = this.editForm.value.montantPaye;
    }

    // this.factureService
    //   .AddHistorique(this.historique)
    //   .subscribe((histfacture: Consultation) => {
    //     console.log(histfacture);
    // });

    this.sodeciTransaction.CodeOperateur = '22'; //this.commissions.codeOperateur;
    console.log(this.sodeciTransaction.CodeOperateur);
    //DATE PAIEMENT//
    var madate = new Date();
    var Dates = madate.toLocaleString('fr-FR', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
    var Datess = Dates.toString();
    var Date_finale = Datess.replace(/\//g, '');

    this.sodeciTransaction.DateReglement = Date_finale;
    console.log(this.sodeciTransaction.DateReglement);
    this.sodeciTransaction.MontantReglement = this.editForm.value.montantFacture;
    console.log(this.sodeciTransaction.MontantReglement);

    //HEURE PAIEMENT//

    var heure = new Date();
    var sodeci = heure.toLocaleString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    var heureEnvoi = sodeci.toString();
    var Heure_finale = heureEnvoi.replace(/:/g, '');

    this.sodeciTransaction.HeureReglement = Heure_finale;
    console.log(this.sodeciTransaction.HeureReglement);
    this.sodeciTransaction.NumeroRecu = this.ReferenceT24;
    console.log(this.sodeciTransaction.NumeroRecu);
    this.sodeciTransaction.RefContrat = this.ReferenceContrat;
    console.log(this.sodeciTransaction.RefContrat);
    this.sodeciTransaction.RefFacture = this.editForm.value.identifiant;
    console.log(this.sodeciTransaction.RefFacture);
    this.sodeciTransaction.TypeCanal = 55; //this.commissions.typeCanal;
    console.log(this.sodeciTransaction.TypeCanal);
    // this.transactionService.TransactionCie(this.sodeciTransaction).subscribe((retourPaiementCie : TraitementCie)=>{
    // console.log(retourPaiementCie);
    // this.ListeretourPaiementCie = retourPaiementCie;
    console.log('\n  TRANSACTION');
    this.t24transaction.facturier = this.FacturierSodeci;
    this.t24transaction.datOper = this.datePaiement;
    this.t24transaction.codOper = this.commissions.codOper;
    this.t24transaction.identifiantFacture = this.editForm.value.identifiant;
    this.t24transaction.compteCredit = '149828810018';
    this.t24transaction.compteDebit = this.editForm.value.numCpt;
    if (this.editForm.value.typePaye === 'Total') {
      this.t24transaction.mntOper = this.editForm.value.montantFacture;
    } else {
      this.t24transaction.mntOper = this.editForm.value.montantPaye;
    }
    this.t24transaction.mntFacture = this.editForm.value.montantFacture;
    this.t24transaction.mntFrais = this.commissions.mntFrais;
    this.t24transaction.mntFraisMarchand = this.commissions.mntFraisMarchand;
    this.t24transaction.mntMarchand = this.commissions.mntMarchand;
    this.t24transaction.mntTimbre = this.commissions.mntTimbre;
    this.t24transaction.libelleOper =
      'PAIEMENT FACTURE' +
      '_' +
      this.paiementFacture.facturier +
      '_' +
      this.paiementFacture.identifiantFacture +
      '_' +
      this.paiementFacture.mntOper;
    this.t24transaction.compteCom = '1';

    if (this.statutT24 === 0) {
      this.t24transaction.codeTraitement = 0;
      this.t24transaction.statutTraitement = 'succès';
    }

    // });
    this.factureService.AddTransaction(this.t24transaction).subscribe(
      (t24Response: T24Transaction) => {
        console.log(t24Response);
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
}
