import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  // Is the parent HTMLElement
  @Input() hostElement!: HTMLElement;

  // text to display in tooltip
  @Input() tooltipText?: string;

  constructor() { }

  ngOnInit(): void {
    if (!this.tooltipText) {
      // Display the text in the parent HTMLElement if no text given
      this.tooltipText = this.hostElement.innerText;
    }
  }

}
