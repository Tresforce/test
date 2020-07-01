import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../../utils/logger';

const connection = new IORedis({ host: 'localhost', port: 6379 });
const queueName = 'ErrorQue';
const winston = logger(module);

const myQueue = new Queue(queueName, { connection });
const worker = new Worker(
  queueName,
  async job => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    await Promise.resolve();
    winston.info(job.data);
  },
  { connection }
);

worker.on('completed', job => {
  winston.info(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  winston.error(`${job.id} has failed with ${err.message}`);
});

export default async function addJobs(): Promise<void> {
  await myQueue.add('myJobName', { foo: 'bar' });
}

void (async function main(): Promise<void> {
  try {
    await addJobs();
  } catch {
    winston.error('something bad has happened');
  }
})();
