import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getAccessToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private request<T>(method: string, path: string, body?: any): Observable<T> {
    return from(this.getHeaders()).pipe(
      switchMap((headers) => {
        const url = `${this.baseUrl}${path}`;
        switch (method) {
          case 'GET':
            return this.http.get<T>(url, { headers });
          case 'POST':
            return this.http.post<T>(url, body, { headers });
          case 'PUT':
            return this.http.put<T>(url, body, { headers });
          case 'DELETE':
            return this.http.delete<T>(url, { headers });
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      })
    );
  }

  // Products
  getProducts(limit: number, cursor?: string, filters?: Record<string, any>): Observable<any> {
    let params = `?limit=${limit}`;
    if (cursor) params += `&cursor=${encodeURIComponent(cursor)}`;
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== '' && value != null) {
          const apiKey = key === 'subCategory' ? 'subCategory' : key;
          params += `&${apiKey}=${encodeURIComponent(value)}`;
        }
      });
    }
    return this.request<any>('GET', `/products${params}`);
  }

  getProductById(id: string): Observable<any> {
    return this.request('GET', `/products/item/${id}`);
  }

  createProduct(data: any): Observable<any> {
    return this.request('POST', '/products', data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.request('DELETE', `/products/item/${id}`);
  }

  // Categories
  getCategories(): Observable<any[]> {
    return this.request('GET', '/products/categories');
  }

  createCategory(data: any): Observable<any> {
    return this.request('POST', '/products/categories', data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.request('DELETE', `/products/categories/${id}`);
  }

  // Sliders
  getSliders(): Observable<any[]> {
    return this.request('GET', '/products/sliders');
  }

  createSlider(data: any): Observable<any> {
    return this.request('POST', '/products/sliders', data);
  }

  deleteSlider(id: string): Observable<any> {
    return this.request('DELETE', `/products/sliders/${id}`);
  }

  // Settings
  getTheme(): Observable<any[]> {
    return this.request('GET', '/settings/theme');
  }

  updateTheme(data: any): Observable<any> {
    return this.request('PUT', '/settings/theme', data);
  }

  getShopName(): Observable<any[]> {
    return this.request('GET', '/settings/shop');
  }

  updateShopName(data: any): Observable<any> {
    return this.request('PUT', '/settings/shop', data);
  }

  getContactDetails(): Observable<any[]> {
    return this.request('GET', '/settings/contact');
  }

  updateContactDetails(data: any): Observable<any> {
    return this.request('PUT', '/settings/contact', data);
  }

  // Auth / Profile
  getProfile(): Observable<any> {
    return this.request('GET', '/auth/profile');
  }

  updateProfile(data: any): Observable<any> {
    return this.request('PUT', '/auth/profile', data);
  }

  // Cart
  getCartItems(): Observable<any[]> {
    return this.request('GET', '/cart');
  }

  addToCart(product: any): Observable<any> {
    return this.request('POST', '/cart', product);
  }

  removeFromCart(productId: string): Observable<any> {
    return this.request('DELETE', `/cart/${productId}`);
  }

  syncCart(items: any[]): Observable<any> {
    return this.request('POST', '/cart/sync', { items });
  }

  // Orders
  getOrders(): Observable<any[]> {
    return this.request('GET', '/orders');
  }

  getOrdersByUserId(userId: string): Observable<any[]> {
    return this.request('GET', `/orders/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.request('GET', `/orders/${orderId}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.request('POST', '/orders', orderData);
  }

  updateOrder(orderId: string, orderData: any): Observable<any> {
    return this.request('PUT', `/orders/${orderId}`, orderData);
  }

  // Upload
  uploadImages(files: File[]): Observable<{ urls: string[] }> {
    return from(this.getHeaders()).pipe(
      switchMap(async (headers) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        const token = await this.authService.getAccessToken();
        const uploadHeaders = token
          ? new HttpHeaders({ Authorization: `Bearer ${token}` })
          : new HttpHeaders();
        return firstValueFrom(this.http.post<{ urls: string[] }>(`${this.baseUrl}/upload`, formData, {
          headers: uploadHeaders
        }));
      }),
      switchMap((result) => from(Promise.resolve(result)))
    );
  }

  processPayment(token: string, total: number): Observable<any> {
    return this.request('POST', '/payment', { token, total });
  }
}
