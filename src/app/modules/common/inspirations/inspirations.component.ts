import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '../../../../@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '../../../../@fuse/components/navigation';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InspirationService } from '../../../core/inspiration/inspiration.service';
import { Inspiration } from '../../../core/inspiration/inspiration.model';
import { InspirationDetailComponent } from './inspiration-detail/inspiration-detail.component';
import { CategoryService } from '../../../core/category/category.service';

@Component({
  selector: 'app-inspirations',
  templateUrl: './inspirations.component.html',
  styleUrls: ['./inspirations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspirationsComponent implements OnInit, OnDestroy {

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  masonryColumns: number = 3;

  isLoading = false;
  inspirations: Inspiration[] = [];
  categories$ = this.categoryService.categories$;
  filter$: BehaviorSubject<string> = new BehaviorSubject('notes');
  inspirations$: BehaviorSubject<Inspiration[]> = new BehaviorSubject<Inspiration[]>(this.inspirations);

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private inspirationService: InspirationService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private fuseMediaWatcherService: FuseMediaWatcherService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private fuseNavigationService: FuseNavigationService
  ) { }

  ngOnInit(): void {
    const navigation = this.fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
    navigation.close();
    this.categoryService.getCategories({type: 'Dream'});
    this.inspirations$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.inspirations = res;
    });

    this.loadInspirations();

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

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  next(inspirations: Inspiration[]) {
    this.inspirations = inspirations;
    this.inspirations$.next(this.inspirations);
  }

  async loadInspirationsByDreamboard() {
    try {
      this.isLoading = true;
      const data = await this.inspirationService.getInspirationsByDreamboard(this.route.snapshot.params.id).toPromise();
      this.inspirations = data.data;
      this.next(this.inspirations);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  async loadInspirations() {
    try {
      this.isLoading = true;
      const data = await this.inspirationService.getInspirations(this.route.snapshot.params.id).toPromise();
      this.inspirations = data.data;
      this.next(this.inspirations);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  addNewInspiration(): void {
    const dialogRef = this.dialog.open(InspirationDetailComponent, {
      autoFocus: false,
      data: { inspirations: this.inspirations }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        this.inspirations = [...res];
        this.inspirations$.next([...this.inspirations]);
      }
    });
  }

  get filterStatus(): string {
    return this.filter$.value;
  }

  resetFilter(): void {
    this.filter$.next('notes');
  }
}
