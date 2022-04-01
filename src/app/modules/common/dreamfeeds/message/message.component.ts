import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message;
  showFlag: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  showCreateThread() {
    this.showFlag = true;
  }

  addThread($event) {
    this.message.threads.push($event);
    this.showFlag = false;
  }
}
