import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface BuyModalData {
  symbol: string;
  name: string;
  currentPrice: number;
  image: string;
}

@Component({
  selector: 'app-buy-modal',
  standalone: true,
  imports: [CommonModule,FormsModule,MatDialogModule,MatSlideToggleModule,MatInputModule,MatButtonModule,MatIconModule],
  templateUrl: './buy-modal.component.html',
   styleUrls: ['./buy-modal.component.css'],
})
export class BuyModalComponent {
  isLimitOrder = false;
  quantity = 0;
  limitPrice: number;
  total = 0;
  isGoodTillCancelled = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BuyModalData,
    private dialogRef: MatDialogRef<BuyModalComponent>
  ) {
    this.limitPrice = data.currentPrice;
  }

  calculateTotal(): void {
    const price = this.isLimitOrder ? this.limitPrice : this.data.currentPrice;
    this.total = price * this.quantity;
  }

  placeBuyOrder(): void {
    const orderData = {
      type: this.isLimitOrder ? 'LIMIT' : 'MARKET',
      price: this.isLimitOrder ? this.limitPrice : this.data.currentPrice,
      quantity: this.quantity,
      symbol: this.data.symbol,
      duration: this.isLimitOrder ? 
        (this.isGoodTillCancelled ? 'GTC' : 'INTRADAY') : 
        undefined
    };
    
    this.dialogRef.close(orderData);
  }

  close(): void {
    this.dialogRef.close();
  }
}