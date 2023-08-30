import amqp from "amqplib";

interface PublisherOptions {
  exchangeName: string;
  routingKey: string;
  queueName: string;
  exchangeType: string;
}

export class Publisher<T> {
  constructor(public conn: amqp.Connection, public options: PublisherOptions) {}

  async publish(event: T): Promise<void> {
    const ch = await this.conn.createChannel();

    await ch.assertExchange(
      this.options.exchangeName,
      this.options.exchangeType,
      {
        durable: true,
      }
    );

    await ch.assertQueue(this.options.queueName, {
      exclusive: false,
      durable: true,
    });

    ch.publish(
      this.options.exchangeName,
      this.options.routingKey,
      Buffer.from(JSON.stringify(event))
    );

    console.log(`[x] Sent ${Buffer.from(JSON.stringify(event))}`);
  }
}
