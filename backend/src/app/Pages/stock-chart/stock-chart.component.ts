import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
    selector: 'app-stock-chart',
    standalone: true,
    template: `<div class="stock-chart-container"><canvas #stockChartCanvas></canvas></div>`,
})
export class StockChartComponent implements OnInit, OnChanges {
    @Input() historicalData: { date: number; price: number }[] = [];

    @ViewChild('stockChartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private chart: Chart | undefined;

    ngOnInit(): void {
        this.initializeChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['historicalData'] && !changes['historicalData'].firstChange) {
            this.updateChartData();
        }
    }

    initializeChart(): void {
        if (this.chart) {
            this.chart.destroy(); 
        }

        const ctx = this.canvasRef.nativeElement.getContext('2d');
        if (!ctx) {
            console.error("Canvas context could not be found.");
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.historicalData.map(data => new Date(data.date).toLocaleDateString()),
                datasets: [{
                    label: 'Stock Price',
                    data: this.historicalData.map(data => data.price),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4, 
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        title: { display: true, text: 'Date' }
                    },
                    y: {
                        title: { display: true, text: 'Price (USD)' }
                    }
                }
            }
        });
    }

    updateChartData(): void {
        if (this.chart) {
            this.chart.data.labels = this.historicalData.map(data => new Date(data.date).toLocaleDateString());
            this.chart.data.datasets[0].data = this.historicalData.map(data => data.price);
            this.chart.update();
        }
    }
}
