import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-stock-table',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.css'],
})
export class StockTableComponent implements OnInit {
  
  stocks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalStocks: number = 0;
  showTable = false;
  isLoading = true; 
  isError = false; 
  isStockRoute: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchMarketData();
    this.isStockRoute = this.router.url === '/stock';
  }

  fetchMarketData(): void {
    // const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
  const headers = new HttpHeaders({
    accept: 'application/json',
    'x-cg-demo-api-key': 'CG-kv5kqyziJ1A3TCzhyQV25XNQ'
  });
  
    this.http.get<any[]>(url,{ headers }).subscribe({
      next: (data) => {
        this.stocks = data.map(stock => ({
          id: stock.id,
          name: stock.name,
          symbol: stock.symbol.toUpperCase(),
          lastPrice: stock.current_price,
          priceChangePercentage: stock.price_change_percentage_24h,
          marketCap: stock.market_cap,
          high24h: stock.high_24h,
          low24h: stock.low_24h,
          lastUpdated: stock.last_updated,
          marketCapRank: stock.market_cap_rank,
          marketCapChangePercentage: stock.market_cap_change_percentage_24h,
          image: stock.image,
          total_volume: stock.total_volume,
          total_supply: stock.total_supply,
          price_change_24h: stock.price_change_24h
        }));
        this.totalStocks = this.stocks.length;
        this.isLoading = false; 
      },
      error: () => {
        this.isLoading = false;
        this.isError = true; 
      }
    });
  }

  get paginatedStocks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.stocks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.totalStocks / this.itemsPerPage);
  }

  goToCard(stock: any) {
    this.router.navigate(['/stock', stock.id], { state: { stockData: stock } });
  }
}
