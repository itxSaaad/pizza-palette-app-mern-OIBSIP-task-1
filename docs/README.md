# Pizza Palette Documentation

Welcome to the comprehensive documentation for Pizza Palette - a full-stack MERN pizza ordering application with enterprise-grade features.

## Quick Navigation

### Getting Started
- [Setup Guide](./SETUP.md) - Complete installation and configuration
- [Testing Guide](./TESTING.md) - Test credentials and testing strategies
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production

### Development
- [Architecture](./ARCHITECTURE.md) - System design and data flows
- [API Reference](./API.md) - Complete API documentation
- [Error Handling](./ERROR_HANDLING.md) - Error handling patterns
- [Constants](./CONSTANTS.md) - Constants and enums reference
- [Contributing](./CONTRIBUTING.md) - How to contribute

### Reference
- [Changelog](./CHANGELOG.md) - Version history and changes

---

## Documentation Overview

### [Setup Guide](./SETUP.md)
Complete step-by-step guide to set up the application locally or in production:
- Prerequisites and dependencies
- Environment configuration
- Database setup (MongoDB)
- Stripe payment gateway configuration
- Email service setup
- Running the application

### [API Reference](./API.md)
Comprehensive API documentation with request/response examples:
- Authentication endpoints
- Pizza management endpoints
- Order processing endpoints
- Inventory management endpoints
- Admin endpoints
- Error response formats
- Pagination, filtering, and sorting

### [Architecture](./ARCHITECTURE.md)
System architecture and design patterns:
- Technology stack
- Folder structure
- Database schema
- Authentication flow
- Payment processing flow
- Error handling architecture
- Constants management

### [Error Handling Guide](./ERROR_HANDLING.md)
Enterprise-grade error handling system:
- ApiError class usage
- Error codes reference
- Frontend error handling
- Best practices
- Examples and patterns

### [Constants Reference](./CONSTANTS.md)
Centralized constants documentation:
- Order statuses
- Pizza sizes
- Inventory types
- Payment constants
- User roles
- Error codes
- Keeping constants in sync

### [Testing Guide](./TESTING.md)
Complete testing documentation:
- Test credentials (admin, user accounts)
- Stripe test cards
- API testing examples
- Frontend testing
- Running automated tests
- Test scenarios

### [Deployment Guide](./DEPLOYMENT.md)
Production deployment instructions:
- Vercel deployment (frontend + backend)
- Environment variables
- Database configuration
- Stripe live mode
- Post-deployment checklist
- Monitoring and logging

### [Contributing Guide](./CONTRIBUTING.md)
Guidelines for contributors:
- Development workflow
- Code style conventions
- Pull request process
- Issue reporting
- Testing requirements

### [Changelog](./CHANGELOG.md)
Version history and release notes:
- Feature additions
- Bug fixes
- Breaking changes
- Migration guides

---

## Quick Links

### Essential Guides
- [First Time Setup](./SETUP.md#first-time-setup)
- [Test Credentials](./TESTING.md#test-credentials)
- [API Authentication](./API.md#authentication)
- [Stripe Configuration](./SETUP.md#stripe-setup)

### Common Tasks
- [Running Tests](./TESTING.md#running-tests)
- [Seeding Database](./SETUP.md#seed-database)
- [Environment Variables](./SETUP.md#environment-configuration)
- [Deploying to Vercel](./DEPLOYMENT.md#vercel-deployment)

### Troubleshooting
- [Common Errors](./ERROR_HANDLING.md#common-errors)
- [Database Issues](./SETUP.md#troubleshooting)
- [Payment Issues](./SETUP.md#stripe-payment-fails)
- [Email Issues](./SETUP.md#email-troubleshooting)

---

## Project Structure

```
pizza-palette-app-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── screens/       # Page components
│   │   ├── redux/         # State management
│   │   ├── constants/     # Frontend constants
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── schemas/           # Mongoose models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── validators/        # Input validation
│   ├── constants/         # Backend constants
│   ├── utils/             # Utility functions
│   ├── data/              # Seed data
│   └── package.json
├── docs/                   # This documentation
└── README.md              # Project overview
```

---

## Support

### Getting Help
- Check the relevant documentation section
- Search [existing issues](https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1/issues)
- Create a new issue with detailed information

### Contact
- Email: saadstudent.cs@gmail.com
- Twitter: [@itxSaaad](https://twitter.com/itxSaaad)
- LinkedIn: [@itxSaaad](https://www.linkedin.com/in/itxsaaad/)

---

## License

This project is licensed under the CC0-1.0 License. See the [LICENSE](../LICENSE.md) file for details.

---

**Last Updated:** February 22, 2026  
**Version:** 2.0.0  
**Documentation Status:** Complete
