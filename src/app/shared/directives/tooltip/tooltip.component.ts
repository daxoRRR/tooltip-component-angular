import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';
import { placementTooltip, positionTooltip } from '../../models/tooltip/tooltip.model';

@Component({
  selector: 'app-tooltip',
  host: {
    '[@fadeInOut]': 'true',
  },
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(450, style({ opacity: 1}))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {

  // Is the parent HTMLElement
  @Input() hostElement!: HTMLElement;

  // text to display in tooltip
  @Input() tooltipText?: string;

  // Get the position and set Right by default
  @Input() placement: keyof typeof placementTooltip = placementTooltip.left;

  @Input() show = () => {
    if (!this.hostElement) {
      throw new Error('hostElement should be defined');
    }
    if (!this.tooltipText) {
      // Display the text in the parent HTMLElement if no text given
      this.tooltipText = this.hostElement.innerText;
    }
    // Need to detectChanges to set the text and to have the offsetWidth/offsetHeight updated
    this.ref.detectChanges();
    this.setPositionTooltip();
  };

  // Set default positionTooltip
  public positionTooltip: positionTooltip = {top: 0, left: 0};
  private initialTooltipSize: {height: number, width: number} | null = null;

  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) { }

  /**
   * Display tooltip on top, right, bottom, left
   * If the initial placement has no much space to display the tooltip, try another placement
   * And if all the placement have no space to display, the tooltip is crop at the initial placement
   */
  @HostListener('window:resize')
  private setPositionTooltip(initialPlacement?: placementTooltip): void {
    const positionFromParent = this.hostElement.getBoundingClientRect();
    let tooltipElement: HTMLElement = this.elementRef.nativeElement.children[0];
    this.storeTooltipSize(tooltipElement);
    switch(this.placement) {
      case placementTooltip.left:
        if (this.canDisplayTooltipOnLeft(positionFromParent) || initialPlacement === placementTooltip.left) {
          this.positionTooltip = {
            top: positionFromParent.top + (this.hostElement.offsetHeight / 2 - tooltipElement.offsetHeight / 2),
            left: positionFromParent.left - tooltipElement.offsetWidth
          }
        } else {
          this.placement = placementTooltip.top;
          this.setPositionTooltip(initialPlacement || placementTooltip.left);
        }
        break;
      case placementTooltip.top:
        if (this.canDisplayTooltipOnTop(positionFromParent) || initialPlacement === placementTooltip.top) {
          this.positionTooltip = {
            top: positionFromParent.top - tooltipElement.offsetHeight,
            left: positionFromParent.left + (this.hostElement.offsetWidth / 2 - tooltipElement.offsetWidth / 2)
          }
        } else {
          this.placement = placementTooltip.right;
          this.setPositionTooltip(initialPlacement || placementTooltip.top);
        }
        break;
      case placementTooltip.right:
        if (this.canDisplayTooltipOnRight(positionFromParent) || initialPlacement === placementTooltip.right) {
          this.positionTooltip = {
            top: positionFromParent.top + (this.hostElement.offsetHeight / 2 - tooltipElement.offsetHeight / 2),
            left: positionFromParent.right
          }
        } else {
          this.placement = placementTooltip.bottom;
          this.setPositionTooltip(initialPlacement || placementTooltip.right);
        }
        break;
      case placementTooltip.bottom:
        if (this.canDisplayTooltipOnBottom(positionFromParent) || initialPlacement === placementTooltip.bottom) {
          this.positionTooltip = {
            top: positionFromParent.top + positionFromParent.height,
            left: positionFromParent.left + (this.hostElement.offsetWidth / 2 - tooltipElement.offsetWidth / 2)
          }
        } else {
          this.placement = placementTooltip.left;
          this.setPositionTooltip(initialPlacement || placementTooltip.bottom);
        }
        break;
      default:
        throw new Error('Not defined');
    }
  }

  /**
   * Store initial tooltip size
   *
   * @param {HTMLElement} tooltipElement
   */
  private storeTooltipSize(tooltipElement: HTMLElement): void {
    if (!this.initialTooltipSize) {
      this.initialTooltipSize = {
        height: tooltipElement.offsetHeight,
        width: tooltipElement.offsetWidth
      }
    }
  }

  private canDisplayTooltipOnLeft(positionFromParent: DOMRect): boolean {
    return positionFromParent.left > this.initialTooltipSize!.width;
  }

  private canDisplayTooltipOnTop(positionFromParent: DOMRect): boolean {
    return positionFromParent.top > this.initialTooltipSize!.height;
  }

  private canDisplayTooltipOnRight(positionFromParent: DOMRect): boolean {
    return window.innerWidth > positionFromParent.right + this.initialTooltipSize!.width;
  }

  private canDisplayTooltipOnBottom(positionFromParent: DOMRect): boolean {
    return window.innerHeight > positionFromParent.top + this.initialTooltipSize!.height + positionFromParent.height;
  }
}

