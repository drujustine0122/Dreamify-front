import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import { DreamboardService } from '../../../../core/dreamboard/dreamboard.service';
import { Dreamboard } from '../../../../core/dreamboard/dreamboard.model';

@Component({
  selector: 'app-dreamboard-detail',
  templateUrl: './dreamboard-detail.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DreamboardDetailComponent implements OnInit {

  isSaving = false;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dreamboards: Dreamboard[] },
    private dialogRef: MatDialogRef<DreamboardDetailComponent>,
    private fb: FormBuilder,
    private router: Router,
    private dreamboardService: DreamboardService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  async save() {
    try {
      this.isSaving = true;
      const payload = this.form.value;

      const dreamboard = await this.dreamboardService.createDreamboard(payload).toPromise();
      this.data.dreamboards.unshift(dreamboard);

      const url = this.router.url;
      const lastSegment = url.split('/').pop();
      await this.dreamboardService.addDreamboardIdea(lastSegment,this.data.dreamboards).toPromise();
      const returnData = this.data.dreamboards;
      this.dialogRef.close( returnData );

    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
  }

  private initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
}
