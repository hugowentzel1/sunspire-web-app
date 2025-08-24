// Queue implementation for background tasks

interface QueueTask {
  id: string;
  type: string;
  payload: any;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledAt: Date;
}

class TaskQueue {
  private tasks: Map<string, QueueTask> = new Map();
  private processing = false;

  // Add a task to the queue
  async enqueue(type: string, payload: any, options: {
    maxAttempts?: number;
    delay?: number;
  } = {}): Promise<string> {
    const taskId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const task: QueueTask = {
      id: taskId,
      type,
      payload,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: now,
      scheduledAt: new Date(now.getTime() + (options.delay || 0))
    };

    this.tasks.set(taskId, task);
    
    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }

    return taskId;
  }

  // Process tasks in the queue
  private async processQueue(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;

    try {
      while (this.tasks.size > 0) {
        const now = new Date();
        const readyTasks = Array.from(this.tasks.values())
          .filter(task => task.scheduledAt <= now)
          .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

        if (readyTasks.length === 0) {
          // No tasks ready, wait a bit
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        const task = readyTasks[0];
        this.tasks.delete(task.id);

        try {
          await this.executeTask(task);
        } catch (error) {
          console.error(`Task ${task.id} failed:`, error);
          
          task.attempts++;
          if (task.attempts < task.maxAttempts) {
            // Retry with exponential backoff
            const delay = Math.pow(2, task.attempts) * 1000; // 2s, 4s, 8s...
            task.scheduledAt = new Date(Date.now() + delay);
            this.tasks.set(task.id, task);
            console.log(`Retrying task ${task.id} in ${delay}ms (attempt ${task.attempts}/${task.maxAttempts})`);
          } else {
            console.error(`Task ${task.id} failed permanently after ${task.maxAttempts} attempts`);
          }
        }
      }
    } finally {
      this.processing = false;
    }
  }

  // Execute a specific task
  private async executeTask(task: QueueTask): Promise<void> {
    switch (task.type) {
      case 'airtable_write':
        await this.executeAirtableWrite(task.payload);
        break;
      
      case 'provisioner':
        await this.executeProvisioner(task.payload);
        break;
      
      case 'send_email':
        await this.executeSendEmail(task.payload);
        break;
      
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  // Execute Airtable write with throttling
  private async executeAirtableWrite(payload: any): Promise<void> {
    const { airtableClient } = await import('@/lib/airtable');
    await airtableClient.queueRecord(payload);
  }

  // Execute provisioner task (24h SLA)
  private async executeProvisioner(payload: {
    companyHandle: string;
    email: string;
    plan: string;
    sessionId?: string;
  }): Promise<void> {
    console.log(`[PROVISIONER] Starting provisioning for ${payload.companyHandle}`);
    
    // TODO: Implement actual provisioning logic:
    // 1. Create {handle}.out.sunspire.app subdomain
    // 2. Set up SSL certificate
    // 3. Apply branding/colors/logo
    // 4. Issue widget API key
    // 5. Connect CRM (HubSpot/Salesforce/Airtable)
    // 6. Run smoke tests
    // 7. Send "You're live" email
    
    // For now, simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`[PROVISIONER] Completed provisioning for ${payload.companyHandle}`);
    
    // Queue "You're live" email
    await this.enqueue('send_email', {
      to: payload.email,
      template: 'provisioning_complete',
      data: {
        companyHandle: payload.companyHandle,
        subdomain: `${payload.companyHandle}.out.sunspire.app`,
        plan: payload.plan
      }
    });
  }

  // Execute email sending
  private async executeSendEmail(payload: {
    to: string;
    template: string;
    data: any;
  }): Promise<void> {
    console.log(`[EMAIL] Sending ${payload.template} to ${payload.to}`);
    
    // TODO: Implement actual email sending logic
    // For now, just log
    console.log(`[EMAIL] Email sent successfully`);
  }

  // Get queue stats
  getStats(): {
    totalTasks: number;
    readyTasks: number;
    scheduledTasks: number;
    processing: boolean;
  } {
    const now = new Date();
    const allTasks = Array.from(this.tasks.values());
    const readyTasks = allTasks.filter(task => task.scheduledAt <= now);
    const scheduledTasks = allTasks.filter(task => task.scheduledAt > now);

    return {
      totalTasks: allTasks.length,
      readyTasks: readyTasks.length,
      scheduledTasks: scheduledTasks.length,
      processing: this.processing
    };
  }
}

// Export singleton instance
export const taskQueue = new TaskQueue();

// Helper functions
export async function queueAirtableWrite(record: any): Promise<string> {
  return taskQueue.enqueue('airtable_write', record);
}

export async function queueProvisioner(payload: {
  companyHandle: string;
  email: string;
  plan: string;
  sessionId?: string;
}): Promise<string> {
  return taskQueue.enqueue('provisioner', payload, {
    maxAttempts: 5 // Important task, retry more
  });
}

export async function queueEmail(payload: {
  to: string;
  template: string;
  data: any;
}): Promise<string> {
  return taskQueue.enqueue('send_email', payload);
}