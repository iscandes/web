# Deployment Guide

This Next.js application is configured for deployment on various hosting platforms. Choose the deployment method that best fits your needs.

## Environment Variables

Before deploying, ensure you have the following environment variables configured:

```env
NODE_ENV=production
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
JWT_SECRET=your-jwt-secret-key
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. Clone the repository
2. Copy `.env.local` to `.env` and update the values
3. Run the application:

```bash
docker-compose up -d
```

This will start both the application and a MySQL database.

### Using Docker Only

1. Build the Docker image:

```bash
docker build -t my-nextjs-app .
```

2. Run the container:

```bash
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_NAME=your-db-name \
  -e DB_PORT=3306 \
  -e JWT_SECRET=your-jwt-secret \
  my-nextjs-app
```

## VPS/Dedicated Server Deployment

### Prerequisites

- Node.js 18 or higher
- MySQL database
- PM2 (for process management)

### Steps

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-project-directory>
```

2. Install dependencies:

```bash
npm ci
```

3. Create `.env.local` file with your environment variables

4. Build the application:

```bash
npm run build
```

5. Install PM2 globally:

```bash
npm install -g pm2
```

6. Start the application with PM2:

```bash
pm2 start npm --name "my-nextjs-app" -- start
```

7. Save PM2 configuration:

```bash
pm2 save
pm2 startup
```

## NGINX Configuration

Create an NGINX configuration file for reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Setup

### MySQL

1. Create a database:

```sql
CREATE DATABASE your_database_name;
```

2. Create a user and grant permissions:

```sql
CREATE USER 'your_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_user'@'%';
FLUSH PRIVILEGES;
```

3. Run database migrations (if applicable):

```bash
npm run db:migrate
```

## SSL Certificate (Production)

For production deployments, use Let's Encrypt with Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Logs

### PM2 Monitoring

```bash
pm2 monit
pm2 logs my-nextjs-app
```

### Docker Logs

```bash
docker-compose logs -f app
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in docker-compose.yml or stop the conflicting service
2. **Database connection failed**: Verify database credentials and network connectivity
3. **Build failures**: Check Node.js version and clear npm cache

### Health Check

The application should be accessible at:
- Local: http://localhost:3000
- Production: http://your-domain.com

## Performance Optimization

1. Enable GZIP compression in NGINX
2. Configure proper caching headers
3. Use a CDN for static assets
4. Monitor application performance with tools like New Relic or DataDog

## Security Considerations

1. Use strong JWT secrets
2. Keep dependencies updated
3. Configure firewall rules
4. Use HTTPS in production
5. Regularly backup your database