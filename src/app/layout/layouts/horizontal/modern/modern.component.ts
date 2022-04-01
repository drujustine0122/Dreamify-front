import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
  FuseNavigationItem,
  FuseNavigationService,
  FuseVerticalNavigationComponent
} from '@fuse/components/navigation';
import { InitialData } from 'app/app.types';
import { UserRole } from '../../../../core/user/user.model';

@Component({
  selector: 'modern-layout',
  templateUrl: './modern.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ModernLayoutComponent implements OnInit, OnDestroy {
  data: InitialData;
  isScreenSmall: boolean;
  navigation: FuseNavigationItem[] = [];
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fuseMediaWatcherService: FuseMediaWatcherService,
    private fuseNavigationService: FuseNavigationService
  ) {
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  ngOnInit(): void {
    // Subscribe to the resolved route data
    this.route.data.subscribe((data: Data) => {
      this.data = data.initialData;
      if (this.data.user.role === UserRole.superAdmin) {
        this.navigation = this.data.navigation.superAdmin;
      } else if (this.data.user.role === UserRole.admin) {
        this.navigation = this.data.navigation.admin;
      } else if (this.data.user.role === UserRole.merchant) {
        this.navigation = this.data.navigation.merchant;
      } else if (this.data.user.role === UserRole.customer) {
        this.navigation = this.data.navigation.customer;
      }
    });

    // Subscribe to media changes
    this.fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this.fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
