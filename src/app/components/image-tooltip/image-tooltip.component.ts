import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-tooltip',
  templateUrl: './image-tooltip.component.html',
  styleUrls: ['./image-tooltip.component.scss']
})
export class ImageTooltipComponent implements OnInit {
  @Input() bgColor: string;
  @Input() textColor: string;
  @Input() borderColor: string;
  @Input() tooltipText: string;

  constructor() { }

  ngOnInit(): void {
  }

}
