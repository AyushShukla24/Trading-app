import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { Section1Component } from "../section1/section1.component";
import { StockTableComponent } from "../stock-table/stock-table.component";
import { Section2Component } from "../section-2/section-2.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, Section1Component, StockTableComponent, Section2Component, FooterComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {

}
