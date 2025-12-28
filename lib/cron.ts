/**
 * Cron Job Setup (Development)
 * 
 * This file sets up cron jobs using node-cron for development.
 * For production, use cloud-based cron services instead.
 */

import cron from 'node-cron';
import { processReminders } from './reminder-scheduler';

/**
 * Setup reminder processing cron job
 * Runs every minute: * * * * *
 */
export function setupReminderCron() {
  // Only run in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_CRON) {
    console.log('Cron jobs disabled in production. Use cloud cron service.');
    return;
  }

  // Process reminders every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Running reminder processing cron job...');
      const result = await processReminders();
      console.log(`Processed ${result.processed} reminders`);
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
  });

  console.log('Reminder cron job scheduled (runs every minute)');
}

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs() {
  setupReminderCron();
  // Add other cron jobs here
}

