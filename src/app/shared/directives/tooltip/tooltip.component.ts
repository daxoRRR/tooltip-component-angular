import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';
import { placementTooltip, positionTooltip } from '../../models/tooltip/tooltip.model';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements AfterContentInit {

  // Is the parent HTMLElement
  @Input() hostElement!: HTMLElement;

  // text to display in tooltip
  @Input() tooltipText?: string;

  // Get the position and set Right by default
  @Input() placement: placementTooltip = placementTooltip.bottom;

  // Set default positionTooltip
  public positionTooltip: positionTooltip = {top: 0, left: 0};
  private initialTooltipSize: any;

  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) { }


  ngAfterContentInit(): void {
    if (!this.hostElement) {
      throw new Error('hostElement should be defined');
    }
    if (!this.tooltipText) {
      // Display the text in the parent HTMLElement if no text given
      this.tooltipText = this.hostElement.innerText;
      // Need to detectChanges to set the text and to have the offsetWidth/offsetHeight updated
      this.ref.detectChanges();
    }
    this.setPositionTooltip();
  }

  /**
   * set tooltip position based on placement
   *
   */
  @HostListener('window:resize')
  private setPositionTooltip(): void {
    const positionFromParent = this.hostElement.getBoundingClientRect();
    let tooltipElement: HTMLElement = this.elementRef.nativeElement.children[0];
    this.storeTooltipSize(tooltipElement);
    switch(this.placement) {
      case placementTooltip.left:
        this.updateTooltipSizeWithSpaceAvailable(positionFromParent);
        tooltipElement = this.elementRef.nativeElement.children[0];
        this.positionTooltip = {...this.positionTooltip,
          top: positionFromParent.top + (this.hostElement.offsetHeight / 2 - tooltipElement.offsetHeight / 2),
          left: positionFromParent.left - tooltipElement.offsetWidth
        }
        break;
      case placementTooltip.top:
        this.updateTopTooltipSizeWithSpaceAvailable(positionFromParent);
        tooltipElement = this.elementRef.nativeElement.children[0];
        this.positionTooltip = { ...this.positionTooltip,
          top: positionFromParent.top - tooltipElement.offsetHeight,
          left: positionFromParent.left + (this.hostElement.offsetWidth / 2 - tooltipElement.offsetWidth / 2)
        }
        break;
      case placementTooltip.right:
        this.updateRightPositionTooltipSizeWithSpaceAvailable(positionFromParent);
        tooltipElement = this.elementRef.nativeElement.children[0];
        this.positionTooltip = {...this.positionTooltip,
          top: positionFromParent.top + (this.hostElement.offsetHeight / 2 - tooltipElement.offsetHeight / 2),
          left: positionFromParent.right
        }
        break;
      case placementTooltip.bottom:
        this.updateBottomTooltipSizeWithSpaceAvailable(positionFromParent);
        tooltipElement = this.elementRef.nativeElement.children[0];
        this.positionTooltip = {
          top: positionFromParent.top + positionFromParent.height,
          left: positionFromParent.left + (this.hostElement.offsetWidth / 2 - tooltipElement.offsetWidth / 2)
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

  private updateTooltipSizeWithSpaceAvailable(positionFromParent: DOMRect): void {
    if (positionFromParent.left > this.initialTooltipSize.width) {
      this.positionTooltip.width = this.initialTooltipSize.width;
    } else {
      this.positionTooltip.width = positionFromParent.left - 10;
    }
    this.ref.detectChanges();
  }

  private updateTopTooltipSizeWithSpaceAvailable(positionFromParent: DOMRect): void {
    if (positionFromParent.top > this.initialTooltipSize.height) {
      this.positionTooltip.height = this.initialTooltipSize.height;
    } else {
      this.positionTooltip.height = positionFromParent.top;
    }
    this.ref.detectChanges();
  }

  private updateRightPositionTooltipSizeWithSpaceAvailable(positionFromParent: DOMRect): void {
    console.log('window', window.innerWidth);
    console.log('tooltip pos', positionFromParent.right + this.initialTooltipSize.width)
    console.log('size', window.innerWidth - positionFromParent.right)
    if (window.innerWidth > positionFromParent.right + this.initialTooltipSize.width) {
      this.positionTooltip.width = this.initialTooltipSize.width;
    } else {
      this.positionTooltip.width = window.innerWidth - positionFromParent.right;
    }
    this.ref.detectChanges();
  }

  private updateBottomTooltipSizeWithSpaceAvailable(positionFromParent: DOMRect): void {
    if (positionFromParent.top > this.initialTooltipSize.height) {
      this.positionTooltip.height = this.initialTooltipSize.height;
    } else {
      this.positionTooltip.height = positionFromParent.top;
    }
    this.ref.detectChanges();
  }
}
