import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Product} from "../../model/product";
import { ErrorHandlerService } from '../../util/error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(private httpClient: HttpClient, private errorHandler: ErrorHandlerService) {}


  getProducts(): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>('http://localhost:9000/api/product');
  }

  createProduct(product: Product) {
    return this.httpClient.post('http://localhost:9000/api/product', product).pipe(
        catchError((error) => this.errorHandler.handleHttpError(error))

    );
  }
}
