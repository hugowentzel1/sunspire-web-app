// Queue system for Airtable operations and provisioning

interface QueueJob {
  id: string;
  type: 'airtable' | 'provision';
  data: any;
  priority: number;
  createdAt: Date;
  attempts: number;
  maxAttempts: number;
}

class Queue {
  private jobs: QueueJob[] = [];
  private isProcessing = false;
  private processors: Map<string, (job: QueueJob) => Promise<void>> = new Map();

  constructor() {
    this.startProcessing();
  }

  // Add a job to the queue
  async addJob(type: string, data: any, priority: number = 1): Promise<string> {
    const job: QueueJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as 'airtable' | 'provision',
      data,
      priority,
      createdAt: new Date(),
      attempts: 0,
      maxAttempts: type === 'provision' ? 3 : 5
    };

    this.jobs.push(job);
    this.jobs.sort((a, b) => b.priority - a.priority); // Higher priority first

    return job.id;
  }

  // Register a processor for a job type
  registerProcessor(type: string, processor: (job: QueueJob) => Promise<void>): void {
    this.processors.set(type, processor);
  }

  // Start processing jobs
  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (true) {
      if (this.jobs.length > 0) {
        const job = this.jobs.shift();
        if (job) {
          await this.processJob(job);
        }
      } else {
        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Process a single job
  private async processJob(job: QueueJob): Promise<void> {
    const processor = this.processors.get(job.type);
    if (!processor) {
      console.error(`No processor registered for job type: ${job.type}`);
      return;
    }

    try {
      await processor(job);
      console.log(`Job ${job.id} completed successfully`);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      
      job.attempts++;
      if (job.attempts < job.maxAttempts) {
        // Re-queue with exponential backoff
        const delay = Math.pow(2, job.attempts) * 1000; // 2^attempts seconds
        setTimeout(() => {
          this.jobs.push(job);
        }, delay);
      } else {
        console.error(`Job ${job.id} exceeded max attempts, discarding`);
      }
    }
  }

  // Get queue status
  getStatus(): { totalJobs: number; processing: boolean } {
    return {
      totalJobs: this.jobs.length,
      processing: this.isProcessing
    };
  }
}

// Create global queue instance
export const queue = new Queue();

// Airtable writer processor
queue.registerProcessor('airtable', async (job: QueueJob) => {
  console.log('Processing Airtable job:', job.data);
  
  // Import here to avoid circular dependencies
  const { airtableClient } = await import('./airtable');
  
  if (job.data.type === 'upsert') {
    await airtableClient.upsertRecords([job.data.record]);
  } else if (job.data.type === 'event') {
    await airtableClient.queueRecord(job.data.record);
  }
});

// Provisioner processor (24-hour SLA)
queue.registerProcessor('provision', async (job: QueueJob) => {
  console.log('Processing provision job:', job.data);
  
  const { tenantId, email, plan, previewUrl } = job.data;
  
  try {
    // 1. Create subdomain + SSL
    console.log(`Creating subdomain for tenant ${tenantId}`);
    // TODO: Implement actual subdomain creation
    
    // 2. Apply branding/colors/logo
    console.log(`Applying branding for tenant ${tenantId}`);
    // TODO: Implement branding application
    
    // 3. Issue widget key
    console.log(`Issuing widget key for tenant ${tenantId}`);
    // TODO: Implement widget key generation
    
    // 4. Connect CRM
    console.log(`Connecting CRM for tenant ${tenantId}`);
    // TODO: Implement CRM integration
    
    // 5. Smoke test
    console.log(`Running smoke test for tenant ${tenantId}`);
    // TODO: Implement smoke test
    
    // 6. Send "You're live" email
    console.log(`Sending activation email to ${email}`);
    // TODO: Implement email sending
    
    console.log(`Tenant ${tenantId} provisioned successfully`);
    
  } catch (error) {
    console.error(`Provisioning failed for tenant ${tenantId}:`, error);
    throw error;
  }
});

// Helper functions
export async function queueAirtableJob(type: 'upsert' | 'event', record: any): Promise<string> {
  return queue.addJob('airtable', { type, record }, 1);
}

export async function queueProvisionJob(tenantId: string, email: string, plan: string, previewUrl: string): Promise<string> {
  return queue.addJob('provision', { tenantId, email, plan, previewUrl }, 10); // High priority
}

export function getQueueStatus() {
  return queue.getStatus();
}
