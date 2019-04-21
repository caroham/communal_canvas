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

  colors = ["blue", "pink", "black", "yellow", "#ab0cfe", "orange", "#fe3a0c", "#00ff00"];
  strokeTypes = ["default", "circle"];

  dbEmpty = false;
  pastStrokes;
  testArr = [];

  public ctx: CanvasRenderingContext2D;
  flag = false;
  prevX = 0;
  currX = 0;
  prevY = 0;
  currY = 0;
  dot_flag = false;

  canvasEl: HTMLCanvasElement;
  viewportOffset;
  showOverlay = true;

  sColor = "blue";
  sWeight = 20;
  sType = "default";

  w=0;
  h=0;

////////// mouse move event listeners

  listener: Function;

  @HostListener('mousemove', ['$event'])
  onmousemove(event: MouseEvent){
    if(this.showOverlay){return;}
    // console.log("in mousemove", event, event.type);
    this.findxy('move', event);
  }

  @HostListener('mouseup', ['$event'])
  onmouseup(event: MouseEvent){
    if(this.showOverlay){return;}
    this.findxy('up', event);
  }

  @HostListener('mousedown', ['$event'])
  onmousedown(event: MouseEvent){
    if(this.showOverlay){return;}
    this.findxy('down', event);
  }

  @HostListener('mouseout', ['$event'])
  onmouseout(event: MouseEvent){
    if(this.showOverlay){return;}
    this.findxy('out', event);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.showOverlay){return;}
    // console.log("in keyevent: ", event.code);
    if(event.code == "Minus") {
      if(this.sWeight > 0) {
        this.sWeight -=4;
      }
    }
    if(event.code == "Equal") {
      if(this.sWeight <= 40) {
        this.sWeight +=4;
      }
    }
    if(event.code == "KeyW") {
      this.randWeight();
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
    this.randWeight();

    let observable = this.socket.getPaths();
    observable.subscribe(data => {
      if(data['message'] === "Success"){
        this.pastStrokes = data;
        if(this.pastStrokes['data'] === null){
          this.dbEmpty = true;
        } else {
          let strokesArr = this.pastStrokes['data']['paths'];
          for(let i=0; i<strokesArr.length; i++){
            this.draw(strokesArr[i]['prevX'], strokesArr[i]['prevY'], strokesArr[i]['currX'], strokesArr[i]['currY'], strokesArr[i]['color'], strokesArr[i]['weight']);
          }

        } 
      } else {
        console.log("didn't work! message: ", data['error']['message']);
      }
    });

  }

///////////

  initSocketConnect(){
    this.socket.initSocket();
    console.log('in init socket connect');

    this.socket.onOtherMove().subscribe((data)=> {
      this.draw(data['data']['prevX'], data['data']['prevY'], data['data']['currX'], data['data']['currY'], data['data']['color'], data['data']['weight'])
    })

  }

  draw(pX, pY, cX, cY, sCol, sWei) {
    this.ctx.beginPath();
    this.ctx.moveTo(pX, pY);
    this.ctx.lineTo(cX, cY);
    this.ctx.strokeStyle = sCol;
    this.ctx.lineWidth = sWei;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  findxy(res, e) {
    console.log("res: ", res, ", e: ", e);
    if(res == 'down') {
      this.flag = false;
      this.randColor()
      this.randStrokeType();
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
        this.ctx.fillRect(this.currX, this.currY, (this.sWeight/2), (this.sWeight/2));
        this.ctx.closePath();
        this.dot_flag = false;
      }
    }

    if(res == 'move') {
      if (this.flag) {
        this.viewportOffset = this.canvasEl.getBoundingClientRect();

        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvasEl.offsetLeft - this.viewportOffset.left;
        this.currY = e.clientY - this.canvasEl.offsetTop - this.viewportOffset.top;

        this.draw(this.prevX, this.prevY, this.currX, this.currY, this.sColor, this.sWeight);

        if(this.testArr.length>100){
          if(this.dbEmpty===true){
            console.log("in if, database is empty");
            this.postPaths();
          }
          this.updatePaths();
          this.testArr = [];
        }

        let dict = {
          prevX: this.prevX,
          prevY: this.prevY,
          currX: this.currX,
          currY: this.currY,
          color: this.sColor,
          weight: this.sWeight
        }

        this.testArr.push(dict);

        this.socket.send(dict);
      }
    }
  }

  randWeight() {
    let randInt = (Math.floor(Math.random()*40))+1;
    this.sWeight = randInt;
  }


  randColor() {
    let rand = Math.floor(Math.random()*this.colors.length);
    this.sColor = this.colors[rand];
  }

  randStrokeType() {
    let rand = Math.floor(Math.random()*this.strokeTypes.length);
    this.sType = this.strokeTypes[rand];
  }

  updatePaths(){
    let observable = this.socket.addPaths(this.testArr);
    observable.subscribe(data =>{
      if(data['message'] === "Success"){
        console.log("successfully updated paths");
      } else {
        console.log("didn't work! message: ", data['error']['message']);
      }
    })
  }

  postPaths(){
    let observable = this.socket.saveFirstPaths(this.testArr);
    observable.subscribe(data =>{
      if(data['message'] === "Success"){
        console.log("successfully posted paths");
      } else {
        console.log("didn't work! message: ", data['error']['message']);
      }
    })
  }

  closeOverlay() {
    this.showOverlay = false;
  }

}
