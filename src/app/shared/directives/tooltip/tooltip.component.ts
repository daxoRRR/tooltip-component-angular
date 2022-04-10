import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
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
  @Input() placement: placementTooltip = placementTooltip.left;

  // Set default positionTooltip
  public positionTooltip: positionTooltip = {top: 0, left: 0};

  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    if (!this.tooltipText) {
      // Display the text in the parent HTMLElement if no text given
      this.tooltipText = this.hostElement.innerText;
      // Need to detectChanges to set the text and to have the offsetWidth/offsetHeight updated
      this.ref.detectChanges();
    }
    if (!this.hostElement) {
      throw new Error('hostElement should be defined');
    }
    this.setPositionTooltip(this.hostElement);
  }

  /**
   * set tooltip position based on placement
   *
   * @param parentElement
   */
  private setPositionTooltip(parentElement: HTMLElement): void {
    const positionFromParent = parentElement.getBoundingClientRect();
    const tooltipElement = this.elementRef.nativeElement.children[0];
    switch(this.placement) {
      case placementTooltip.left:
        this.positionTooltip = {
          top: positionFromParent.top + (parentElement.offsetHeight / 2 - tooltipElement.offsetHeight / 2),
          left: positionFromParent.left - tooltipElement.offsetWidth
        }
        break;
      case placementTooltip.top:
        this.positionTooltip = {
          top: positionFromParent.top - tooltipElement.offsetHeight,
          left: positionFromParent.left + (parentElement.offsetWidth / 2 - tooltipElement.offsetWidth / 2)
        }
        break;
      case placementTooltip.right:
        this.positionTooltip = {
          top: positionFromParent.top + (parentElement.offsetHeight / 2 - tooltipElement.offsetHeight / 2),
          left: positionFromParent.left + positionFromParent.width
        }
        break;
      case placementTooltip.bottom:
        this.positionTooltip = {
          top: positionFromParent.top + positionFromParent.height,
          left: positionFromParent.left + (parentElement.offsetWidth / 2 - tooltipElement.offsetWidth / 2)
        }
        break;
      default:
        throw new Error('Not defined');
    }
  }
}
