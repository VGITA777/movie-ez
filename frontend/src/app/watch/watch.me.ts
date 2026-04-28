import { Component } from '@angular/core';
import { z } from 'zod';
import { MEDIA_TYPES } from '@shared/models';

export const watchPageQueryParams = z.object({
  type: z.enum(MEDIA_TYPES).readonly(),
  id: z.string().readonly(),
});

@Component({
  selector: 'me-watch',
  imports: [],
  templateUrl: './watch.me.html',
  styleUrl: './watch.me.css',
})
export class WatchMe {
  /* TODO: Implement all data fetching using resolvers */
}
