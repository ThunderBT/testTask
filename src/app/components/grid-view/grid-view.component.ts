import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImagesBackendProviderService } from '../../services/images-backend-provider.service';
import { ImageItem } from '../../models/image-item';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit, OnDestroy {
  images: ImageItem[];
  gridCols: number;
  private removeSubscription: Subscription;
  private imagesSubscription: Subscription;
  private mediaSubscription: Subscription;

  private gridByBreakpoint = {
    xl: 4,
    lg: 4,
    md: 2,
    sm: 2,
    xs: 1
  };

  constructor(
    private imagesProviderService: ImagesBackendProviderService,
    private router: Router,
    private observableMedia: MediaObserver,
  ) { }

  ngOnInit(): void {
    this.startSetUp();
    this.imagesSubscription = this.imagesProviderService.getImages().subscribe((images: ImageItem[]) => {
      this.images = images;
    });
    this.mediaSubscription = this.observableMedia.asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      ).subscribe((change: MediaChange) => {
        this.gridCols = this.gridByBreakpoint[change.mqAlias];
      });
  }

  ngOnDestroy(): void {
    if (this.removeSubscription) {
      this.removeSubscription.unsubscribe();
    }
    this.imagesSubscription.unsubscribe();
    this.mediaSubscription.unsubscribe();
  }

  trackByFunc(index: number): number {
    return index;
  }

  removeImage(image: ImageItem, index: number): void {
    this.removeSubscription = this.imagesProviderService.removeImage(image.id).subscribe(() => {
      this.images.splice(index, 1);
    });
  }

  imageDetails(image: ImageItem): void {
    this.router.navigate(['/details', image.id], { state: { image } });
  }

  private startSetUp(): void {
    if (!localStorage.getItem('images')) {
      const images = [
        {
          tooltipText: 'tooltip',
          tooltipBgColor: '#fff',
          tooltipTextColor: '#000',
          tooltipBorderColor: '#000',
          imageUrl: 'http://www.radionetplus.ru/uploads/posts/2013-04/1365401196_teplye-oboi-1.jpeg',
          posLeft: 19.723618090452256,
          posTop: 15.857063093244005,
          id: '895c32f9-80ff-401f-958d-fa271e01013d',
        },
        {
          tooltipText: 'tooltip',
          tooltipBgColor: '#fff',
          tooltipTextColor: '#000',
          tooltipBorderColor: '#000',
          imageUrl: 'https://www.itl.cat/pngfile/big/180-1802852_toyota-gt86-scion-frs-subaru-brz-coupe-tuning.jpg',
          posLeft: 19.723618090452256,
          posTop: 15.857063093244005,
          id: '895c32f9-80ff-401f-958d-fa271e01013d',
        }
      ];
      localStorage.setItem('images', JSON.stringify(images));
    }
  }
}
