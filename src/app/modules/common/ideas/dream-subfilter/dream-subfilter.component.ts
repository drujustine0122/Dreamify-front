import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-dream-subfilter',
  templateUrl: './dream-subfilter.component.html',
  styleUrls: ['./dream-subfilter.component.scss']
})
export class DreamSubfilterComponent implements OnInit {
  @Input() subfilters: string;
  constructor() { }

  ngOnInit(): void {

  }
  newMessage() {

    // this.myService.changeMessage(`Hello from ${this.message}`)
  }

}
