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
    this.renderer.addClass(document.body, 'lock-scroll');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log("in ngOnDestroy");
    this.renderer.removeClass(document.body, 'lock-scroll');
  }

  closeOverlay() {
    this._httpService.closeOverlay();
    this.showOverlay = this._httpService.showOverlay;
    this.renderer.removeClass(document.body, 'lock-scroll');
  }

}
