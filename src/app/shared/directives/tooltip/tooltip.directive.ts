import { ComponentFactoryResolver, ComponentRef, Directive, HostListener, Input, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input("appTooltip") tooltipText!: string;
  @Input() tooltipDisable = false;

  private tooltipComponent!: ComponentRef<TooltipComponent>;

  constructor(private resolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) { }

  @HostListener('mouseover') onMouseOver() {
    // Display tooltip only if its not display and can be show
    if (!this.tooltipDisable) {
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

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.tooltipDisable) {
      // Hide tooltip by destroying the component
      if (this.tooltipComponent) {
        this.tooltipComponent.destroy();
      }
    }
  }

}
