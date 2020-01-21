import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageItem } from '../models/image-item';
import * as urls from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class ImagesBackendProviderService {

  constructor(
    private http: HttpClient,
  ) { }

  getImages(): Observable<object> {
    return this.http.get(urls.GET_IMAGES);
  }

  addImage(image: ImageItem): Observable<object> {
    return this.http.post(urls.ADD_IMAGE, { image });
  }

  updateImage(image: ImageItem): Observable<object> {
    return this.http.put(urls.UPDATE_IMAGE, { image });
  }

  removeImage(id: string): Observable<object> {
    return this.http.delete(urls.REMOVE_IMAGE, { params: { id } });
  }
}
