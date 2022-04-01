import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { DreamFeed } from 'app/core/deamfeed/dreamfeed.model';
import { DreamFeedService } from 'app/core/deamfeed/dreamfeed.service';
import { BehaviorSubject, Subject} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '../../../../@fuse/components/navigation';
import { UserService } from 'app/core/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from 'app/core/upload/upload.service';
import { CategoryService } from 'app/core/category/category.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-dreamfeeds',
  templateUrl: './dreamfeeds.component.html',
  styleUrls: ['./dreamfeeds.component.scss']
})
export class DreamfeedsComponent implements OnInit, OnDestroy {

  @ViewChild('drawercontainer', {static: true, read: MatDrawerContainer}) drawerContainer: MatDrawerContainer;

  dreamfeeds: DreamFeed[] = [];
  dreamfeeds$: BehaviorSubject<DreamFeed[]> = new BehaviorSubject(null);

  user$ = this.userService.user$;

  isImageUploading = false;
  isSaving = false;
  form: FormGroup;


  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;

  filter$: BehaviorSubject<string> = new BehaviorSubject('All');

  categories$ = this.categoryService.categories$;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fuseNavigationService: FuseNavigationService,
    private dreamFeedService: DreamFeedService,
    private userService: UserService,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private fuseMediaWatcherService: FuseMediaWatcherService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  get filterStatus(): string {
    return this.filter$.value;
  }

  ngOnInit(): void {
    const navigation = this.fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
    navigation.close();
    // console.log(this.drawerContainer);
    this.drawerContainer.updateContentMargins();
    this.changeDetectorRef.markForCheck();
    this.dreamFeedService.getDreamFeeds().pipe(
      map((res) => {
        console.log(res);
        // if(res.count === 0){
        //   this.dreamfeeds = [];
        // }else{
          this.dreamfeeds = [...res.data];
          console.log(this.dreamfeeds);
        // }
        this.dreamfeeds$.next(this.dreamfeeds);
      })
    ).subscribe();

    this.categoryService.getCategories({type: 'Dream'});
    this.initForm();

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

        // Mark for check
        this.changeDetectorRef.markForCheck();
      });

      setTimeout(() => {
        this.drawerContainer.updateContentMargins();
      }, 600);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  async save() {
    try {
      this.isSaving = true;
      const payload = this.form.value;
      const dreamfeed = await this.dreamFeedService.createDreamFeed(payload).toPromise();
      this.dreamfeeds.unshift(dreamfeed);
      this.dreamfeeds$.next([...this.dreamfeeds]);
    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
      this.initForm();
    }
  }

  async uploadImage(fileList: FileList): Promise<void> {
    if (!fileList.length) {
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png'];
    const file = fileList[0];
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    let url = null;
    try {
      this.isImageUploading = true;
      url = await this.uploadService.upload(file).toPromise();
      this.form.get('cover').setValue(url);
    } catch (e) {
      console.log(e);
    } finally {
      this.isImageUploading = false;
    }
  }

  resetFilter(): void {
    this.filter$.next('All');
    // this.dreamfeeds.unshift(dreamfeed);
    // this.dreamfeeds$.next([...this.dreamfeeds]);
  }

  private initForm() {
    this.form = this.fb.group({
      description: ['', Validators.required],
      cover: ['', Validators.required],
    });
  }

}
