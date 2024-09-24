import { Routes } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { NewEventComponent } from './events/new-event/new-event.component';
import { NewTicketComponent } from './events/event-details/new-ticket/new-ticket.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order/order.component';
import { LandingComponent } from './landing/landing.component';
import { StartComponent } from './auth/start/start.component';
import { ProfileComponent } from './profile/profile.component';
import { EventDetailsComponent } from './events/event-details/event-details.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingComponent },
  { path: 'start', component: StartComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/new', component: NewEventComponent },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
    children: [{ path: 'new-ticket', component: NewTicketComponent }],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    children: [{ path: ':id', component: OrderComponent }],
  },
];
