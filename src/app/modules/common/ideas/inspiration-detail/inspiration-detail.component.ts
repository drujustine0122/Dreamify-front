import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import { UploadService } from '../../../../core/upload/upload.service';
import { InspirationService } from '../../../../core/inspiration/inspiration.service';
import { CategoryService } from '../../../../core/category/category.service';
import { Category } from '../../../../core/category/category.model';
import { Inspiration, InspirationType } from '../../../../core/inspiration/inspiration.model';

@Component({
  selector: 'app-inspiration-detail',
  templateUrl: './inspiration-detail.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class InspirationDetailComponent implements OnInit {
  categories$ = this.categoryService.categories$;
  selectedCategory: Category;

  isImageUploading = false;
  isSaving = false;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { inspirations: Inspiration[] },
    private dialogRef: MatDialogRef<InspirationDetailComponent>,
    private fb: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private inspirationService: InspirationService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.categoryService.getCategories({type: 'Dream'});
    this.initForm();
  }

  async save() {
    try {
      this.isSaving = true;
      const payload = this.form.value;
      payload.category = this.selectedCategory.id;

      const inspiration = await this.inspirationService.createInspiration(payload).toPromise();
      this.data.inspirations.unshift(inspiration);

      const url = this.router.url;
      const lastSegment = url.split('/').pop();
      await this.inspirationService.addInspirationDreamboard(lastSegment,this.data.inspirations).toPromise();
      const returnData = this.data.inspirations;
      this.dialogRef.close( returnData );

    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
  }

  async uploadImage(fileList: FileList): Promise<void> {
    if (!fileList.length) {
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png'];
    const file = fileList[0];
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    let url = null;
    try {
      this.isImageUploading = true;
      url = await this.uploadService.upload(file).toPromise();
      this.form.get('url').setValue(url);
    } catch (e) {
      console.log(e);
    } finally {
      this.isImageUploading = false;
    }
  }

  isCategorySelected(category: Category): boolean {
    let isSelected: boolean = false;
    if( this.selectedCategory === category )
    {
      isSelected = true;
    }

    return isSelected;
  }

  toggleCategoryOnInspiration(category: Category): void {
    if( this.selectedCategory === category ) {
      this.selectedCategory = null;
    }else {
      this.selectedCategory = category;
    }
  }

  private initForm() {
    this.form = this.fb.group({
      url: ['', Validators.required],
      category: ['', Validators.required],
      type: [InspirationType.photo],
    });
  }
}
