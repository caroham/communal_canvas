import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-secret-menu',
  templateUrl: './secret-menu.component.html',
  styleUrls: ['./secret-menu.component.css']
})
export class SecretMenuComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2) { 
    this.renderer.addClass(document.body, 'lock-screen');
  }

  showOverlay = true;

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'lock-screen');
  }

  closeOverlay() {
    this.showOverlay = false;
  }

}
