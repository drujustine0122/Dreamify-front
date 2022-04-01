import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArticleMessage } from 'app/core/article/article.model';
import { ArticleService } from 'app/core/article/article.service';
import { DreamFeed } from 'app/core/deamfeed/dreamfeed.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy{

  @Input() article: DreamFeed;

  expandFlag = false;
  messages: ArticleMessage[] = [];
  messages$: BehaviorSubject<ArticleMessage[]> = new BehaviorSubject(this.messages);

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private readonly articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.messages$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.messages = res;
    });
  }

  async showMessages(): Promise<void>{
    this.expandFlag = !this.expandFlag;
    if(this.expandFlag){
      const data = await this.articleService.getArticleMessagesByArticleId(this.article.id).toPromise();
      this.messages$.next(data.data);
      console.log(data.data);
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
