import { Component, DoCheck, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, NavbarComponent, FooterComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{
  wishlist: any[] = [];

  constructor(private stockService: StockService, private route: Router) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.stockService.getWishlist().subscribe(
      (stocks) => {
        this.wishlist = stocks; 
      },
      (error) => {
        console.error('Error fetching wishlist', error);
      }
    );
  }

  removeFromWishlist(stockId: string): void {
    this.stockService.removeStockFromWishlist(stockId);
    this.loadWishlist();
    window.location.reload();
  }

  goToCard(stock: any) {
    console.log(stock)
    this.route.navigate(['/stock', stock.stockId], { state: { stockData: stock } });
  }
}
