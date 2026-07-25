import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * Mirrors the original inline script behaviour where a freshly-shown
 * `.view-section` starts at `opacity-0` and is faded in ~20ms later:
 *
 *   target.classList.remove('hidden');
 *   setTimeout(() => target.classList.remove('opacity-0'), 20);
 */
@Directive({
  selector: '[appFadeInView]',
  standalone: true,
})
export class FadeInViewDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 300ms ease');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
    }, 20);
  }
}
