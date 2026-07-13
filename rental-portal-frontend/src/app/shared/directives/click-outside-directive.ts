import { Directive, ElementRef, Output, EventEmitter, Input, inject, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {

  private elementRef = inject(ElementRef);

  @Input() clickOutsideExclude: string = '';
  @Output() clickOutside = new EventEmitter<void>();

  private documentClickListener: any;

  ngOnInit(): void {
    this.documentClickListener = (event: MouseEvent) => {
      if (!event.target) return;
      if (this.clickOutsideExclude && (event.target as HTMLElement).closest(this.clickOutsideExclude)) {
        return;
      }

      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.clickOutside.emit();
      }
    };
    document.addEventListener('click', this.documentClickListener, true);
  }

  ngOnDestroy(): void {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener, true);
    }
  }
}
