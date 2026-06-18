import Bull from "bull";
import { Logger } from "log4js";
import { ComponentManager, IBaseComponent } from "../common/BaseComponent";
import { EComName } from "../common/CComponent";
export class BullComponent implements IBaseComponent {
  // Bull queue instance for managing jobs
  private queue: Bull.Queue;

  // Logger instance for logging messages
  private gameLogger: Logger | Console;

  constructor(
    queueName: string,
    options?: Bull.QueueOptions,
    gameLogger?: Logger
  ) {
    // Initialize the Bull queue with the given name and options
    this.queue = new Bull(queueName, options);

    // Use the provided logger or default to console
    this.gameLogger = gameLogger || console;
  }

  // Add a message to the queue
  async sendMessage<TMessage, TResult>(
    message: TMessage
  ): Promise<Bull.Job<TResult>> {
    let job = await this.queue.add(message);
    return job as Bull.Job<TResult>;
  }

  // Process messages in the queue with a given concurrency level
  //   processMessages(
  //     concurrency: number,
  //     processor: Bull.ProcessCallbackFunction<any>
  //   ): void {
  //     this.queue.process(concurrency, processor);
  //   }

  // Retrieve metrics about the queue's current state
  async getQueueMetrics(): Promise<{
    active: number;
    completed: number;
    failed: number;
  }> {
    const [active, completed, failed] = await Promise.all([
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
    ]);

    return { active, completed, failed };
  }

  // Update the queue options dynamically
  setQueueOptions(options: Bull.QueueOptions): void {
    this.queue = new Bull(this.queue.name, options);
  }

  // Initialize the component (placeholder for additional logic)
  async init() {
    // Initialization logic for BullComponent
  }

  // Start the component and connect to the Redis server
  async start() {}

  // Logic to execute after the component starts (placeholder)
  async afterStart() {
    const sysCfgComp = ComponentManager.instance.getComponent(
      EComName.SysCfgComponent
    );
    const redisOptions = sysCfgComp.redis_global!;
    this.queue = new Bull(this.queue.name, {
      redis: {
        host: redisOptions.host,
        port: redisOptions.port,
        db: redisOptions.db,
      },
    });
    this.gameLogger.log("Bull queue connected to Redis server");
    // Logic to execute after the component starts
  }

  // Stop the component and release resources
  async stop() {
    this.gameLogger.log("Waiting for all message callbacks to complete...");
    await this.queue.close();
    this.gameLogger.log("Bull queue resources released.");
  }

  // Set a mock queue for testing purposes
  setMockqueue(mockQueue: Bull.Queue) {
    this.queue = mockQueue;
  }
}
