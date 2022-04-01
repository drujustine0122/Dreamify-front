import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '../../../../../@fuse/services/media-watcher';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DreamboardService } from '../../../../core/dreamboard/dreamboard.service';
import { Dreamboard } from '../../../../core/dreamboard/dreamboard.model';
import { DreamboardDetailComponent } from '../dreamboard-detail/dreamboard-detail.component';
import { IdeaService } from 'app/core/idea/idea.service';
import { Idea } from 'app/core/idea/idea.model';
import { FollowService } from 'app/core/follow/follow.service';
import { SuccessFollow } from 'app/core/follow/follow.model';


@Component({
  selector: 'app-dreamboard-list',
  templateUrl: './dreamboard-list.component.html',
  styleUrls: ['./dreamboard-list.component.scss']
})
export class DreamboardListComponent implements OnInit, OnDestroy {

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  masonryColumns: number = 3;

  isLoading = false;
  dreamboards: Dreamboard[] = [];
  isroot = false;
  idea: Idea = null;
  dreamboards$: BehaviorSubject<Dreamboard[]> = new BehaviorSubject<Dreamboard[]>(this.dreamboards);
  idea$: BehaviorSubject<Idea> = new BehaviorSubject<Idea>(this.idea);

  successFollow: any = null;
  successFollow$: BehaviorSubject<any> = new BehaviorSubject<any>(this.successFollow);

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private dreamboardService: DreamboardService,
    private ideaService: IdeaService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private fuseMediaWatcherService: FuseMediaWatcherService,
    private dialog: MatDialog,
    private followService: FollowService
  ) { }

  ngOnInit(): void {
    this.dreamboards$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.dreamboards = res;
    });

    this.idea$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.idea = res;
      console.log("all idea: ", this.idea)
    });

    this.successFollow$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.successFollow = res;
    });

    this.loadDreamboards();

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

        if (matchingAliases.includes('xl')) {
          this.masonryColumns = 3;
        } else if (matchingAliases.includes('lg')) {
          this.masonryColumns = 3;
        } else if (matchingAliases.includes('md')) {
          this.masonryColumns = 2;
        } else if (matchingAliases.includes('sm')) {
          this.masonryColumns = 1;
        } else {
          this.masonryColumns = 1;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  next(dreamboards: Dreamboard[], idea: Idea, successFollow: SuccessFollow) {
    this.dreamboards = dreamboards;
    this.dreamboards$.next(this.dreamboards);
    this.idea = idea;
    this.idea$.next(this.idea);
    this.successFollow$.next(successFollow);
  }


  async loadDreamboards() {
    try {
      this.isLoading = true;
      const data = await this.dreamboardService.getDreamboardsByIdea(this.route.snapshot.params.id).toPromise();
      const idea = await this.ideaService.getIdeaById(this.route.snapshot.params.id).toPromise();
      this.dreamboards = data.data;
      this.idea = idea;
      console.log("Please IDEA:", this.idea)
      const successFollow = await this.followService.isFolloingById({ followUserId: idea.createdBy.id }).toPromise();

      this.next(this.dreamboards, this.idea, successFollow);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  //get the categories Array of idea
  getProductName() {
    let categoryName: string[] = [];
    console.log("category Names:", categoryName)
    console.log("parameter:", this.idea);
    let prodArry = [];
    let p = 0;
    let products = this.idea.categories;
    products.map((res) => {
      prodArry.push(res.name)
    })
    // let categories = ["Guides", "Supporters", "Articles", "Information", "Travel", "News", "Activities", "Experiences", "Accommodation", "Community", "Transportation", "Stories", "Discussions", "Products", "Advice", "Help"];
    for (let i = 0; i < products.length; i++) {
      p = p + 1;
    }
    return prodArry;
  }

  backMenu() {
    this.isroot = true;
    this.router.navigate(['/ideas'], { relativeTo: this.route });//redirect to ideas
  }

  addNewDreamboard(): void {
    const dialogRef = this.dialog.open(DreamboardDetailComponent, {
      autoFocus: false,
      data: { dreamboards: this.dreamboards }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dreamboards = [...res];
        this.dreamboards$.next([...this.dreamboards]);
      }
    });
  }

}
