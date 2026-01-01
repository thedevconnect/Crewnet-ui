import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  /**
   * Normalize image path - adds base URL if needed
   */
  normalizeImagePath(path: string | null | undefined, baseUrl: string = ''): string {
    if (!path) {
      return '/assets/img/placeholder.png'; // Default placeholder image
    }

    // If path already has http:// or https://, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // If path starts with /, it's already an absolute path
    if (path.startsWith('/')) {
      return baseUrl ? `${baseUrl}${path}` : path;
    }

    // Relative path - prepend baseUrl if provided
    return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
  }

  /**
   * Validate file type
   */
  isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * Validate file size (in bytes)
   */
  isValidFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  /**
   * Convert file to base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.onerror = (error) => reject(error);
    });
  }
}

