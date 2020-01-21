import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.scss']
})
export class ImageItemComponent implements OnInit, OnDestroy {
  @Input() imageSrc: string;

  loading: boolean;
  private imageSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.loading = true;
    const img = new Image();
    this.imageSubscription = fromEvent(img, 'load').subscribe(() => {
      this.loading = false;
    });
    img.src = this.imageSrc;
  }

  ngOnDestroy(): void {
    this.imageSubscription.unsubscribe();
  }
}
