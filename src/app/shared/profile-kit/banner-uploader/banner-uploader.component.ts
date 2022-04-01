import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { UploadInput, UploadOutput } from 'ngx-uploader';

import { User } from '../../../core/user/user.model';
import { UploadService } from '../../../core/upload/upload.service';
import { CustomerService } from '../../../core/customer/customer.service';

@Component({
  selector: 'app-banner-uploader',
  templateUrl: './banner-uploader.component.html',
  styleUrls: ['./banner-uploader.component.scss']
})
export class BannerUploaderComponent implements OnInit {

  @Input() user: User;
  @Input() mine: boolean;

  uploadInput: EventEmitter<UploadInput>;
  options = { concurrency: 1, allowedContentTypes: ['image/jpeg', 'image/png'] };

  constructor(
    private uploadService: UploadService,
    private customerService: CustomerService
  ) {
  }

  ngOnInit(): void {
  }

  async onUploadOutput(output: UploadOutput): Promise<void> {
    if (output.type === 'addedToQueue') {
      const file: any = output.file;
      const data = { url: '', loading: true, failed: false };
      try {
        data.url = await this.uploadService.upload(file.nativeFile).toPromise();
        await this.customerService.updateProfilePreference({ banner: data.url }).toPromise();
        data.loading = false;
      } catch (e) {
        data.failed = true;
      } finally {
        data.loading = false;
      }
    }
  }

}
