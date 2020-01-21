import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ImagesBackendProviderService } from '../../services/images-backend-provider.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { switchMap } from 'rxjs/operators';
import { ImageItem } from '../../models/image-item';
import { Location } from '@angular/common';
import { CustomPosition } from 'src/app/models/position';
import * as uuid from 'uuid';

@Component({
  selector: 'app-edit-image-item',
  templateUrl: './edit-image-item.component.html',
  styleUrls: ['./edit-image-item.component.scss']
})
export class EditImageItemComponent implements OnInit, OnDestroy {
  posLeft: number;
  posTop: number;
  imageForm: FormGroup;
  imageId: string;
  isImageLoaded: boolean;
  imageSaveTypes: string[];
  selectedType: string;
  fileName: string;
  private routeSubscription: Subscription;
  private addSubscription: Subscription;
  private updateSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private imagesProviderService: ImagesBackendProviderService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.posLeft = 0;
    this.posTop = 0;
    this.imageSaveTypes = ['URL', 'Upload'];
    this.selectedType = 'URL';
    this.isImageLoaded = false;
    this.initForm();
    this.routeSubscription = this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.imageId = params.id;
          return this.imagesProviderService.getImages();
        })
      )
      .subscribe((images: ImageItem[]) => {
        this.patchForm(images);
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    if (this.addSubscription) {
      this.addSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  onImageError(): void {
    this.isImageLoaded = false;
  }

  save(): void {
    const image: ImageItem = {
      ...this.imageForm.value,
      posLeft: this.posLeft,
      posTop: this.posTop,
      id: this.imageId ? this.imageId : uuid.v4(),
    };
    if (!this.imageId) {
      this.addSubscription = this.imagesProviderService.addImage(image).subscribe();
    } else {
      this.updateSubscription = this.imagesProviderService.updateImage(image).subscribe();
    }
    this.router.navigate(['']);
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    this.fileName = file.name;
    this.setImagePreview(file);
  }

  navigateBack(): void {
    this.location.back();
  }

  onDragMove(event: CustomPosition): void {
    this.posLeft = event.posLeft;
    this.posTop = event.posTop;
  }

  private initForm(): void {
    this.imageForm = this.fb.group(
      {
        tooltipText: new FormControl('tooltip', Validators.required),
        tooltipBgColor: new FormControl('#fff', Validators.required),
        tooltipTextColor: new FormControl('#000', Validators.required),
        tooltipBorderColor: new FormControl('#000', Validators.required),
        imageUrl: new FormControl('', Validators.required),
      }
    );
  }

  private patchForm(images: ImageItem[]): void {
    if (this.imageId) {
      const image = images.find((item) => item.id === this.imageId);
      this.imageForm.patchValue(image);
      this.posLeft = image.posLeft;
      this.posTop = image.posTop;
    }
  }

  private setImagePreview(fileData: File): void {
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = () => {
      this.imageForm.get('imageUrl').setValue(reader.result);
    };
  }
}
