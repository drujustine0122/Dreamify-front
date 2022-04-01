import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
  adminNavigation,
  customerNavigation,
  horizontalNavigation,
  merchantNavigation,
  superAdminNavigation
} from 'app/mock-api/common/navigation/data';

@Injectable({
  providedIn: 'root'
})
export class NavigationMockApi {

  private readonly horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;
  private readonly superAdminNavigation: FuseNavigationItem[] = superAdminNavigation;
  private readonly adminNavigation: FuseNavigationItem[] = adminNavigation;
  private readonly merchantNavigation: FuseNavigationItem[] = merchantNavigation;
  private readonly customerNavigation: FuseNavigationItem[] = customerNavigation;

  constructor(
    private fuseMockApiService: FuseMockApiService
  ) {
    this.registerHandlers();
  }

  registerHandlers(): void {
    this.fuseMockApiService
      .onGet('api/common/navigation')
      .reply(() => ([
        200,
        {
          horizontal: cloneDeep(this.horizontalNavigation),
          superAdmin: cloneDeep(this.superAdminNavigation),
          admin: cloneDeep(this.adminNavigation),
          merchant: cloneDeep(this.merchantNavigation),
          customer: cloneDeep(this.customerNavigation),
        }
      ]));
  }
}
