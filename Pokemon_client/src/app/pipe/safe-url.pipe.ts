import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url) return '';
    // Kiểm tra nếu URL là ID của YouTube
    if (url.length === 11) {
      url = `https://www.youtube.com/embed/${url}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
