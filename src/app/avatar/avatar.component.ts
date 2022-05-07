import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  _avatarUrl: SafeResourceUrl | undefined;
  uploading = false;

  @Input()
  set avatarUrl(url: string | undefined) {
    if(url) {
      this.downloadImage(url);
    }
  }

  @Output() upload = new EventEmitter<string>();

  constructor(
    private readonly supabase: SupabaseService,
    private readonly dom: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  async downloadImage(path: string) {
    try {
      const {data} = await this.supabase.downloadImage(path);
      this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data!));
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  async uploadAvatar(event: any) {
    try {
      this.uploading = false;
      if (!event.target.files && event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      await this.supabase.uploadAvatar(filePath, file)
      this.upload.emit(filePath);
    } catch (error) {
      alert(error);
    } finally {
      this.uploading = false;
    }
  }

}
