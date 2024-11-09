# Contributing to Phantom Starter

First off, thank you for considering contributing to Phantom Starter! It's people like you that make Phantom Starter such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to conduct@codity.net.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

- Fork the repo and create your branch from `main`
- If you've added code that should be tested, add tests
- Ensure the test suite passes
- Make sure your code lints
- Update the documentation

## Development Setup

1. Fork and clone the repository
2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file:

   ```
   cp .env.example .env
   ```

4. Setup the database:

   ```
   npm run setup:db
   ```

5. Run the development server:
   ```
   npm run dev
   ```

## Style Guide

- Use TypeScript
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation for changes

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification

## License

By contributing to Phantom Starter, you agree that your contributions will be licensed under its dual license terms.

Note: Commercial contributions require a Contributor License Agreement (CLA).

## Questions?

Feel free to open an issue or contact us at contribute@codity.net.

Thank you for your contribution! 🚀
