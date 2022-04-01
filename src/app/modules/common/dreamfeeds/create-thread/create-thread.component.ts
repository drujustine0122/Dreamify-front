import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleMessage, ArticleThread } from 'app/core/article/article.model';
import { ArticleService } from 'app/core/article/article.service';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.scss']
})
export class CreateThreadComponent implements OnInit {

  @Input() message: ArticleMessage;
  @Output() thread = new EventEmitter<ArticleThread>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    console.log(this.message);
  }

  private initForm() {
    this.form = this.fb.group({
      text: ['', Validators.required],
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async addThread() {
    const payload = this.form.value;
    console.log(payload);
    const newThread = await this.articleService.createArticleThread(this.message.id, payload).toPromise();
    this.form.get('text').setValue('');
    this.thread.emit( newThread );
  }


}
