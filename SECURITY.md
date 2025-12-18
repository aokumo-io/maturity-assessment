# Security Policy

## Supported Versions

This project is currently under active development. The latest stable release (the default branch) receives security updates.

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not open a public issue**.

Instead, contact the maintainers privately:

- Email: `opensource@aokumo.io`

Please include the following information:
- A description of the vulnerability.
- Steps to reproduce.
- Any potential impact you have identified.

We will acknowledge receipt as soon as possible and work with you to validate and address the issue.

## Best Practices for Deployers

- Always store secrets (API keys, database URLs) in a secure secrets manager or environment variables.
- Restrict network access to the application and database using security groups / firewalls.
- Keep all dependencies and the runtime (Node.js, OS) up to date.
- Configure logging and monitoring to detect unusual behavior.


