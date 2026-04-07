# Deployment Guide - College Feedback System

This guide covers deploying the College Feedback System to various environments.

---

## 📋 Prerequisites

- **Node.js 16+** 
- **npm or yarn**
- **MongoDB** (Local or Atlas Cloud)
- Environment variables configured in `.env`

---

## 🏠 Local Development Deployment

### Step 1: Clone & Install
```bash
git clone <repository-url>
cd college-feedback-system
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/feedback_db
GEMINI_API_KEY=your_key_here
APP_URL=http://localhost:3000
```

### Step 3: Start MongoDB
```bash
# macOS/Linux (if installed via Homebrew)
brew services start mongodb-community

# Windows (if installed as service)
# Or manually run: mongod

# Docker alternative
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Run the Application
```bash
npm run dev
```

Access at: **http://localhost:3000**

---

## ☁️ Production Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Using Express Server (Recommended)
The `server.ts` file handles both development and production:

```bash
# Set environment to production
export NODE_ENV=production  # Linux/macOS
set NODE_ENV=production      # Windows

npm run build
npm start  # Or: node --loader tsx dist/server.js
```

---

## 🚀 Cloud Deployment Options

### Option 1: Google Cloud Run (Recommended for AI Studio)

#### Step 1: Create `Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

#### Step 2: Deploy
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/feedback-system
gcloud run deploy feedback-system \
  --image gcr.io/PROJECT_ID/feedback-system \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=<your_mongodb_uri>,GEMINI_API_KEY=<your_key>
```

### Option 2: Heroku

#### Step 1: Prepare
```bash
heroku login
heroku create feedback-system
```

#### Step 2: Configure Environment
```bash
heroku config:set MONGODB_URI=<your_mongodb_uri>
heroku config:set GEMINI_API_KEY=<your_gemini_key>
heroku config:set APP_URL=https://feedback-system.herokuapp.com
```

#### Step 3: Deploy
```bash
git push heroku main
```

### Option 3: AWS EC2

#### Step 1: Connect via SSH
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

#### Step 2: Install Dependencies
```bash
sudo yum install nodejs npm
sudo yum install mongodb-org-server
```

#### Step 3: Clone & Setup
```bash
git clone <repository-url>
cd college-feedback-system
npm install
```

#### Step 4: Configure PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start npm --name "feedback-system" -- run dev
pm2 save
```

---

## 🗄️ MongoDB Setup for Production

### MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Add IP whitelist (or allow 0.0.0.0/0 for testing)
5. Create database user
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/feedback_db?retryWrites=true&w=majority
   ```
7. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback_db
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB on your server
sudo apt-get install mongodb-org

# Enable and start service
sudo systemctl enable mongod
sudo systemctl start mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/feedback_db
```

---

## 🔐 Security Checklist

- [ ] Use environment variables for all secrets (never hardcode)
- [ ] MongoDB Atlas: Enable IP whitelist (production servers only)
- [ ] HTTPS only in production (use domain with SSL certificate)
- [ ] Update `.env` with production credentials
- [ ] Use strong user passwords in MongoDB
- [ ] Enable MongoDB authentication
- [ ] Hide `.env` file (add to `.gitignore`)
- [ ] Set `NODE_ENV=production` in production

---

## 📊 Monitoring & Logs

### Local Development
Logs print to console automatically.

### Production
```bash
# View PM2 logs
pm2 logs

# View system logs
tail -f /var/log/app.log

# Or use cloud provider logs
# - Google Cloud: Cloud Logging
# - Heroku: heroku logs --tail
# - AWS: CloudWatch
```

---

## 🆘 Troubleshooting Deployment

### MongoDB Connection Failed
```bash
# Test connection
mongosh "mongodb://localhost:27017"

# Check connection string in .env
cat .env | grep MONGODB_URI
```

### Port 3000 Already in Use
```bash
# Check what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Application Won't Start
```bash
# Check logs
npm run dev

# Verify environment variables
echo $MONGODB_URI
echo $GEMINI_API_KEY

# Check Node.js version
node --version  # Should be 16+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `MONGODB_URI` | ✅ Yes | `mongodb://localhost:27017/feedback_db` | Local or Atlas URI |
| `GEMINI_API_KEY` | ✅ Yes | `AIzaSyD...` | From ai.google.dev |
| `APP_URL` | ⚠️ Recommended | `http://localhost:3000` | For redirects & links |
| `NODE_ENV` | Optional | `production` | Auto-set to `development` |

---

## 📞 Support

- Check [README.md](README.md) for general setup
- Review `.env.example` for configuration template
- Verify MongoDB connection: `curl http://localhost:3000/api/health`
