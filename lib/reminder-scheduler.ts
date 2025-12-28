/**
 * Reminder Scheduler Service
 * 
 * This service processes reminders and sends notifications.
 * Run this as a cron job (every minute) or background worker.
 */

import connectDB from './db';
import Reminder from '@/models/Reminder';
import Task from '@/models/Task';
import Habit from '@/models/Habit';
import User from '@/models/User';
import { sendReminderEmail } from './email-service';

interface ReminderJob {
  reminder: any;
  entity: any;
  user: any;
}

/**
 * Process reminders that are due to be sent
 */
export async function processReminders() {
  try {
    await connectDB();

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

    // Find all enabled reminders
    const reminders = await Reminder.find({ enabled: true });

    const jobsToProcess: ReminderJob[] = [];

    for (const reminder of reminders) {
      // Check if reminder time matches current time (within 1 minute window)
      const reminderTime = new Date(reminder.reminderTime);
      const reminderHour = reminderTime.getHours();
      const reminderMinute = reminderTime.getMinutes();

      // Check if time matches (allowing 1 minute window)
      const timeMatches =
        reminderHour === currentHour &&
        (reminderMinute === currentMinute || reminderMinute === currentMinute - 1);

      if (!timeMatches) continue;

      // Check if current day of week is in daysOfWeek array
      const daysOfWeek = reminder.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]; // Default to all days
      if (!daysOfWeek.includes(currentDayOfWeek)) continue;

      // Check if already sent today (avoid duplicates)
      if (reminder.lastSentAt) {
        const lastSent = new Date(reminder.lastSentAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastSent.setHours(0, 0, 0, 0);

        if (lastSent.getTime() === today.getTime()) {
          continue; // Already sent today
        }
      }

      // Fetch entity (task or habit)
      let entity;
      if (reminder.entityType === 'task') {
        entity = await Task.findById(reminder.entityId);
      } else if (reminder.entityType === 'habit') {
        entity = await Habit.findById(reminder.entityId);
      }

      if (!entity) {
        console.warn(`Entity not found for reminder ${reminder._id}`);
        continue;
      }

      // Fetch user
      const user = await User.findById(reminder.userId);
      if (!user) {
        console.warn(`User not found for reminder ${reminder._id}`);
        continue;
      }

      jobsToProcess.push({ reminder, entity, user });
    }

    // Process all jobs
    for (const job of jobsToProcess) {
      await processReminderJob(job);
    }

    return { processed: jobsToProcess.length };
  } catch (error) {
    console.error('Error processing reminders:', error);
    throw error;
  }
}

/**
 * Process a single reminder job
 */
async function processReminderJob(job: ReminderJob) {
  const { reminder, entity, user } = job;

  try {
    // Send notification based on method
    if (
      reminder.notificationMethod === 'email' ||
      reminder.notificationMethod === 'both'
    ) {
      await sendEmailNotification(user, entity, reminder);
    }

    if (
      reminder.notificationMethod === 'push' ||
      reminder.notificationMethod === 'both'
    ) {
      await sendPushNotification(user, entity, reminder);
    }

    // Update lastSentAt
    reminder.lastSentAt = new Date();
    await reminder.save();

    console.log(`Reminder sent: ${reminder._id} to user ${user.email}`);
  } catch (error) {
    console.error(`Error processing reminder ${reminder._id}:`, error);
    // Don't update lastSentAt on error, so it retries
  }
}

/**
 * Send email notification
 */
async function sendEmailNotification(
  user: any,
  entity: any,
  reminder: any
) {
  const entityName = reminder.entityType === 'task' 
    ? entity.title 
    : entity.name;

  const reminderTime = new Date(reminder.reminderTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  await sendReminderEmail(
    user.email,
    user.name || 'User',
    entityName,
    reminder.entityType,
    reminderTime
  );
}

/**
 * Send push/in-app notification
 */
async function sendPushNotification(
  user: any,
  entity: any,
  reminder: any
) {
  // This would create an in-app notification record
  // or send a push notification via Web Push API
  
  const entityName = reminder.entityType === 'task' 
    ? entity.title 
    : entity.name;

  // TODO: Create notification record in database
  // Example:
  // await Notification.create({
  //   userId: user._id,
  //   type: 'reminder',
  //   title: `Reminder: ${entityName}`,
  //   message: `This is a reminder for your ${reminder.entityType}`,
  //   link: `/${reminder.entityType}s/${entity._id}`,
  // });

  console.log('Push notification queued for user:', user.email);
  return true;
}

/**
 * Get reminders due in the next N minutes (for testing/preview)
 */
export async function getRemindersDueIn(minutes: number = 60) {
  await connectDB();

  const now = new Date();
  const futureTime = new Date(now.getTime() + minutes * 60 * 1000);

  const reminders = await Reminder.find({
    enabled: true,
    reminderTime: { $gte: now, $lte: futureTime },
  })
    .populate('userId')
    .populate('entityId');

  return reminders;
}

