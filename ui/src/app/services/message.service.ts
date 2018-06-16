import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';

import {Message} from "./message"
import { MessageAck } from './messageack';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) { }

  sendMessage(message: Message): Observable<MessageAck> {
    let bodyString = JSON.stringify(message)

    let headers = new HttpHeaders({"Content-type": "application/json"})
    return this.http.post<MessageAck>("/passthrough/messages", bodyString, {headers: headers})
  }
}
