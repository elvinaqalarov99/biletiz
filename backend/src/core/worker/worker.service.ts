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

@Injectable()
export class WorkerService {
  constructor(
    private iTicketApiService: ITicketApiService,
    private categoryService: CategoryService,
  ) {}

  async parseCategories() {
    try {
      console.log("Start to parse categories");

      const categoriesRes = await this.iTicketApiService.categories();
      if (categoriesRes !== null && categoriesRes.response.length) {
        for (let i = 0; i < categoriesRes.response.length; i++) {
          const category: object = categoriesRes.response[i];
          const updatedCategory: object = keysToCamelCaseDeep(
            removeKey(renameKey(category, "id", "externalId"), "translations"),
          );
          console.log(updatedCategory);
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
          if (eventsRes !== null && eventsRes.response.events.data.length) {
            finished = !eventsRes.response.events.next_page_url;
            page++;

            // save categories to database
          } else {
            console.log(`Events are empty on this page, skipping...!`);
          }
        } catch (error) {
          console.log(
            `Error occurred while trying to fetch events at page ${page}->`,
            error,
          );
        }
        await sleep(1000);
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
    // await this.parseEvents();
  }
}
