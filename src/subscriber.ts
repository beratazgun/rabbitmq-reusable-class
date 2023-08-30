import { Subscriber } from "./class/Subscriber";
import amqp from "amqplib";

interface OnMessageInterface {
  message: string;
}

amqp.connect("amqp://guest:guest@localhost:5672").then((conn) => {
  new Subscriber<OnMessageInterface>(conn, {
    exchangeName: "test1",
    exchangeType: "direct",
    queueName: "test1",
    routingKey: "test1",
  }).onMessage((msg) => {
    console.log("Subscriber1 --> Message received: ", msg.message);
  });

  new Subscriber<OnMessageInterface>(conn, {
    exchangeName: "test2",
    exchangeType: "direct",
    queueName: "test2",
    routingKey: "test2",
  }).onMessage((msg) => {
    console.log("Subscriber2 --> Message received: ", msg.message);
  });
});
