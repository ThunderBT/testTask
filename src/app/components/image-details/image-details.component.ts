import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ImageItem } from '../../models/image-item';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { ImagesBackendProviderService } from '../../services/images-backend-provider.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss']
})
export class ImageDetailsComponent implements OnInit, OnDestroy {
  image: ImageItem;
  private imageId: string;
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imagesProviderService: ImagesBackendProviderService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.imageId = params.id;
          return this.imagesProviderService.getImages();
        })
      )
      .subscribe((images: ImageItem[]) => {
        if (this.imageId) {
          this.image = images.find((item) => item.id === this.imageId);
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  imageEdit(): void {
    this.router.navigate(['/edit-image', this.image.id]);
  }

  navigateBack(): void {
    this.location.back();
  }
}
