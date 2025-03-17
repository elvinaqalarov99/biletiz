import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IITicketApiService } from "./interfaces/iticket-api.interface";

@Injectable()
export class ITicketApiService {
  private readonly baseUrl = "https://api.iticket.az/en/v5/{type}?client=web";

  constructor(private readonly httpService: HttpService) {}

  private async fetch(
    type: string,
    isPagination: boolean = false,
    page: number = 1,
  ): Promise<IITicketApiService | null> {
    try {
      const url =
        `${this.baseUrl}${isPagination ? "&page=" + page : ""}`.replace(
          "{type}",
          type,
        );
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data as IITicketApiService;

      if (data.status !== 200) {
        console.error(`Error occurred while trying to fetch ${type} ->`, data);
        throw new Error(
          `Error occurred while trying to fetch data -> ${data.response}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`Error occurred while trying to fetch ${type} ->`, error);
    }

    return null;
  }

  public async events(page: number = 1): Promise<IITicketApiService | null> {
    return await this.fetch("events", true, page);
  }

  public async categories(): Promise<IITicketApiService | null> {
    return await this.fetch("categories");
  }
}
