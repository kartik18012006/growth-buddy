# Reminder System Implementation Guide

## 📚 Quick Start

This guide walks you through implementing the reminder system in Growth Buddy.

---

## 🛠️ Setup Steps

### 1. Install Dependencies

```bash
npm install node-cron
npm install --save-dev @types/node-cron
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Cron Secret (for securing cron endpoint)
CRON_SECRET=your-random-secret-key

# Email Service (choose one)
# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@growthbuddy.com

# OR Resend
RESEND_API_KEY=your-resend-api-key

# OR AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 3. Initialize Cron Jobs (Development)

In your `app/layout.tsx` or a server startup file, add:

```typescript
// Only in development
if (process.env.NODE_ENV === 'development') {
  import('@/lib/cron').then(({ initializeCronJobs }) => {
    initializeCronJobs();
  });
}
```

**OR** create a separate `server.ts` file:

```typescript
// server.ts
import { initializeCronJobs } from './lib/cron';

initializeCronJobs();
```

Then run: `node server.ts` (alongside `npm run dev`)

---

## 🚀 Production Setup

### Option 1: Vercel Cron (Recommended for Vercel)

1. Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "* * * * *"
    }
  ]
}
```

2. Set `CRON_SECRET` in Vercel environment variables

3. Deploy to Vercel

### Option 2: AWS EventBridge

1. Create EventBridge rule with schedule: `rate(1 minute)`
2. Target: Your API endpoint `/api/cron/reminders`
3. Add authentication header with `CRON_SECRET`

### Option 3: Google Cloud Scheduler

1. Create Cloud Scheduler job
2. Frequency: `* * * * *` (every minute)
3. Target: HTTP POST to `/api/cron/reminders`
4. Add `Authorization: Bearer ${CRON_SECRET}` header

---

## 📧 Email Service Integration

### Using SendGrid

1. Install: `npm install @sendgrid/mail`
2. Update `lib/email-service.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  await sgMail.send({
    to: options.to,
    from: process.env.EMAIL_FROM!,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
  return true;
}
```

### Using Resend

1. Install: `npm install resend`
2. Update `lib/email-service.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
  return true;
}
```

---

## 📝 API Usage Examples

### Create Reminder for Task

```javascript
// POST /api/reminders
{
  "entityType": "task",
  "entityId": "65a1b2c3d4e5f6a7b8c9d0e1",
  "reminderTime": "09:00",
  "daysOfWeek": [1, 2, 3, 4, 5], // Monday to Friday
  "notificationMethod": "email"
}
```

### Create Reminder for Habit

```javascript
// POST /api/reminders
{
  "entityType": "habit",
  "entityId": "65a1b2c3d4e5f6a7b8c9d0f1",
  "reminderTime": "07:00",
  "daysOfWeek": [0, 1, 2, 3, 4, 5, 6], // All days
  "notificationMethod": "both" // Email and push
}
```

### Get All Reminders

```javascript
// GET /api/reminders
// Returns all reminders for current user
```

### Update Reminder

```javascript
// PATCH /api/reminders/[id]
{
  "enabled": false, // Disable reminder
  "reminderTime": "10:00" // Change time
}
```

### Delete Reminder

```javascript
// DELETE /api/reminders/[id]
```

---

## 🔍 Testing

### Test Reminder Creation

```bash
curl -X POST http://localhost:3001/api/reminders \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "entityType": "task",
    "entityId": "YOUR_TASK_ID",
    "reminderTime": "14:00",
    "daysOfWeek": [1,2,3,4,5],
    "notificationMethod": "email"
  }'
```

### Manually Trigger Cron Job

```bash
curl -X GET http://localhost:3001/api/cron/reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 📊 Monitoring

### Logs to Monitor

- Reminder processing frequency
- Email send success/failure
- Errors in reminder scheduler
- Cron job execution

### Metrics to Track

- Number of reminders sent per day
- Email delivery rate
- Reminder effectiveness (user engagement)
- Failed reminder attempts

---

## ⚠️ Important Considerations

1. **Time Zone Handling**: Reminders use user timezone. Make sure timezone is correctly stored and converted.

2. **Duplicate Prevention**: The system prevents duplicate sends by checking `lastSentAt` date.

3. **Error Handling**: Failed email sends don't update `lastSentAt`, allowing retry on next run.

4. **Performance**: For high volume, consider:
   - Queue system (Bull/BullMQ)
   - Batch processing
   - Rate limiting

5. **Cost**: Email services charge per email. Monitor usage.

---

## 🔄 Future Enhancements

- [ ] WebSocket for real-time notifications
- [ ] SMS reminders
- [ ] Push notifications (Web Push API)
- [ ] Reminder templates
- [ ] Smart reminders (ML-based timing)
- [ ] Reminder analytics dashboard
- [ ] Batch notification optimization

---

## 📖 Additional Resources

- [Node-Cron Documentation](https://github.com/node-cron/node-cron)
- [SendGrid API Docs](https://docs.sendgrid.com/api-reference)
- [Resend Documentation](https://resend.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)


