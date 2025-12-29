# Cloud Native Maturity Assessment Tool

A comprehensive assessment tool for evaluating an organization's cloud native adoption maturity.

## Overview

This repository contains the source code for a Cloud Native Maturity Assessment Tool. This document explains the steps to run the application on AWS Elastic Container Service (ECS).

## Project Structure

- **Server-side**: Node.js + Express.js
- **Client-side**: React + TypeScript
- **Database**: in-memory storage OR PostgreSQL
- **AI Features**: OpenAI API OR Anthropic API

## Features

- Multiple assessment types (Quick, Standard, Comprehensive)
- Multi-language support (English, Japanese)
- Interactive questionnaires
- Detailed score breakdown by category
- Personalized recommendations based on assessment results
- Results persistence through S3

## Browser Support

The Cloud Native Maturity Assessment tool is designed to work on modern browsers. We recommend using the latest versions of:

- Chrome
- Firefox
- Safari
- Edge

The application requires JavaScript to be enabled and uses modern web features including:

- CSS Grid and Flexbox
- Local Storage for saving progress
- Fetch API for network requests

### Known Limitations

- Internet Explorer is not supported
- Legacy browsers may experience reduced functionality
- The application is responsive but optimized for desktop experience

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS account (for S3 storage)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your AWS credentials and other configuration.

4. Start the development server:

   ```bash
   npm run dev
   ```

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
