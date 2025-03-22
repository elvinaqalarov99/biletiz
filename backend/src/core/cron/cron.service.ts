import { Injectable } from "@nestjs/common";

import { Cron } from "@nestjs/schedule";

import { IticketService } from "../queue/iticket/iticket.service";

@Injectable()
export class CronService {
  constructor(private iticketService: IticketService) {}

  @Cron("* * * * *")
  async scheduleIticketParse(): Promise<void> {
    console.log("Adding Parsing iticket job to the queue...");
    await this.iticketService.addIticketJob();
  }
}
