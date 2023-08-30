import amqp from "amqplib";

interface SubscriberOptions {
  exchangeName: string;
  routingKey: string;
  queueName: string;
  exchangeType: string;
}

export class Subscriber<T> {
  private onMessageCallback: ((msg: T) => void) | undefined;

  constructor(public conn: amqp.Connection, public options: SubscriberOptions) {
    this.listen();
  }

  listen(): void {
    const { exchangeName, exchangeType, queueName, routingKey } = this.options;

    this.conn.createChannel().then((ch) => {
      ch.assertExchange(exchangeName, exchangeType, {
        durable: true,
      });

      ch.assertQueue(queueName, {
        exclusive: false,
        durable: true,
      });

      ch.bindQueue(queueName, exchangeName, routingKey);

      ch.consume(
        queueName,
        (msg) => {
          if (msg && this.onMessageCallback) {
            this.onMessageCallback(JSON.parse(msg.content.toString()));
          }
        },
        { noAck: true }
      );
    });
  }

  onMessage(callback: (msg: T) => void) {
    this.onMessageCallback = callback;
  }
}
