import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Inspiration } from 'app/core/inspiration/inspiration.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { InspirationService } from 'app/core/inspiration/inspiration.service';
import { takeUntil } from 'rxjs/operators';
import { FollowService } from 'app/core/follow/follow.service';
import { SuccessFollow } from 'app/core/follow/follow.model';

@Component({
  selector: 'app-inspiration-view',
  templateUrl: './inspiration-view.component.html',
  styleUrls: ['./inspiration-view.component.scss']
})
export class InspirationViewComponent implements OnInit, OnDestroy  {

  inspiration: Inspiration = null;
  inspiration$: BehaviorSubject<Inspiration> = new BehaviorSubject<Inspiration>(this.inspiration);

  successFollow: any = null;
  successFollow$: BehaviorSubject<any> = new BehaviorSubject<any>(this.successFollow);

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private inspirationService: InspirationService,
    private followService: FollowService
  ) { }

  ngOnInit(): void {
    this.inspiration$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.inspiration = res;
    });

    this.successFollow$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.successFollow = res;
    });

    this.load();

  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  next(inspiration: Inspiration, successFollow: SuccessFollow) {
    this.inspiration$.next(inspiration);
    this.successFollow$.next(successFollow);
  }

  async load() {
    try {
      const inspiration = await this.inspirationService.getInspirationById(this.route.snapshot.params.id).toPromise();
      const successFollow = await this.followService.isFolloingById({followUserId: inspiration.createdBy.id}).toPromise();

      this.next(inspiration, successFollow);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

}
