import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ITicketApiService } from "../../integrations/iticket-api/iticket-api.service";
import {sleep} from "../../common/helper";

@Injectable()
export class WorkerService {
  constructor(private iTicketApiService: ITicketApiService) {}

  // Cron job to make an API call every 1 hour
  @Cron("0 * * * *")
  async handleCron(): Promise<void> {
    console.log("Cron -> Runs every 1 hour to parse iTickets");

    let page: number = 1;
    const limit: number = 25;
    let finished: boolean = false;

    do {
      try {
        console.log(`Start to parse events (page ${page})`);

        const eventsRes = await this.iTicketApiService.events(page);
        if (eventsRes !== null) {
          finished = !eventsRes.response.events.next_page_url;
          page++;

          // save events to db
          // const events = eventsRes.response.events.data;
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
  }
}
