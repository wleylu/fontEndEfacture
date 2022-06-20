import { NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, RendererStyleFlags2} from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);
  client : any;

  constructor(config: NgbCarouselConfig,
    private navbar : AppComponent,
    private router : Router,
    public _location: Location) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
  ngOnInit(){
  this.client = localStorage.getItem('nomPrenom');
  this.navbar.ngOnInit();
  

  }

  refresh(): void{
    this.router.navigateByUrl("/home",{skipLocationChange:true}).then(()=>{
    console.log(decodeURI(this._location.path()));
    this.router.navigate([decodeURI(this._location.path())]);
  });
}


ref(){

  this.router.navigate(['home'])
}




  // slideActivate(ngbSlideEvent: NgbSlideEvent) {
  //   console.log(ngbSlideEvent.source);
  //   console.log(ngbSlideEvent.paused);
  //   console.log(NgbSlideEventSource.INDICATOR);
  //   console.log(NgbSlideEventSource.ARROW_LEFT);
  //   console.log(NgbSlideEventSource.ARROW_RIGHT);
  // }

}
