import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleMessage } from 'app/core/article/article.model';
import { ArticleService } from 'app/core/article/article.service';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-message-body',
  templateUrl: './message-body.component.html',
  styleUrls: ['./message-body.component.scss']
})
export class MessageBodyComponent implements OnInit, OnDestroy  {

  @Input() messages: ArticleMessage[] = [];
  @Input() id: string;

  user$ = this.userService.user$;


  messages$: BehaviorSubject<ArticleMessage[]> = new BehaviorSubject(this.messages);
  form: FormGroup;

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.messages$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.messages = res;
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      text: ['', Validators.required],
    });
  }

 // eslint-disable-next-line @typescript-eslint/member-ordering
 async addCommit() {
  const payload = this.form.value;
  const newArticleMessage = await this.articleService.createArticleMessage(this.id, payload).toPromise();
  this.messages.push(newArticleMessage);
  this.messages$.next([...this.messages]);
  this.form.get('text').setValue('');
  }
}
