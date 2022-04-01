import { Component, Input, OnInit } from '@angular/core';
import { DreamFeed } from 'app/core/deamfeed/dreamfeed.model';

@Component({
  selector: 'app-inspiration',
  templateUrl: './inspiration.component.html',
  styleUrls: ['./inspiration.component.scss']
})
export class InspirationComponent implements OnInit {

  @Input() inspiration: DreamFeed;

  constructor() { }

  ngOnInit(): void {
  }

}
