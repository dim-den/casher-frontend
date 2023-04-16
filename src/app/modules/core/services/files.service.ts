import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ResponseBlobContent {
  filename: string;
  blob: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private getFileNameFromHeaders(headers: HttpHeaders) {
    const contentDispositionHeader = headers.get('content-disposition');
    const filename = contentDispositionHeader
      .split(';')
      .find((x) => x.includes('filename'))
      .split('=')[1]
      .replace(/"/g, '');
    return decodeURI(filename);
  }

  getResponseContent(response: HttpResponse<Blob>): ResponseBlobContent {
    const filename = this.getFileNameFromHeaders(response.headers);
    const blob = response.body;
    return { filename, blob };
  }

  downloadWithName(response: HttpResponse<Blob>) {
    const content = this.getResponseContent(response);
    this.generateBlob(content.blob, (x) => {
      x.download = content.filename;
      return x;
    });
  }

  public generateBlob(
    blob: Blob,
    p: (e: HTMLAnchorElement) => HTMLAnchorElement
  ): void {
    const href = window.URL.createObjectURL(blob);
    let a = document.createElement('a');

    document.body.appendChild(a);
    a.href = href;
    a = p(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(href);
    }, 100);
  }
}
