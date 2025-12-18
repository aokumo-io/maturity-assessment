# Health Check Endpoint Implementation Guide

We recommend adding a health check endpoint to monitor the health of your container in AWS ECS.

## Implementation Method

Add the following health check endpoint to the `server/routes.ts` file:

```typescript
// Health check endpoint for AWS ECS
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
```

## Benefits

- Allows ECS to accurately monitor the health of your container
- Improves decision-making for auto-scaling and load balancing
- Supports reliable deployments and failure detection

## Dockerfile Configuration

The following health check configuration has been added to the Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:5001/api/health || exit 1
```

This configuration makes the container send a request to the health check endpoint every 30 seconds, and marks the container as unhealthy if there is no response. 