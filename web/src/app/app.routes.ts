import { Routes } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { NewEventComponent } from './events/new-event/new-event.component';
import { NewTicketComponent } from './events/event-details/new-ticket/new-ticket.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { LandingComponent } from './landing/landing.component';
import { StartComponent } from './auth/start/start.component';
import { ProfileComponent } from './profile/profile.component';
import { EventDetailsComponent } from './events/event-details/event-details.component';
import { PrivacyPolicyComponent } from './static/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './static/terms-and-conditions/terms-and-conditions.component';
import { SalesComponent } from './orders/sales/sales.component';
import { AboutUsComponent } from './static/about-us/about-us.component';
import { FrequentlyAskedQuestionsComponent } from './static/frequently-asked-questions/frequently-asked-questions.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingComponent },
  { path: 'start', component: StartComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'orders', pathMatch: 'full', component: OrdersComponent },
      { path: 'orders/:id', component: OrderDetailsComponent },
      { path: 'sales', component: SalesComponent },
    ],
  },
  { path: 'events', component: EventsComponent },
  { path: 'events/new', component: NewEventComponent },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
    children: [{ path: 'new-ticket', component: NewTicketComponent }],
  },
  { path: 'about-us', component: AboutUsComponent },
  {
    path: 'frequently-asked-questions',
    component: FrequentlyAskedQuestionsComponent,
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
];
