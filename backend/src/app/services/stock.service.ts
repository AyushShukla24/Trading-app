import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CryptoHolding {
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  purchaseDate: string;
}

@Injectable({
    providedIn: 'root'
})

export class StockService {
    private baseUrl = environment.baseApiUrl; 
    private wishlist: any[] = []; 

    constructor(private http: HttpClient) {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        this.wishlist = JSON.parse(savedWishlist);
      }
    }

    // getMarketChart(stockId: string, days: number): Observable<any> {
    //     return this.http.get(`https://api.coingecko.com/api/v3/coins/${stockId}/market_chart?vs_currency=usd&days=${days}`);
    // }

    getMarketChart(stockId: string, days: number): Observable<any> {
      const headers = new HttpHeaders({
        accept: 'application/json',
        'x-cg-demo-api-key': environment.coinGeckoApiKey
      });
  
      return this.http.get(
        `https://api.coingecko.com/api/v3/coins/${stockId}/market_chart?vs_currency=usd&days=${days}`,
        { headers }
      );
    }
    
    getStockByName(name: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/wishlist/${name}`);
    }

    saveStock(stockDetails: any): Observable<any> {
      // console.log(stockDetails)
        return this.http.post(`${this.baseUrl}/wishlist`, stockDetails); 
    }

    getStockById(name: string): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/wishlist/${name}`);
  }

    removeStock(name: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/wishlist/${name}`);
    }

    getWishlist(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/wishlist`);
    }    
  
    addStockToWishlist(stock: any): void {
      // console.log(stock)
      this.wishlist.push(stock);
    }
  
    removeStockFromWishlist(stockId: string): void {
      this.removeStock(stockId).subscribe({
        next: (response) => {
          this.wishlist = this.wishlist.filter(stock => stock.id !== stockId);
        },
        error: (error) => {
          console.error('Error removing stock from wishlist:', error);
        }
      });
    }   
    
    buyCrypto(purchaseData: any): Observable<any> {
      // console.log(purchaseData)
      return this.http.post<any>(`${this.baseUrl}/buy`, purchaseData);
  }
     
  getHoldings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/crypto-holdings`);
  }

  getHoldingsByEmail(userEmail: string): Observable<CryptoHolding[]> {
    return this.http.get<CryptoHolding[]>(`${this.baseUrl}/crypto-holdings?email=${userEmail}`);
  }

  updateHoldings(updatePayload:any){
    return this.http.post<any>(`${this.baseUrl}/update-holdings`,updatePayload)
  }
}
