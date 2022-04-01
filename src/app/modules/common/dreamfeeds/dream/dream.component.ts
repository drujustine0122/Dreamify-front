import { Component, Input, OnInit } from '@angular/core';
import { DreamFeed } from 'app/core/deamfeed/dreamfeed.model';

@Component({
  selector: 'app-dream',
  templateUrl: './dream.component.html',
  styleUrls: ['./dream.component.scss']
})
export class DreamComponent implements OnInit {

  @Input() dream: DreamFeed;

  constructor() { }

  ngOnInit(): void {
  }

}
