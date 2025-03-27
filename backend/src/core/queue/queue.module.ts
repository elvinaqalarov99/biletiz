import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IticketService } from './iticket/iticket.service';
import { IticketProcessor } from './iticket/iticket.processor';
import { getBaseTypeOrmFeature } from 'src/common/helper';
import { ITicketApiModule } from 'src/integrations/iticket-api/iticket-api.module';
import { CategoryModule } from 'src/modules/categories/category.module';
import { VenueModule } from 'src/modules/venues/venue.module';
import { EventModule } from 'src/modules/events/event.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { UserModule } from 'src/modules/users/user.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    getBaseTypeOrmFeature(),
    ITicketApiModule,
    CategoryModule,
    VenueModule,
    EventModule,
    UserModule,
    GatewayModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'iticket-queue',
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'iticket-queue',
      adapter: BullAdapter,
    }),
  ],
  providers: [IticketProcessor, IticketService],
  exports: [IticketService],
})
export class QueueModule {}
