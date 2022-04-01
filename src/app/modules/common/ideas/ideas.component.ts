import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsService } from 'app/services/setting.service';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '../../../../@fuse/components/navigation';

@Component({
  selector: 'ideas',
  templateUrl: './ideas.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdeasComponent implements OnInit {

  constructor(
    private fuseNavigationService: FuseNavigationService,
    private settingService: SettingsService
  ) {
  }

  ngOnInit() {
    const navigation = this.fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
    navigation.close();
    this.settingService.selectedModule = 'dreams';
  }

}
