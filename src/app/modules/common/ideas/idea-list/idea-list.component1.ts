import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { IdeaDetailsComponent } from 'app/modules/common/ideas/idea-details/idea-details.component';
import { NotesService } from 'app/modules/common/ideas/notes.service';
import { Label, Note } from 'app/modules/common/ideas/ideas.types';
import { cloneDeep } from 'lodash-es';
import { CategoryService } from '../../../../core/category/category.service';
import { IdeaService } from '../../../../core/idea/idea.service';
import { Idea } from '../../../../core/idea/idea.model';
import { MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  selector: 'idea-list',
  templateUrl: './idea-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdeaListComponent implements OnInit, OnDestroy {

  labels$: Observable<Label[]>;
  notes$: Observable<Note[]>;
  categories$ = this.categoryService.categories$;
  ideas$ = this.ideaService.ideas$;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  filter$: BehaviorSubject<string> = new BehaviorSubject('All');
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 3;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fuseMediaWatcherService: FuseMediaWatcherService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private ideaService: IdeaService
  ) {
  }

  get filterStatus(): string {
    return this.filter$.value;
  }

  ngOnInit(): void {
    this.categoryService.getCategories({ type: 'Dream' });
    this.ideaService.initIdeas();
    this.filter$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.ideaService.setCategoryFilter(res);
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
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: {} }
    });
  }

  openEditLabelsDialog(): void {
  }

  openIdeaDialog(idea: Idea): void {
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: cloneDeep(idea) }
    });
  }

  filterByLabel(labelId: string): void {
    this.filter$.next(labelId);
    this.ideaService.loadIdeas();
  }

  filterByQuery(query: string): void {
    this.searchQuery$.next(query);
    this.ideaService.loadIdeas();
  }

  resetFilter(): void {
    this.filter$.next('All');
    this.ideaService.loadIdeas();
  }

  gomydream(): void {
    // console.log("who are you?");
    // this.filter$
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
