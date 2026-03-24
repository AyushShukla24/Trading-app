// portfolio.component.ts
import { Component, OnInit } from '@angular/core';
import { CryptoHolding } from '../../services/stock.service';
import { StockService } from '../../services/stock.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  imports: [CommonModule, NavbarComponent]
})
export class PortfolioComponent implements OnInit {
  holdings: CryptoHolding[] = [];
  totalPortfolioValue: number = 0;
  totalInvested: number = 0;
  totalProfitLoss: number = 0;
  investmentChart: any;
  Math: any;

  constructor(private portfolioService: StockService) {}

  ngOnInit(): void {
    const userEmail = localStorage.getItem('email'); // Assuming email is stored in localStorage
    if (!userEmail) {
        console.error('User is not logged in.');
        return;
    }

    this.portfolioService.getHoldingsByEmail(userEmail).subscribe({
        next: (data) => {
            // console.log('Fetched Holdings:', data);
            this.holdings = data;
            this.calculateTotals();
            this.initializeChart();
        },
        error: (error) => {
            console.error('Error fetching holdings:', error);
        }
    });
  }

  getCryptoSymbol(name: string): string {
    const symbols: { [key: string]: string } = {
      'Bitcoin': '₿',
      'Ethereum': 'Ξ',
      'Cardano': '₳',
      'Dogecoin': 'Ð',
      'USDC': '$'
    };
    return symbols[name] || name.charAt(0);
  }

  calculateTotals(): void {
    this.totalInvested = this.holdings.reduce(
      (sum, holding) => sum + (holding.purchasePrice * holding.quantity),
      0
    );
    
    this.totalPortfolioValue = this.holdings.reduce(
      (sum, holding) => sum + (holding.currentPrice * holding.quantity),
      0
    );
    
    this.totalProfitLoss = this.totalPortfolioValue - this.totalInvested;

    this.holdings.forEach(holding => {
      this.updateBackendHoldings(holding);
    });
  }

  getProfitLossValue(holding: CryptoHolding): number {
    if (!holding || holding.currentPrice === undefined || holding.purchasePrice === undefined || holding.quantity === undefined) {
      return 0;
    }
    return (holding.currentPrice * holding.quantity) - (holding.purchasePrice * holding.quantity);
  }

  getProfitLossPercentage(holding: CryptoHolding): number {
    const invested = (holding.purchasePrice || 0) * (holding.quantity || 0);
    if (invested === 0) return 0;
    const profitLoss = this.getProfitLossValue(holding);
    return (profitLoss / invested) * 100;
  }

  getProfitLossClass(holding: CryptoHolding): string {
    return this.getProfitLossValue(holding) >= 0 ? 'positive' : 'negative';
  }

  updateBackendHoldings(holding: CryptoHolding): void {
    const updatePayload = {
      userEmail: localStorage.getItem('email'),
      symbol: holding.symbol,
      currentPrice: holding.currentPrice,
      currentValue: holding.currentPrice * holding.quantity
    };
  
    this.portfolioService.updateHoldings(updatePayload).subscribe({
      next: (response) => (console.log("done")),
      error: (error) => console.error('Update Failed:', error)
    });
  }
  

  initializeChart(): void {
    const ctx = document.getElementById('investmentChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.investmentChart) {
      this.investmentChart.destroy();
    }

    const labels = this.holdings.map(holding => holding.name);
    const currentValues = this.holdings.map(holding => 
      holding.currentPrice * holding.quantity
    );
    const investedValues = this.holdings.map(holding => 
      holding.purchasePrice * holding.quantity
    );

    this.investmentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Current Value',
            data: currentValues,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Invested Amount',
            data: investedValues,
            borderColor: '#ff4b2b',
            backgroundColor: 'rgba(255, 75, 43, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e0e0e0',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(4, 4, 65, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#e0e0e0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e0e0e0',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e0e0e0'
            }
          }
        }
      }
    });
  }
}