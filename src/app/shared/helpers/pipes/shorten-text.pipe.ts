import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(text: string, letters: number, readMore: string): unknown {
    if(text.length > letters) {
      return text.substring(0, letters) + readMore;
    }

    return text;
  }
}
