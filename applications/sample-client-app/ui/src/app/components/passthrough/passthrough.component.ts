import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from '../../services/message.service';
import {MessageAck} from '../../services/messageack';

@Component({
  selector: 'app-passthrough',
  templateUrl: './passthrough.component.html',
  styleUrls: ['./passthrough.component.css']
})
export class PassthroughComponent implements OnInit {

  messageModel: FormGroup;
  messageAck: MessageAck

  errMessage: string = ""
  processing: boolean = false

  constructor(private messageService: MessageService, fb: FormBuilder) {
    this.messageModel = fb.group({
      payload: ['', [Validators.required, Validators.minLength(2)]],
      delay: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  sendMessage() {
    let message = this.messageModel.value
    if (this.messageModel.valid) {
      this.processing = true
      this.messageService.sendMessage(message).subscribe(ack => {
        this.setResponseMessage(ack)
      }, err => {
        this.setErrorResponse(err.status + ": " + err.error.message)
      })
    }
  }

  setResponseMessage(message: MessageAck) {
    this.errMessage = null
    this.processing = false
    this.messageAck = message
  }

  setErrorResponse(err: string) {
    this.errMessage = err
    this.processing = false
    this.messageAck = null
  }

}
