import { Directive, Output, EventEmitter, ElementRef, Renderer2, OnDestroy, NgZone, Input } from '@angular/core';
import { CustomPosition } from '../models/position';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnDestroy {
  @Input() posLeft: number;
  @Input() posTop: number;
  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<CustomPosition>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  private dragging = false;
  private pointerDownEvent: () => void;
  private pointerMoveEvent: () => void;
  private pointerUpEvent: () => void;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone,
  ) {
    this.pointerDownEvent = this.renderer.listen(this.element.nativeElement, 'pointerdown', (event) => {
      this.zone.runOutsideAngular(() => {
        this.onPointerDown(event);
      });
    });
    this.pointerMoveEvent = this.renderer.listen(document, 'pointermove', (event) => {
      this.zone.runOutsideAngular(() => {
        this.onPointerMove(event);
      });
    });
    this.pointerUpEvent = this.renderer.listen(document, 'pointerup', (event) => {
      this.zone.runOutsideAngular(() => {
        this.onPointerUp(event);
      });
    });
  }

  ngOnDestroy(): void {
    this.pointerDownEvent();
    this.pointerMoveEvent();
    this.pointerUpEvent();
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button === 0) {
      this.dragging = true;
      this.dragStart.emit(event);
    }

  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    const parentClientRect = this.element.nativeElement.parentNode.getBoundingClientRect();
    const limitations = this.getMaxLimitations();
    const newPosLeft = this.posLeft + event.movementX * 100 / parentClientRect.width;
    const newPosTop = this.posTop + event.movementY * 100 / parentClientRect.height;
    if (newPosLeft >= 0
      && newPosTop >= 0
      && newPosLeft <= limitations.posLeft
      && newPosTop <= limitations.posTop) {
        this.posLeft = newPosLeft;
        this.posTop = newPosTop;
    }
    this.dragMove.emit({
      posLeft: this.posLeft,
      posTop: this.posTop
    });
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    this.dragEnd.emit(event);
  }

  private getMaxLimitations(): CustomPosition {
    const parentClientRect = this.element.nativeElement.parentNode.getBoundingClientRect();
    const elementClientRect = this.element.nativeElement.getBoundingClientRect();
    const maxPosLeft = (parentClientRect.width - elementClientRect.width) * 100 / parentClientRect.width;
    const maxPosTop = (parentClientRect.height - elementClientRect.height) * 100 / parentClientRect.height;
    return { posLeft: maxPosLeft, posTop: maxPosTop };
  }
}
