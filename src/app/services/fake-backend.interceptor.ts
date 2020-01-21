import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { ImageItem } from '../models/image-item';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, params } = request;
        return of(null)
            .pipe(mergeMap(() => this.handleRoute(url, method, next, request, params)))
            .pipe(delay(500));
    }

    private handleRoute(
            url: string, method: string, next: HttpHandler, request: HttpRequest<any>, params: HttpParams
        ): Observable<HttpEvent<any>> {
        switch (true) {
            case url.endsWith('images') && method === 'GET':
                return this.getImages();
            case url.endsWith('/add-image') && method === 'POST':
                return this.addImage(request.body.image);
            case url.endsWith('/edit-image') && method === 'PUT':
                return this.editImage(request.body.image);
            case url.includes('remove-image') && method === 'DELETE':
                return this.removeImage(params);
            default:
                return next.handle(request);
        }
    }

    private getImages(): Observable<HttpResponse<any>> {
        const images = localStorage.getItem('images');
        return of(new HttpResponse({ status: 200, body: JSON.parse(images) }));
    }

    private addImage(image: ImageItem): Observable<HttpResponse<any>> {
        const images = JSON.parse(localStorage.getItem('images'));
        if (images) {
            images.push(image);
            localStorage.setItem('images', JSON.stringify(images));
        } else {
            localStorage.setItem('images', JSON.stringify([image]));
        }
        return of(new HttpResponse({ status: 200, body: {} }));
    }

    private editImage(image: ImageItem): Observable<HttpResponse<any>> {
        const images = JSON.parse(localStorage.getItem('images'));
        const index = images.findIndex((item: ImageItem) => item.id === image.id);
        images[index] = {...image};
        localStorage.setItem('images', JSON.stringify(images));
        return of(new HttpResponse({ status: 200, body: {} }));
    }

    private removeImage(params: HttpParams): Observable<HttpResponse<any>> {
        const images = JSON.parse(localStorage.getItem('images'));
        const index = images.findIndex((item: ImageItem) => item.id === params.get('id'));
        images.splice(index, 1);
        localStorage.setItem('images', JSON.stringify(images));
        return of(new HttpResponse({ status: 200, body: params.get('id') }));
    }
}
