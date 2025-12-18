# Google Analytics Setup Guide

This guide explains how to set up Google Analytics 4 (GA4) for the Cloud Native Maturity Assessment tool.

## Prerequisites

- A Google Analytics account
- Access to Google Analytics 4 (GA4)
- Administrative access to the project environment variables

## Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon) in the bottom left
4. Under **Property**, click **Create Property**
5. Choose **GA4** (Google Analytics 4)
6. Fill in your property details:
   - **Property name**: `Cloud Native Assessment Tool`
   - **Country/Territory**: Select your country
   - **Currency**: Select your currency
7. Click **Next** and complete the setup wizard

## Step 2: Get Your Measurement ID

1. In Google Analytics, go to **Admin** → **Property** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website details:
   - **Website URL**: Your domain (e.g., `https://assessment.yourdomain.com`)
   - **Stream name**: `Assessment Tool Web Stream`
4. Click **Create stream**
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 3: Configure Environment Variables

Add the following environment variable to your project:

```bash
# In your .env file or environment configuration
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 2.

### For Development
```bash
# .env.local
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### For Production
Add the environment variable to your production deployment platform:

**Vercel:**
```bash
vercel env add VITE_GOOGLE_ANALYTICS_ID
```

**Netlify:**
Add in Site Settings → Environment variables

**AWS/Docker:**
Add to your environment configuration or docker-compose.yml

## Step 4: Verify Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser's developer tools (F12)
3. Go to the **Console** tab
4. Look for Google Analytics initialization messages
5. In **Network** tab, verify that requests to `google-analytics.com` are being made

## Step 5: Test Analytics Events

The application automatically tracks:

### Page Views
- Automatically tracked on page navigation
- Includes page title and URL

### Assessment Events
- **Assessment Started**: When user begins an assessment
- **Question Answered**: Each question response
- **Assessment Completed**: When assessment is finished
- **Knowledge Resource Viewed**: When users click on learning resources
- **Language Changed**: When users switch languages

### Example Events You'll See in GA4:
```
Event Name: assessment_started
Parameters:
  - assessment_type: "comprehensive"
  - language: "en"
  - timestamp: "2024-01-15T10:30:00Z"

Event Name: knowledge_resource_viewed
Parameters:
  - resource_url: "https://kubernetes.io/docs/concepts/"
  - category_id: "container_infrastructure"
  - language: "ja"
```

## Step 6: Set Up Goals and Conversions

1. In Google Analytics, go to **Events**
2. Mark important events as conversions:
   - `assessment_completed` - Primary conversion
   - `knowledge_resource_viewed` - Engagement metric
   - `assessment_shared` - Sharing/viral metric

## Privacy and GDPR Compliance

### Built-in Privacy Features:
- ✅ **IP Anonymization**: Automatically enabled
- ✅ **Consent Mode**: Ready for cookie consent banners
- ✅ **Data Retention**: Configurable in GA4 settings
- ✅ **User Deletion**: Supports data deletion requests

### To Disable Analytics:
Users can disable analytics by:
1. Using browser Do Not Track settings
2. Blocking analytics domains in their browser
3. Custom consent management (if implemented)

### For GDPR Compliance:
Add a cookie consent banner if required by your region:
```javascript
// Example: Disable analytics until consent
if (!userHasGivenConsent) {
  disableAnalytics();
}
```

## Troubleshooting

### Common Issues:

**Analytics not working in development:**
- Ensure `VITE_GOOGLE_ANALYTICS_ID` is set correctly
- Check browser console for errors
- Verify the Measurement ID format (`G-XXXXXXXXXX`)

**No events showing in GA4:**
- GA4 can take 24-48 hours to show data
- Use **DebugView** in GA4 for real-time testing
- Check that events are being sent in browser network tab

**TypeScript errors:**
```bash
# Install types if needed
npm install --save-dev @types/gtag
```

### Debug Mode:
In development, analytics runs in debug mode automatically:
- Console logs show all tracked events
- Test mode prevents data from affecting your production analytics

## Analytics Dashboard

### Key Metrics to Monitor:
1. **Assessment Completion Rate**: `assessment_completed` / `assessment_started`
2. **Knowledge Resource Engagement**: `knowledge_resource_viewed` events
3. **Language Distribution**: User language preferences
4. **Category Performance**: Which assessment categories get most engagement
5. **Resource Effectiveness**: Which knowledge resources are most popular

### Recommended Reports:
- **Funnel Analysis**: Start → Progress → Completion
- **Content Performance**: Most viewed knowledge resources
- **User Journey**: How users navigate the assessment
- **Language Analysis**: Usage by language preference

## Security Notes

- ✅ Measurement ID is safe to expose in client-side code
- ✅ No sensitive data is tracked by default
- ✅ User IDs are automatically anonymized
- ✅ PII (Personally Identifiable Information) is not collected

## Support

For additional help:
- [Google Analytics Help Center](https://support.google.com/analytics/)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- Project maintainers for implementation-specific questions 