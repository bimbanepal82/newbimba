# How to Upload Photos to Your Website

This guide shows you exactly how to add project photos to your BIMBA Nepal website.

## Step 1: Choose Your Photos

- Use JPG, PNG, or WebP format (smaller file sizes are better for web)
- Recommended size: **1200px × 800px** (wide photos work best)
- Keep file size under 500KB per photos

## Step 2: Organize Photos by Project

Create one folder per project inside this path:

```
dist/assets/projects/
```

**Folder names (use these exactly):**

- `women-wellbeing-bhimdhunga/`
- `health-longevity-service-mathatirtha/`
- `emergency-response-bidur-trishuli/`

Example structure:

```
dist/
└── assets/
    └── projects/
        ├── women-wellbeing-bhimdhunga/
        │   ├── photo1.jpg
        │   ├── photo2.jpg
        │   └── photo3.jpg
        ├── health-longevity-service-mathatirtha/
        │   ├── clinic1.jpg
        │   └── checkup1.jpg
        └── emergency-response-bidur-trishuli/
            ├── response1.jpg
            └── response2.jpg
```

## Step 3: Upload Photos to GitHub

**Option A: Using GitHub Web Interface (Easiest)**

1. Go to your repository: https://github.com/bimbanepal82/newbimba
2. Click on the `dist` folder
3. Click on the `assets` folder
4. Click on the `projects` folder
5. Click on the project folder (e.g., `women-wellbeing-bhimdhunga`)
6. Click the **Add file** button → **Upload files**
7. Drag and drop your photos or click to select them
8. Click **Commit changes** (add a message like "Add Bhimdhunga project photos")
9. Done! The photo is now in the repository

**Option B: Using Command Line (For developers)**

```bash
# Clone the repo (if you haven't already)
git clone https://github.com/bimbanepal82/newbimba.git
cd newbimba

# Create the project photo folder if it doesn't exist
mkdir -p dist/assets/projects/women-wellbeing-bhimdhunga

# Add your photos to the folder
cp /path/to/your/photo1.jpg dist/assets/projects/women-wellbeing-bhimdhunga/
cp /path/to/your/photo2.jpg dist/assets/projects/women-wellbeing-bhimdhunga/

# Commit and push
git add dist/assets/projects/
git commit -m "Add Women Wellbeing Bhimdhunga photos"
git push origin main
```

## Step 4: Show Photos on Your Website

Once photos are uploaded, you need to tell the website where they are.

### For the Photo Gallery Page

Edit: `dist/projects/gallery.html`

Find this section:

```html
<img
  src="../assets/projects/women-wellbeing-bhimdhunga/placeholder.svg"
  alt="Women Wellbeing Bhimdhunga project photo placeholder"
/>
```

Replace it with your photo:

```html
<img
  src="../assets/projects/women-wellbeing-bhimdhunga/photo1.jpg"
  alt="Women Wellbeing clinic in Bhimdhunga"
/>
```

### For Individual Project Pages

Example: `dist/projects/women-wellbeing-bhimdhunga/index.html`

Add photos like this:

```html
<section class="project-photos">
  <h2>Project Photos</h2>
  <div class="photo-grid">
    <img
      src="../../assets/projects/women-wellbeing-bhimdhunga/photo1.jpg"
      alt="Community gathering at Bhimdhunga"
    />
    <img
      src="../../assets/projects/women-wellbeing-bhimdhunga/photo2.jpg"
      alt="Health screening session"
    />
    <img
      src="../../assets/projects/women-wellbeing-bhimdhunga/photo3.jpg"
      alt="Doctor consultation with patient"
    />
  </div>
</section>
```

## Step 5: Publish Your Changes

1. After editing the HTML file, commit and push:

   ```bash
   git add dist/projects/
   git commit -m "Update gallery with real project photos"
   git push origin main
   ```

2. GitHub Pages will automatically update within 1-2 minutes
3. View your site at: https://bimbanepal82.github.io/newbimba/

## Photo File Naming Tips

Use clear, descriptive names:

- ✅ `bhimdhunga-clinic-1.jpg`
- ✅ `health-checkup-older-woman.jpg`
- ✅ `emergency-response-community.jpg`
- ❌ `photo1.jpg` (too vague)
- ❌ `IMG_2024.jpg` (not descriptive)

## File Paths Reference

Remember the path structure for linking photos:

**From gallery.html (in `dist/projects/`):**

```
../assets/projects/[PROJECT-FOLDER]/[PHOTO-FILE]
```

**From individual project pages (in `dist/projects/[PROJECT-FOLDER]/`):**

```
../../assets/projects/[PROJECT-FOLDER]/[PHOTO-FILE]
```

## Example: Complete Upload & Display

1. **Upload photo:**
   - Go to GitHub → `dist/assets/projects/women-wellbeing-bhimdhunga/`
   - Upload `clinic-opening.jpg`

2. **Edit gallery.html:**
   - Find the placeholder image for Women Wellbeing
   - Replace `placeholder.svg` with `clinic-opening.jpg`

3. **Commit:**
   - Message: "Add Women Wellbeing clinic photo"

4. **Publish:**
   - Wait 1-2 minutes
   - Check: https://bimbanepal82.github.io/newbimba/projects/gallery.html

That's it! Your photo is now live on the website.

## Need Help?

If you have questions:

- Check the gallery page: https://github.com/bimbanepal82/newbimba/blob/main/dist/projects/gallery.html
- Check the project structure: https://github.com/bimbanepal82/newbimba/tree/main/dist/assets/projects
