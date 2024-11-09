# 🚀 Phantom Starter

The most advanced Express.js starter template, featuring enterprise-grade authentication, authorization, and scalability out of the box.

<div align="center">
  <img src="docs/assets/hero.png" alt="Phantom Starter Logo" width="600px" />

  <p align="center">
    <a href="https://github.com/eliasnau/phantom-starter/actions">
      <img src="https://github.com/eliasnau/phantom-starter/workflows/CI/badge.svg" alt="CI Status" />
    </a>
    <a href="https://github.com/eliasnau/phantom-starter/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/eliasnau/phantom-starter" alt="License" />
    </a>
    <a href="https://github.com/eliasnau/phantom-starter/releases">
      <img src="https://img.shields.io/github/v/release/eliasnau/phantom-starter" alt="Release" />
    </a>
  </p>
</div>

## ✨ Why Phantom?

Phantom is not just another Express.js template – it's a production-ready foundation for building secure, scalable Node.js applications. Built with TypeScript and modern best practices, it provides everything you need to start building enterprise applications immediately.

### 🛡️ Enterprise Security Built-in

- JWT with automatic rotation and refresh tokens
- Session management with device fingerprinting
- Multi-factor authentication (TOTP, Email, Backup codes)
- Rate limiting and brute force protection
- CSRF, XSS, and SQL injection protection
- Password policies with breach detection

### 🎯 Developer Experience First

- TypeScript for type safety
- Prisma ORM with PostgreSQL
- Redis for caching and sessions
- Docker and Docker Compose setup
- GitHub Actions CI/CD
- Comprehensive documentation

### 🔋 Batteries Included

- Role-based access control (RBAC)
- Email verification system
- Password reset flow
- Audit logging
- Health checks
- API documentation

## 🛠️ Quick Start

### Docker Deployment (Recommended)

1. Clone the repository:

```
git clone https://github.com/eliasnau/phantom-starter.git
cd phantom-starter
```

2. Configure environment:

```
cp .env.example .env
# Edit .env with your settings
```

3. Start with Docker Compose:

```
docker compose up -d
```

4. Setup admin user:

```
docker compose exec phantom npm run setup:admin
```

### Manual Development Setup

1. Prerequisites:

- Node.js 20+
- PostgreSQL 15+
- Redis 7+

2. Install dependencies:

```
npm install
```

3. Setup database:

```
npx prisma generate
npx prisma migrate dev
```

4. Start development server:

```
npm run dev
```

## 🚀 Production Deployment

### Automatic Deployment (GitHub Actions)

1. Generate deployment SSH key:

```
# On your local machine
ssh-keygen -t ed25519 -C "deploy@example.com" -f ~/.ssh/deploy_key
# No passphrase (press enter twice)

# Display public key to add to server
cat ~/.ssh/deploy_key.pub

# Display private key to add to GitHub secrets
cat ~/.ssh/deploy_key
```

2. Add the public key to your server:

```
# On your server
echo "your_public_key_here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

3. Add repository secrets in GitHub:

- `DEPLOY_SSH_KEY`: Your private key
- `SERVER_IP`: Your server IP
- `SERVER_USER`: Your server username

4. Push to main branch to trigger deployment

### Manual Production Setup

1. Setup server:

```
curl -o setup-server.sh https://raw.githubusercontent.com/eliasnau/phantom-starter/main/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

2. Configure monitoring:

```
# Edit Discord webhook URL
nano /opt/auth/monitor.sh

# Setup cron job
crontab -e
# Add: */5 * * * * /opt/auth/monitor.sh
```

## 📦 Container Resources

The application uses three optimized containers:

1. **App (Node.js)**

- Memory Limit: 1GB
- Memory Reservation: 512MB

2. **PostgreSQL**

- Memory Limit: 512MB
- Memory Reservation: 256MB

3. **Redis**

- Memory Limit: 256MB
- Memory Reservation: 128MB

## 🔧 Configuration

Phantom is highly configurable through environment variables and config files:

- `src/configs/auth.ts` - Authentication settings
- `src/configs/email.ts` - Email configuration
- `src/configs/security.ts` - Security policies
- `.env` - Environment variables

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Security Guide](docs/security.md)
- [Deployment Guide](docs/deployment.md)
- [Development Guide](docs/development.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

For security issues, please email security@example.com.
