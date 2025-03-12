import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IITicketApiService } from "./interfaces/iticket-api.interface";

@Injectable()
export class ITicketApiService {
  private readonly baseUrl = "https://api.iticket.az/az/v5/{type}?client=web";

  constructor(private readonly httpService: HttpService) {}

  public async events(page: number = 1): Promise<IITicketApiService | null> {
    try {
      const url = `${this.baseUrl}&page=${page}`.replace("{type}", "events");
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data as IITicketApiService;

      if (data.status !== 200) {
        console.error("Error occurred while trying to fetch events ->", data);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error occurred while trying to fetch events ->", error);
    }

    return null;
  }
}
