import { Component, Input, OnInit } from '@angular/core';
import { DreamFeed } from 'app/core/deamfeed/dreamfeed.model';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

  @Input() story: DreamFeed;

  constructor() { }

  ngOnInit(): void {
  }

}
