import { Component, inject, input, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Payment, PaymentService } from './payment.service';
import { OrdersService } from '../../orders.service';
import { style } from '@angular/animations';

declare let paypal: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  template: '<div id="paypal-button-container"></div>',
})
export class PaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);

  orderId = input.required<string>();
  success = output<void>();

  ngOnInit() {
    paypal
      .Buttons({
        style: { disableMaxWidth: true },
        createOrder: async () => {
          const paypalOrder = await firstValueFrom(
            this.paymentService.createPayment(this.orderId())
          );
          return paypalOrder.id;
        },
        onApprove: async (data: Partial<{ orderID: string }>) => {
          this.paymentService
            .capturePayment(this.orderId(), data.orderID!)
            .subscribe({
              next: () => {
                this.success.emit();
              },
            });
        },
      })
      .render('#paypal-button-container');
  }
}
