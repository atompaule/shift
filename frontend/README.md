# Frontend Setup

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [pnpm](https://pnpm.io/) (Package Manager)

## Setup

1. **Install and use Node.js 22.20.0:**

   ```bash
   nvm install 22.20.0
   nvm use 22
   ```

2. **Install pnpm (if not already installed):**

   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`.

## Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```
