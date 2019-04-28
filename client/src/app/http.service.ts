import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {
  showOverlay = true;
  constructor(private _http: HttpClient){}

  closeOverlay(){
    this.showOverlay = false;
  }
  openOverlay(){
    this.showOverlay = true;
  }
}
