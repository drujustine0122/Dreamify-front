import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { UploadInput, UploadOutput } from 'ngx-uploader';

import { UploadService } from '../../../core/upload/upload.service';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.model';

@Component({
  selector: 'app-avatar-uploader',
  templateUrl: './avatar-uploader.component.html',
  styleUrls: ['./avatar-uploader.component.scss']
})
export class AvatarUploaderComponent implements OnInit {

  @Input() user: User;
  @Input() mine: boolean;
  @Input() size = 32;

  uploadInput: EventEmitter<UploadInput>;
  options = { concurrency: 1, allowedContentTypes: ['image/jpeg', 'image/png'] };

  constructor(
    private uploadService: UploadService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  async onUploadOutput(output: UploadOutput): Promise<void> {
    if (output.type === 'addedToQueue') {
      const file: any = output.file;
      const data = { url: '', loading: true, failed: false };
      try {
        data.url = await this.uploadService.upload(file.nativeFile).toPromise();
        await this.userService.update({ ...this.user, avatar: data.url }).toPromise();
        data.loading = false;
      } catch (e) {
        data.failed = true;
      } finally {
        data.loading = false;
      }
    }
  }

}
