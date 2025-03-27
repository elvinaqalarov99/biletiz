import { Module } from '@nestjs/common';
import { getBaseTypeOrmFeature } from '../../common/helper';
import { ITicketApiService } from './iticket-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [getBaseTypeOrmFeature(), HttpModule],
  providers: [ITicketApiService],
  exports: [ITicketApiService],
})
export class ITicketApiModule {}
