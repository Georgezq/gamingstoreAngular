import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDefaultProfileImage]',
  standalone: true
})
export class DefaultProfileImageDirective {

  constructor(private elementImg: ElementRef) { }

  @HostListener('error')

  onError():void{
    this.elementImg.nativeElement.src = 'https://gaming-cdn.com/themes/igv2/images/avatar2.svg'
  }
}
