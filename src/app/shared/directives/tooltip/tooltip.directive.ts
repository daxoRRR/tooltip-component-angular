import { ComponentFactoryResolver, ComponentRef, Directive, HostListener, Input, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input("appTooltip") tooltipText!: string;
  @Input() tooltipDisable = false;

  private tooltipComponent!: ComponentRef<TooltipComponent>;
  private displayEvent: string | null = null;

  constructor(private resolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) { }

  @HostListener('mouseover', ['$event'])
  @HostListener('focusin', ['$event'])
  onMouseOver(event: UIEvent) {
    // Display tooltip only if its not display and can be show
    if (!this.tooltipDisable && !this.displayEvent) {
      this.displayEvent = event.type;
      // Generate componentFactory classes that allow me to create a TooltipComponent
      const componentFactory = this.resolver.resolveComponentFactory(TooltipComponent);
      // Instantiate tooltipComponent inside into current element
      this.tooltipComponent = this.viewContainerRef.createComponent(componentFactory);
      // Give all parameters to component
      this.tooltipComponent.instance.hostElement = this.viewContainerRef.element.nativeElement;
      if (this.tooltipText) {
        this.tooltipComponent.instance.tooltipText = this.tooltipText;
      }
    }
  }

  @HostListener('mouseleave', ['$event'])
  @HostListener('focusout', ['$event'])
  onMouseLeave(event: UIEvent) {
    if (!this.tooltipDisable && this.isSameEvent(event)) {
      this.displayEvent = null;
      // Hide tooltip by destroying the component
      if (this.tooltipComponent) {
        this.tooltipComponent.destroy();
      }
    }
  }

  /**
   * Return true if the event that displayed the tooltip is the same when remove display
   *
   * @param {UIEvent} event
   * @returns {boolean}
   */
  private isSameEvent(event: UIEvent): boolean {
    if (this.displayEvent === 'focusin' && event.type === 'focusout') {
      return true;
    } else if (this.displayEvent === 'mouseover' && event.type === 'mouseleave') {
      return true;
    } else {
      return false;
    }
  }

}
