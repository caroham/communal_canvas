import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';
const SERVER_URL = 'http://localhost:8000';

@Injectable()
export class SocketService {

  private socket;

  constructor(private _http: HttpClient) { }

  initSocket(){
    this.socket = io(SERVER_URL);
  }

  send(data){
    this.socket.emit('new_move', data);
  }

  onOtherMove() {
    return new Observable<object>(observer => {
      this.socket.on('other_move', (data) => observer.next(data));
    })
  }

  getPaths() {
    console.log('in socket.service get paths!');
    return this._http.get('/paths');
  }

  saveFirstPaths(paths){
    console.log('in socket.service save first paths!');
    return this._http.post('/paths', paths);
  }

  addPaths(paths) {
    console.log('in socket.service addPaths!, path data: ', paths);
    return this._http.put('/paths', paths);
  }

  deletePaths(){
    return this._http.delete('/delete');
  }
}
