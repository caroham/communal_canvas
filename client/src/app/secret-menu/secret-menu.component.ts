import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-secret-menu',
  templateUrl: './secret-menu.component.html',
  styleUrls: ['./secret-menu.component.css']
})
export class SecretMenuComponent implements OnInit, OnDestroy {
  showOverlay:boolean = this._httpService.showOverlay;
  constructor(
    private renderer: Renderer2,
    private _httpService: HttpService) { 
    this.renderer.addClass(document.body, 'lock-screen');
  }

  ngOnInit() {
    this.showOverlay = this._httpService.showOverlay;
    console.log("showOverlay in secret menu: ", this.showOverlay);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'lock-screen');
  }

  closeOverlay() {
    this._httpService.closeOverlay();
  }

}
