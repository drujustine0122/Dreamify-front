import { Component, ViewEncapsulation } from '@angular/core';

import { UserService } from '../../../core/user/user.service';

@Component({
  selector: 'complete-profile',
  templateUrl: './complete-profile.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CompleteProfileComponent {

  user$ = this.userService.user$;

  constructor(
    private userService: UserService,
  ) {
  }

}
