import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockService } from '../../services/stock.service';
import { StockChartComponent } from '../stock-chart/stock-chart.component';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { BuyModalComponent } from '../buy-modal/buy-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface HistoricalData {
  date: number;
  price: number;
}

interface StockDetails {
  id: string;
  historicalData: HistoricalData[];
  image: string;
  name: string;
  symbol: string;
  lastPrice: number;
  priceChangePercentage: number;
  price_change_24h: number;
  marketCapRank: number;
  marketCapChangePercentage: number;
  low24h: number;
  high24h: number;
  lastUpdated: string;
  isBookmarked?: boolean;
}

interface BuyModalResult {
    type: 'MARKET' | 'LIMIT';
    price: number;
    quantity: number;
    duration?: 'INTRADAY' | 'GTC';
  }

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, StockChartComponent, MatIconModule,MatDialogModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  username = localStorage.getItem('username');
  isEkycCompleted = localStorage.getItem('isEkycCompleted');
  stockDetails: StockDetails | undefined;
  historicalData: HistoricalData[] = [];
  simplifiedData: HistoricalData[] = [];
  timeframe = 1;
  isBookmarked = false;
  private toast = inject(ToastrService);
  private dialog = inject(MatDialog); 
  userEmail = localStorage.getItem('email');
  selectedUnits = 1;

  constructor(private router: Router, private stockService: StockService) {}

  ngOnInit(): void {
    this.stockDetails = history.state.stockData; // saved data passing as props

    if (!this.stockDetails) {
      this.router.navigate(['/stock']);
    } else {
      this.checkBookmarkStatus();
      this.fetchMarketData(this.stockDetails.id);
    }
  }

  fetchMarketData(stockId: string): void {
    this.stockService.getMarketChart(stockId, this.timeframe).subscribe({
      next: (response) => {
        this.historicalData = response.prices.map(([date, price]: number[]) => ({ date, price }));
        this.simplifiedData = this.simplifyData(this.historicalData);
      },
      error: (error) => console.error('Error fetching market data:', error),
    });
  }

  simplifyData(data: HistoricalData[]): HistoricalData[] {
    const interval = Math.floor(data.length / 10);
    return data.filter((_, index) => index % interval === 0);
  }

  changeTimeframe(days: number): void {
    this.timeframe = days;
    if (this.stockDetails?.id) {
      this.fetchMarketData(this.stockDetails.id);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  toggleBookmark(): void {
    if (!this.username) {
      this.toast.error('Login first');
      return;
    }

    this.isBookmarked = !this.isBookmarked;
    if (this.isBookmarked && this.stockDetails) {
      this.stockService.saveStock(this.stockDetails).subscribe({
        next: () => this.toast.success('Stock saved to wishlist successfully!'),
        error: () => {
          this.toast.error('Failed to save stock to wishlist.');
          this.isBookmarked = false;
        },
      });
    } else if (this.stockDetails) {
      this.stockService.removeStock(this.stockDetails.name).subscribe({
        next: () => this.toast.info('Stock removed from wishlist.'),
        error: () => {
          this.toast.error('Failed to remove stock from wishlist.');
          this.isBookmarked = true;
        },
      });
    }
  }

  checkBookmarkStatus(): void {
    if (this.stockDetails) {
      this.stockService.getStockById(this.stockDetails.name).subscribe({
        next: (stock: any) => (this.isBookmarked = stock.isBookmarked),
        error: (error: any) => console.error('Error fetching stock status:', error),
      });
    }
  }

buyStock(): void {
    if (!this.username) {
      this.toast.error('Login first');
      return;
    }
    if (!this.isEkycCompleted) {
      this.toast.info('Complete eKYC status');
      return;
    }

    if (!this.stockDetails) {
      this.toast.error('Invalid stock details');
      return;
    }

    const dialogRef = this.dialog.open(BuyModalComponent, {
      data: {
        symbol: this.stockDetails.symbol,
        name: this.stockDetails.name,
        currentPrice: this.stockDetails.lastPrice,
        image: this.stockDetails.image
      },
      panelClass: 'buy-modal-dialog'
    });

    dialogRef.afterClosed().subscribe((result: BuyModalResult | undefined) => {
      if (result) {
        const purchaseData = {
          userEmail: this.userEmail,
          symbol: this.stockDetails!.symbol,
          name: this.stockDetails!.name,
          purchasePrice: result.price,
          quantity: result.quantity,
          purchaseDate: new Date(),
          image: this.stockDetails!.image,
          profitLoss: this.stockDetails!.priceChangePercentage,
          orderType: result.type,
          duration: result.duration
        };

        this.stockService.buyCrypto(purchaseData).subscribe({
          next: () => this.toast.success('Order placed successfully!'),
          
          error: () => this.toast.error('Failed to place order.')
        });
        // console.log(purchaseData)
      }
    });
  }
}
