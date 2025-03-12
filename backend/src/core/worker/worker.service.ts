import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class WorkerService {
  constructor() {}

  // Cron job to make an API call every 5 minutes
  @Cron("*/5 * * * *")
  handleCron(): void {
    console.log("Runs every 5 minutes");
  }
}
