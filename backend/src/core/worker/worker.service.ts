import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ITicketApiService } from "../../integrations/iticket-api/iticket-api.service";
import {
  keysToCamelCaseDeep,
  removeKey,
  renameKey,
  sleep,
} from "../../common/helper";
import { CategoryService } from "src/modules/categories/category.service";
import { VenueService } from "src/modules/venues/venue.service";
import { EventService } from "src/modules/events/event.service";
import { In } from "typeorm";

@Injectable()
export class WorkerService {
  constructor(
    private iTicketApiService: ITicketApiService,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private eventService: EventService,
  ) {}

  async saveEvents(events: []) {
    console.log("Start to save events to db!");

    if (!events.length) {
      return;
    }

    for (const event of events) {
      let updatedEvent: any = keysToCamelCaseDeep(
        renameKey(event, "id", "externalId"),
      );
      const category = await this.categoryService.findOne({
        externalId: updatedEvent.categoryId,
      });
      const venueIds: number[] = updatedEvent.venues.map((venue) => venue.id);
      const venues = await this.venueService.find({ externalId: In(venueIds) });

      // set relations data, and remove unnecesarry keys
      updatedEvent.category = category;
      updatedEvent.venues = venues;
      updatedEvent = removeKey(updatedEvent, "categoryId");
      updatedEvent = removeKey(updatedEvent, "categorySlug");

      await this.eventService.upsert(updatedEvent);
    }
  }

  async saveVenues(venues: []): Promise<void> {
    console.log("Start to save venues to db!");

    if (!venues.length) {
      return;
    }

    for (const venue of venues) {
      const updatedVenue: object = keysToCamelCaseDeep(
        renameKey(venue, "id", "externalId"),
      );
      await this.venueService.upsert(updatedVenue);
    }
  }

  async parseCategories() {
    try {
      console.log("Start to parse categories!");

      const categoriesRes = await this.iTicketApiService.categories();
      const response = categoriesRes?.response;
      if (response !== null && response.length) {
        for (const category of response) {
          const updatedCategory: object = keysToCamelCaseDeep(
            removeKey(renameKey(category, "id", "externalId"), "translations"),
          );
          await this.categoryService.upsert(updatedCategory);
        }
      } else {
        console.log(`Categories are empty, skipping...!`);
      }
    } catch (error) {
      console.log(`Error occurred while trying to fetch categories->`, error);
    }
  }

  async parseEvents() {
    try {
      let page: number = 1;
      const limit: number = 25;
      let finished: boolean = false;

      do {
        try {
          console.log(`Start to parse events (page ${page})`);

          const eventsRes = await this.iTicketApiService.events(page);
          const response = eventsRes?.response;

          if (response && response.events.data.length) {
            finished = !response.events.next_page_url;

            // save venues to database from first page, no need to save it from all pages
            if (page === 1) {
              await this.saveVenues((response.venues as []) ?? []);
            }

            // save events to database
            await this.saveEvents((response.events.data as []) ?? []);
          } else {
            console.log(`Events are empty on this page, skipping...!`);
          }
        } catch (error) {
          console.log(
            `Error occurred while trying to fetch events at page ${page}->`,
            error,
          );
        }

        page++;

        await sleep(2000);
      } while (!finished && page <= limit);

      console.log(`Finished parsing events at page ${page}`);
    } catch (error) {
      console.log(`Error occurred while trying to fetch categories->`, error);
    }
  }

  // Cron job to make an API call every 1 hour
  @Cron("0 * * * *")
  async handleCron(): Promise<void> {
    console.log("Cron -> Runs every 1 hour to parse iTickets");

    await this.parseCategories();
    await this.parseEvents();
  }
}
