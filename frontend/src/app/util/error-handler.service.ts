import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    handleHttpError(error: HttpErrorResponse) {
        if (error.status === 403) {
            return throwError(() => new Error('Permission denied. Only ADMINS can add products.'));
        }
        return throwError(() => new Error('An unexpected error occurred.'));
    }
}
