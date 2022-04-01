import { Component, Input, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { FollowService } from 'app/core/follow/follow.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Follow } from 'app/core/follow/follow.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() state: boolean;
  @Input() userId: any;

  user$ = this.userService.user$;

  $isFollowing: Subject<boolean> = new Subject();

  private unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private followService: FollowService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.$isFollowing.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res)=>{
      this.state = res;
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  async follow(): Promise<void> {
    const follow = await this.followService.createFollow({followUserId: this.userId}).toPromise();
    this.id = follow.id;
    console.log('follow: ', follow);
    this.changeState(true);
    this.changeDetectorRef.detectChanges();
  }

  async unFollow(): Promise<void> {
    const follow = await this.followService.removeFollow({followUserId: this.id}).toPromise();
    console.log('unfollow: ', follow);
    this.changeState(false);
    this.changeDetectorRef.detectChanges();
  }

  changeState(isFollow: boolean) {
    this.$isFollowing.next(isFollow);
  }

}
