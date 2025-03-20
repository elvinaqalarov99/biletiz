import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class IticketService {
  constructor(@InjectQueue("iticket-queue") private queue: Queue) {}

  async addIticketJob(data: any = {}) {
    await this.queue.add("parse-iticket", data);
  }
}
