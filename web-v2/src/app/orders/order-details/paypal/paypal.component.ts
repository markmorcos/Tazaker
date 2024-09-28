import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

declare let paypal: any;

@Component({
  selector: 'app-paypal',
  standalone: true,
  template: '<div id="paypal-button-container"></div>',
})
export class PayPalComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: async (data: any, actions: any) => {
          const order = await firstValueFrom(
            this.httpClient.post<{ id: string }>('/api/orders/paypal', {})
          );
          return order.id;
        },
        onApprove: async (data: Partial<{ orderID: string }>) => {
          this.httpClient
            .post<{ orderId: String; paypalOrderId: String }>('/api/payments', {
              orderID: data.orderID,
            })
            .subscribe({
              next: (response) => {
                this.router.navigate(['/orders', response.orderId], {
                  onSameUrlNavigation: 'reload',
                });
              },
            });
        },
      })
      .render('#paypal-button-container');
  }
}
