# Techbridge University College - Setup Guide

This guide will help you set up the complete Techbridge branding and documentation.

---

## 📋 What You'll Get

After following this guide, your Techbridge repository will have:

✅ Professional README.md with Techbridge branding
✅ Comprehensive CLAUDE.md for AI assistant guidance
✅ Updated color palette (techbridge-* colors)
✅ Proper documentation structure
✅ All references updated from AUCDT to Techbridge

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Copy Files from AUCDT Repository

In your AUCDT repository, I've created these files:
- `techbridge-README.md`
- `techbridge-CLAUDE.md`
- `update-techbridge-branding.sh`

Run this in Git Bash:

```bash
# Go to your AUCDT repository
cd ~/OneDrive/Documents/Downloads/Development/github/aucdt-utilities

# Pull latest changes (to get the new files)
git pull origin claude/review-changes-mk1xczv32jw0958p-6OZCs
# Or if that doesn't work:
git fetch origin
git checkout claude/review-changes-mk1xczv32jw0958p-6OZCs

# Verify the files exist
ls -la techbridge-*.md update-techbridge-branding.sh
```

### Step 2: Run the Branding Update Script

```bash
# Make sure you're in the AUCDT directory
cd ~/OneDrive/Documents/Downloads/Development/github/aucdt-utilities

# Copy the files to where the script expects them
# (They should already be here)

# Navigate to Techbridge repository
cd techbridge-university-college

# Run the branding update script
chmod +x ../update-techbridge-branding.sh
../update-techbridge-branding.sh
```

The script will:
1. ✅ Copy the new README.md and CLAUDE.md
2. ✅ Update all branding references (AUCDT → Techbridge)
3. ✅ Update color palette (academic-* → techbridge-*)
4. ✅ Update package.json metadata
5. ✅ Create backups of all modified files

### Step 3: Review Changes

```bash
# See what changed
git status
git diff

# Review the new files
cat README.md
cat CLAUDE.md
```

### Step 4: Test Everything

```bash
# Install/reinstall dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see your Techbridge application!

### Step 5: Commit Changes

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Update branding to Techbridge University College

- Add professional README.md with Techbridge branding
- Add comprehensive CLAUDE.md for AI assistant guidance
- Update all references from AUCDT to Techbridge
- Update color palette to techbridge-* theme
- Update package.json metadata"

# Push to your repository (if you have a remote)
git push origin master
```

---

## 📦 Manual Setup (If Script Doesn't Work)

### Option 1: Copy Files Manually

```bash
# In AUCDT repository
cd ~/OneDrive/Documents/Downloads/Development/github/aucdt-utilities

# Copy files to Techbridge
cp techbridge-README.md techbridge-university-college/README.md
cp techbridge-CLAUDE.md techbridge-university-college/CLAUDE.md

# Go to Techbridge
cd techbridge-university-college
```

### Option 2: Create Files from This Document

If you can't access the files, I'll provide the content in separate messages.

---

## 🎨 Customization

### Update Color Palette

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'techbridge-navy': '#1e3a5f',     // Dark blue
        'techbridge-blue': '#2563eb',     // Primary blue
        'techbridge-amber': '#f59e0b',    // Accent amber
        'techbridge-gold': '#fbbf24',     // Secondary gold
        'techbridge-slate': '#475569',    // Neutral slate
      }
    }
  }
}
```

### Update Branding in Components

Find and replace in your components:

```typescript
// Old (AUCDT)
className="bg-academic-blue"

// New (Techbridge)
className="bg-techbridge-blue"
```

### Update Footer

In `App.tsx` or your footer component:

```typescript
// Old
<p>&copy; 2025 ThesisAI - African University College of Digital Technologies</p>

// New
<p>&copy; 2026 ThesisAI - Techbridge University College</p>
```

---

## 📚 Documentation Structure

Organize your `docs/` folder:

```
docs/
├── README.md                      # Documentation index
├── ARCHITECTURE.md                # System architecture
├── API.md                         # API documentation
├── DEPLOYMENT.md                  # Deployment guide
├── CONTRIBUTING.md                # Contribution guidelines
├── svg/                           # Technical diagrams
│   ├── architecture.svg
│   ├── data-flow.svg
│   └── components.svg
└── presentation/                  # Presentation materials
    └── overview.svg
```

---

## 🔧 Environment Configuration

Create `.env.local`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Application Settings
VITE_APP_NAME=ThesisAI - Techbridge
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.pdf,.docx,.doc

# Branding
VITE_INSTITUTION_NAME=Techbridge University College
VITE_INSTITUTION_SHORT_NAME=Techbridge
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] README.md exists and shows Techbridge branding
- [ ] CLAUDE.md exists with correct tech stack info
- [ ] Color palette uses `techbridge-*` colors
- [ ] package.json name is "techbridge-frontend"
- [ ] Footer shows "Techbridge University College"
- [ ] `pnpm install` runs without errors
- [ ] `pnpm test` passes all tests
- [ ] `pnpm build` completes successfully
- [ ] `pnpm dev` starts the development server
- [ ] Application displays "Techbridge" branding

---

## 🐛 Troubleshooting

### Script Permission Denied

```bash
chmod +x update-techbridge-branding.sh
./update-techbridge-branding.sh
```

### Files Not Found

The script looks for files in the parent directory. Make sure:
1. You're running the script FROM the techbridge-university-college directory
2. The techbridge-*.md files are in the AUCDT directory (parent)

```bash
# Correct structure:
aucdt-utilities/
├── techbridge-README.md
├── techbridge-CLAUDE.md
├── update-techbridge-branding.sh
└── techbridge-university-college/
    └── (run script here)
```

### sed Command Not Working (Windows)

If you're on Windows and `sed` doesn't work:

1. **Option A**: Use Git Bash (recommended)
2. **Option B**: Install sed for Windows
3. **Option C**: Manually find and replace using your text editor

### Tailwind Colors Not Working

After updating tailwind.config.js:

```bash
# Restart the dev server
pnpm dev
```

---

## 📞 Need Help?

If you encounter issues:

1. Check the backup files (*.backup) to restore if needed
2. Review git diff to see what changed
3. Test incrementally (update one file at a time)
4. Reach out to the development team

---

## 🎯 Next Steps

After setup:

1. **Customize Content**
   - Update README.md with Techbridge-specific features
   - Add Techbridge logo/branding assets
   - Update documentation with your processes

2. **Configure Backend**
   - Set up API endpoints
   - Configure authentication
   - Set up database connections

3. **Deploy**
   - Set up CI/CD pipeline
   - Configure production environment
   - Deploy to hosting platform

4. **Monitor**
   - Set up error tracking
   - Configure analytics
   - Monitor performance

---

**Setup completed? Great! Your Techbridge application is ready for development! 🎉**
