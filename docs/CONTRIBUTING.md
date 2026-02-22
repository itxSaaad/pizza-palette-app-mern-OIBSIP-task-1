# Contributing Guide

Thank you for considering contributing to Pizza Palette! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pizza-palette-app-mern-OIBSIP-task-1.git
   cd pizza-palette-app-mern-OIBSIP-task-1
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   cd client && npm install
   ```

5. **Set up environment**:
   - Copy `.env.example` to `.env`
   - Configure environment variables
   - Seed database: `npm run seed`

### Development Setup

1. **Start development servers**:
   ```bash
   npm run dev
   ```

2. **Verify setup**:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

---

## Development Workflow

### Branch Strategy

We follow a simplified Git workflow:

```
main (production)
  ├── feature/feature-name
  ├── fix/bug-name
  ├── docs/documentation-update
  └── refactor/code-improvement
```

### Creating a Branch

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

4. **Commit your work**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add email verification
fix(cart): resolve quantity update bug
docs(readme): update installation instructions
refactor(controllers): extract helper functions
test(api): add order endpoint tests
```

---

## Code Style

### General Principles

- Write clean, readable, self-documenting code
- Follow DRY (Don't Repeat Yourself)
- Use meaningful variable and function names
- Keep functions small and focused
- Comment complex logic, not obvious code

### JavaScript/Node.js Style

#### ES6+ Features
```javascript
// ✅ Good - Use const/let
const userName = 'John';
let counter = 0;

// ❌ Bad - Don't use var
var userName = 'John';
```

#### Arrow Functions
```javascript
// ✅ Good - Use arrow functions for callbacks
const users = await User.find().map(user => user.name);

// ✅ Also good - Regular functions for methods
const userSchema = new Schema({
  // ...
});
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};
```

#### Async/Await
```javascript
// ✅ Good - Use async/await
const getUser = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw ApiError.notFound('User', id);
  }
};

// ❌ Bad - Don't use callbacks
const getUser = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) callback(err);
    callback(null, user);
  });
};
```

#### Error Handling
```javascript
// ✅ Good - Use ApiError class
throw ApiError.notFound('Pizza', id);

// ❌ Bad - Generic Error
throw new Error('Pizza not found');
```

### React Style

#### Functional Components
```javascript
// ✅ Good - Functional components with hooks
import { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  
  return <div>{user?.name}</div>;
};

// ❌ Bad - Class components
class UserProfile extends React.Component {
  // ...
}
```

#### Component Structure
```javascript
// ✅ Good - Organized component
import PropTypes from 'prop-types';

// 1. Imports
import { useState } from 'react';
import Button from './Button';

// 2. Component
const MyComponent = ({ title, onSubmit }) => {
  // 3. State and hooks
  const [value, setValue] = useState('');
  
  // 4. Event handlers
  const handleSubmit = () => {
    onSubmit(value);
  };
  
  // 5. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

// 6. PropTypes
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

// 7. Export
export default MyComponent;
```

### File Naming

- **Components:** PascalCase (e.g., `UserProfile.jsx`)
- **Utils:** camelCase (e.g., `errorUtils.js`)
- **Constants:** camelCase (e.g., `orderStatus.js`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.js`)

### Folder Structure

Follow existing structure:
```
client/src/
  ├── components/
  │   ├── layout/
  │   ├── route/
  │   └── ui/
  ├── screens/
  ├── redux/
  ├── constants/
  └── utils/

server/
  ├── controllers/
  ├── routes/
  ├── schemas/
  ├── validators/
  ├── middlewares/
  ├── constants/
  └── utils/
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**:
   ```bash
   # Backend
   cd server && npm test
   
   # Frontend
   cd client && npm test
   ```

3. **Check code style**:
   ```bash
   npm run lint
   ```

4. **Update documentation** if needed

### Submitting PR

1. **Push to your fork**:
   ```bash
   git push origin your-branch
   ```

2. **Create Pull Request** on GitHub:
   - Click "New Pull Request"
   - Select your branch
   - Fill in the template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### PR Review Process

1. **Automated checks** run (if configured)
2. **Code review** by maintainers
3. **Requested changes** addressed
4. **Approval** from maintainer
5. **Merge** to main branch

### After Merge

1. **Delete your branch**:
   ```bash
   git branch -d your-branch
   git push origin --delete your-branch
   ```

2. **Update your fork**:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

---

## Issue Reporting

### Before Creating Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for answers
3. **Verify it's reproducible** in latest version

### Creating an Issue

Use appropriate template:

#### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Firefox]
- Node.js version:
- MongoDB version:

## Additional Context
Any other relevant information
```

#### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Mockups, examples, etc.
```

---

## Testing Requirements

### Backend Tests

All new features must include tests:

```javascript
// Example test
describe('User Controller', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password@123'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });
    
    it('should return validation error for invalid email', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password@123'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

### Frontend Tests

```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage

Aim for:
- Controllers: 80%+
- Utils: 90%+
- Components: 70%+

---

## Documentation Requirements

### Code Documentation

```javascript
/**
 * Retrieves a pizza by ID
 * @param {string} id - Pizza MongoDB ObjectId
 * @returns {Promise<Pizza>} Pizza document
 * @throws {ApiError} If pizza not found
 */
const getPizzaById = async (id) => {
  const pizza = await Pizza.findById(id);
  if (!pizza) {
    throw ApiError.notFound('Pizza', id);
  }
  return pizza;
};
```

### API Documentation

When adding new endpoints, update `docs/API.md`:

```markdown
### POST /api/pizzas

Create a new pizza (Admin only)

**Auth Required:** Yes (Admin)

**Request Body:**
\`\`\`json
{
  "name": "Margherita",
  "price": 12.99,
  "size": "medium"
}
\`\`\`

**Response:** (201 Created)
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Pizza created successfully"
}
\`\`\`
```

### README Updates

Update README.md if:
- New features added
- Installation steps changed
- New dependencies required
- Environment variables added

---

## Getting Help

### Resources

- [Documentation](./README.md)
- [API Reference](./API.md)
- [GitHub Issues](https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1/issues)
- [Discussions](https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1/discussions)

### Contact

- **Email:** saadstudent.cs@gmail.com
- **Twitter:** [@itxSaaad](https://twitter.com/itxSaaad)
- **LinkedIn:** [@itxSaaad](https://www.linkedin.com/in/itxsaaad/)

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in README.md

Thank you for contributing to Pizza Palette! 🍕

---

**Last Updated:** February 22, 2026  
**Version:** 2.0.0
