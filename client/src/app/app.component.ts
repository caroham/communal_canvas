import { Component, OnInit, ViewChild, HostListener, ElementRef, Host } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

////////// set up vars

  @ViewChild('canvas') canvas: ElementRef;

  colors = ["blue", "pink", "black", "yellow", "purple", "orange"]

  public ctx: CanvasRenderingContext2D;
  flag = false;
  prevX = 0;
  currX = 0;
  prevY = 0;
  currY = 0;
  dot_flag = false;

  canvasEl: HTMLCanvasElement;
  viewportOffset;

  sColor = "blue";
  sWeight = 20;

  w=0;
  h=0;

////////// mouse move event listeners

  listener: Function;

  @HostListener('mousemove', ['$event'])
  onmousemove(event: MouseEvent){
    console.log("in mousemove", event, event.type);
    this.findxy('move', event);
  }

  @HostListener('mouseup', ['$event'])
  onmouseup(event: MouseEvent){
    // console.log("in mouseup", event, event.type);
    this.findxy('up', event);
  }

  @HostListener('mousedown', ['$event'])
  onmousedown(event: MouseEvent){
    // console.log("in mousedown", event, event.type);
    this.findxy('down', event);
  }

  @HostListener('mouseout', ['$event'])
  onmouseout(event: MouseEvent){
    // console.log("in mouseout", event, event.type);
    this.findxy('out', event);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent){
    console.log("in keyevent: ", event);
    if(event.code == "ArrowDown") {
      if(this.sWeight > 0) {
        this.sWeight --;
      }
    }
    if(event.code == "ArrowUp") {
      if(this.sWeight <= 40) {
        this.sWeight ++;
      }
    }
  }

///////////

  constructor(private socket: SocketService){
    this.initSocketConnect();
  }

  ngOnInit(){
    this.canvasEl = (<HTMLCanvasElement>this.canvas.nativeElement);
    this.ctx = this.canvasEl.getContext('2d');
    this.w = this.canvasEl.width;
    this.h = this.canvasEl.height;

    this.randColor();
    console.log("canvas width: ", this.canvasEl.width, this.ctx);
  }

///////////

  initSocketConnect(){
    this.socket.initSocket();
    console.log('in init socket connect');

    this.socket.onOtherMove().subscribe((data)=> {
      console.log('======== in on other move', data)
      this.draw(data['data']['prevX'], data['data']['prevY'], data['data']['currX'], data['data']['currY'], data['data']['color'], data['data']['weight'])
    })

  }

  draw(pX, pY, cX, cY, sCol, sWei) {
    console.log('in draw func', pX, pY, cX, cY, sCol, sWei)
    this.ctx.beginPath();
    this.ctx.moveTo(pX, pY);
    this.ctx.lineTo(cX, cY);
    this.ctx.strokeStyle = sCol;
    this.ctx.lineWidth = sWei;
    this.ctx.stroke();
    this.ctx.closePath();
  }


  // draw() {
  //   console.log('in draw func')
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(this.prevX, this.prevY);
  //   this.ctx.lineTo(this.currX, this.currY);
  //   this.ctx.strokeStyle = this.sColor;
  //   this.ctx.lineWidth = this.sWeight;
  //   this.ctx.stroke();
  //   this.ctx.closePath();
  // }

  // erase() {
  //   let yes = confirm("Want to clear");
  //   if (yes) {
  //       this.ctx.clearRect(0, 0, this.w, this.h);
  //       this.canvasEl.style.display = "none";
  //   }
  // }

  // save() {

  // }

  findxy(res, e) {
    if(res == 'down') {
      this.flag = false;
      this.randColor()
    }

    if (res == 'up' || res == 'out'){
      this.viewportOffset = this.canvasEl.getBoundingClientRect();
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - this.canvasEl.offsetLeft - this.viewportOffset.left;
      this.currY = e.clientY - this.canvasEl.offsetTop - this.viewportOffset.top;

      this.flag = true;
      this.dot_flag = true;
      if(this.dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.sColor;
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
        this.dot_flag = false;
      }
    }

    if(res == 'move') {
      if (this.flag) {
        this.viewportOffset = this.canvasEl.getBoundingClientRect();
        console.log('viewport offset: ', this.viewportOffset);
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvasEl.offsetLeft - this.viewportOffset.left;
        this.currY = e.clientY - this.canvasEl.offsetTop - this.viewportOffset.top;

        console.log('curr & prev after reset: ', this.currX, this.currY, this.prevX, this.prevY);
        this.draw(this.prevX, this.prevY, this.currX, this.currY, this.sColor, this.sWeight);
        this.socket.send({
          prevX: this.prevX,
          prevY: this.prevY,
          currX: this.currX,
          currY: this.currY,
          color: this.sColor,
          weight: this.sWeight
        });
      }
    }
  }

  randColor() {
    let rand = Math.floor(Math.random()*this.colors.length);
    this.sColor = this.colors[rand];
  }


}
