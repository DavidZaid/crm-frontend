import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

// Import Chart.js types
import { ChartData, ChartOptions } from 'chart.js';
import 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // KPI
  totalMesActual: number = 0;
  anioActual: number = new Date().getFullYear();

  // ============================
  //   GRÁFICA DE BARRAS (VENTAS)
  // ============================
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  barChartLabels: string[] = [];

  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [], label: 'Ventas por Mes' }
    ]
  };

  // 🔥 CORRECCIÓN FUNDAMENTAL (as const)
  barChartType = 'bar' as const;


  // ============================
  //   GRÁFICA DE TORTA (TOP)
  // ============================
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  pieChartLabels: string[] = [];

  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      { data: [] }
    ]
  };

  // 🔥 CORRECCIÓN FUNDAMENTAL (as const)
  pieChartType = 'pie' as const;


  cargando: boolean = false;
  errorMensaje: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.errorMensaje = '';

    this.cargarTotalMesActual();
    this.cargarVentasPorMes();
    this.cargarProductosTop();
  }

  // ============================
  //       MÉTODOS KPI
  // ============================

  private cargarTotalMesActual(): void {
    this.apiService.get('ventas/kpi/total-mes').subscribe({
      next: (resp: any) => {
        this.totalMesActual = resp.total || 0;
        this.anioActual = resp.anio;
      },
      error: () => {
        this.errorMensaje = 'Error cargando total del mes actual.';
      }
    });
  }

  private cargarVentasPorMes(): void {
    this.apiService.get('ventas/kpi/ventas-por-mes').subscribe({
      next: (resp: any) => {
        this.barChartLabels = resp.labels || [];

        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              data: resp.data || [],
              label: 'Ventas por Mes'
            }
          ]
        };
      },
      error: () => {
        this.errorMensaje = 'Error cargando ventas por mes.';
      }
    });
  }

  private cargarProductosTop(): void {
    this.apiService.get('ventas/kpi/productos-top').subscribe({
      next: (resp: any) => {
        this.pieChartLabels = resp.labels || [];

        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [
            {
              data: resp.data || []
            }
          ]
        };

        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = 'Error cargando productos más vendidos.';
        this.cargando = false;
      }
    });
  }
}
