# Vista Educare — Frontend Source Code

**Repository for backend integration (PHP/CMS)**

This repository contains the full Astro frontend for Vista Educare. It is designed to be easily integrated with a PHP backend/CMS so that the **Courses** and **Gallery** sections can be managed dynamically by an admin.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.

3. **Build for Production**
   ```bash
   npm run build
   ```
   *Note: The `astro.config.mjs` is configured to output the production build to the `output/` directory.*

---

## 🛠️ PHP Integration Guide (CMS Handoff)

Astro allows you to fetch data directly in the frontmatter (`---` block) of any page. However, there is a **crucial** concept you must understand before integrating your API.

### ⚠️ IMPORTANT: Static vs Dynamic Rendering
By default, Astro is a **Static Site Generator (SSG)**. This means any `fetch()` call you put inside the `---` block runs **ONLY AT BUILD TIME**. 
If your client adds a new image in the PHP CMS, the website will **not** show it until you run `npm run build` again.

You have 3 options to solve this:
1. **The Webhook Route (Recommended for Speed):** Keep it SSG. Whenever the admin saves a change in your PHP CMS, configure your CMS to send a webhook to your deployment server (e.g. GitHub Actions, Vercel) to trigger a new build.
2. **The Client-Side Route:** Remove the data-fetching from the Astro frontmatter (`---`) and fetch the data dynamically using standard JavaScript `fetch()` inside a `<script>` tag at the bottom of the page, rendering the DOM elements with JS.
3. **The SSR Route:** Change Astro to Server-Side Rendered mode. This requires a Node.js server to run (it won't just be static files). You would add `output: 'server'` to `astro.config.mjs` and install the `@astrojs/node` adapter.

---

### 1. Dynamic Courses (`src/pages/courses.astro`)

Currently, courses are hardcoded on **line 5**:
```javascript
const courses = [
  { id: 1, title: 'Adv. Diploma...', duration: '12 Months', eligibility: '10th', icon: 'military_tech', color: 'red', category: 'diploma', popular: true },
  // ...
];
```

**How to integrate (SSG method):**
Replace the `courses` array with a fetch call to your PHP backend:
```javascript
// Example: src/pages/courses.astro
const response = await fetch('https://your-php-backend.com/api/courses');
const courses = await response.json();
```
*Note the expected object properties (`title`, `duration`, `eligibility`, `icon`, `color`, `category`) that the UI needs to render the cards.*

### 2. Dynamic Gallery (`src/pages/gallery.astro`)

Currently, images are loaded from the local filesystem on **line 6**:
```javascript
const images = import.meta.glob('../assets/gallery/*.webp', { eager: true });
const imageAssets = Object.values(images).map((img: any) => img.default);
```

**How to integrate:**
Replace the local file import with an API call returning image URLs from your CMS:
```javascript
// Example: src/pages/gallery.astro
const response = await fetch('https://your-php-backend.com/api/gallery');
const imageAssets = await response.json();
// Ensure the API returns an array of objects with a 'src' property, e.g., [{ src: 'https://...' }]
```

### 3. Homepage Integrations (`src/pages/index.astro`)

The homepage has two areas that need to be made dynamic:

**A. Gallery Slider (Line 9)**
Similar to the gallery page, this currently loads local webp images.
```javascript
const response = await fetch('https://your-php-backend.com/api/gallery');
const galleryAssets = await response.json();
```

**B. Featured Courses (Line 172)**
There is a hardcoded array of 6 featured courses inside the HTML template. 
```javascript
// Fetch this at the top of the file in the --- block:
const featuredResponse = await fetch('https://your-php-backend.com/api/courses?featured=true');
const featuredCourses = await featuredResponse.json();
```
Then, update the `.map()` loop around line 179 to iterate over `featuredCourses` instead of the hardcoded array.

### 4. Form Submissions (Contact & Franchise)

Both `src/pages/contact.astro` and `src/pages/franchise.astro` currently have dummy JavaScript submit validators that prevent the default action.

**How to integrate:**
1. Update the `<form>` tags to include `action="https://your-php-backend.com/api/submit"` and `method="POST"`.
2. Ensure you add `name` attributes to all `<input>`, `<select>`, and `<textarea>` fields.
3. Remove or rewrite the `<script>` blocks at the bottom of both files to process the AJAX request instead of the dummy success message.

---

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: Tailwind CSS v4
- **Icons**: Google Material Symbols
- **Fonts**: Inter, Poppins (Google Fonts)
