import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Inject,
  ViewEncapsulation
} from '@angular/core';

import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { IdeaDetailsComponent } from 'app/modules/common/ideas/idea-details/idea-details.component';
import { NotesService } from 'app/modules/common/ideas/notes.service';
import { Label, Note } from 'app/modules/common/ideas/ideas.types';
import { cloneDeep } from 'lodash-es';
import { CategoryService } from '../../../../core/category/category.service';
import { DreamCategoryService } from '../../../../core/dream_category/dream_category.service';
import { IdeaService } from '../../../../core/idea/idea.service';
import { Idea } from '../../../../core/idea/idea.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  children: string;
  id: string;
  name: string;
}

@Component({
  selector: 'app-mydream',
  templateUrl: './mydream.component.html',
  styleUrls: ['./mydream.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class MydreamComponent implements OnInit, OnDestroy {
  id: string;
  name: string;
  categories = [];
  labels$: Observable<Label[]>;
  notes$: Observable<Note[]>;
  categories$ = this.categoryService.categories$;
  ideas$ = this.ideaService.ideas$;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  filter$: BehaviorSubject<[]> = new BehaviorSubject([]);
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 3;

  private unsubscribeAll: Subject<any> = new Subject<any>();
  animal: string;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fuseMediaWatcherService: FuseMediaWatcherService,
    public dialog: MatDialog,
    private categoryService: CategoryService,
    private ideaService: IdeaService
  ) {
  }

  get filterStatus(): [] {
    return this.filter$.value;
  }

  async ngOnInit() {
    console.log('here wa re');
    await this.categoryService.getCategories({ type: 'Dream' });
    console.log("api call has ended");
    // this.categories$.next(this.categoryService.categories);
    // console.log("res:", this.categoryService.categories);
    this.ideaService.initIdeas();
    this.filter$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.ideaService.setCategoryFilter(res);
      // this.categories = res;

    });

    this.searchQuery$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.ideaService.setQueryFilter(res);
    });

    // Subscribe to media changes
    this.fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

        // Set the drawerMode and drawerOpened if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        } else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }

        // Set the masonry columns
        //
        // This if block structured in a way so that only the
        // biggest matching alias will be used to set the column
        // count.
        if (matchingAliases.includes('xl')) {
          this.masonryColumns = 4;
        } else if (matchingAliases.includes('lg')) {
          this.masonryColumns = 3;
        } else if (matchingAliases.includes('md')) {
          this.masonryColumns = 2;
        } else if (matchingAliases.includes('sm')) {
          this.masonryColumns = 1;
        } else {
          this.masonryColumns = 1;
        }

        // Mark for check
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  addNewIdea(): void {
    console.log("category:", this.categories);
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: {}, categories: this.categoryService.categories }
    });
  }

  openEditLabelsDialog(): void {

  }

  openIdeaDialog(idea: Idea): void {
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: cloneDeep(idea), categories: this.categoryService.categories }
    });
  }

  openShareDialog(idea) {
    const dialogRef = this.dialog.open(DreamShareConfirmDialog, {
      width: '50%',
      data: { idea: cloneDeep(idea), categories: this.categoryService.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  filterByLabel(labelId: string): void {
    // this.filter$.next(labelId);
    // this.ideaService.loadIdeas();
  }

  filterByQuery(query: string): void {
    this.searchQuery$.next(query);
    this.ideaService.loadIdeas();
  }

  resetFilter(): void {
    // this.filter$.next('All');
    // this.ideaService.loadIdeas();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}


@Component({
  selector: 'app-mydreamshareconfirm',
  templateUrl: './mydream.component.shareconfirm.html',
  styleUrls: ['./mydream.component.shareconfirm.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DreamShareConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<DreamShareConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private ideaService: IdeaService,
  ) { }
  isSharing = false;
  form: FormGroup;
  onNoClick(): void {
    this.dialogRef.close();
  }

  async shareDream() {
    let myDream = this.data;
    let ideas = myDream.name;
    // this.data = "category";
    try {
      this.isSharing = true;
      const payload = this.form.value;
      if (this.data) {
        const idea = await this.ideaService.updateIdea("", payload).toPromise();
        this.ideaService.ideaUpdated(idea);
      } else {
        const idea = await this.ideaService.createIdea(payload).toPromise();
        this.ideaService.ideaCreated(idea);
      }
      this.dialogRef.close();
    } catch (e) {
      console.log(e);
      console.log("sharedream:", this.isSharing)
    } finally {
      this.isSharing = false;
    }
  }
}

