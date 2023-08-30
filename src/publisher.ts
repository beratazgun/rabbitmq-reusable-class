import { Publisher } from "./class/Publisher";

import amqp from "amqplib";

interface OnMessageInterface {
  message: string;
}

amqp.connect("amqp://guest:guest@localhost:5672").then((conn) => {
  new Publisher<OnMessageInterface>(conn, {
    exchangeName: "test1",
    exchangeType: "direct",
    queueName: "test1",
    routingKey: "test1",
  }).publish({ message: "Hello World from publisher1" });

  new Publisher(conn, {
    exchangeName: "test2",
    exchangeType: "direct",
    queueName: "test2",
    routingKey: "test2",
  }).publish({ message: "Hello World from publisher2" });
});
