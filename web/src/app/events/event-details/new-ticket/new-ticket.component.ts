import { Component, inject, output, signal } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Error } from '../../../shared/error/error.component';
import { Ticket, TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [CardComponent, FormsModule, InputComponent],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css',
})
export class NewTicketComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ticketsService = inject(TicketsService);

  price = signal('');
  file = signal<File | undefined>(undefined);

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.file.set(file);
  }

  onSubmit() {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (!eventId) {
      return;
    }

    this.ticketsService
      .createTicket(eventId, this.price(), this.file()!)
      .subscribe({
        next: (ticket) => {
          this.ticketsService.getTickets(eventId).subscribe();
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (error) => {
          const errors: Error[] = error?.error?.errors || [];
          console.log(errors);
        },
      });
  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
