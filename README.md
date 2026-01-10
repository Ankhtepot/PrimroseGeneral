# Primrose Administration Panel

This project provides an administration interface for the Primrose system, built with React, TypeScript, and Vite.

## Setup

### Environment Variables

The application requires certain environment variables to function correctly.
1. Create a `.env` file in the root directory.
2. Use `.example.env` as a template for the required variables.
3. Fill in the actual values (e.g., `VITE_API_URL`, `VITE_HEALTHCHECK_TOKEN`).

### Development

To start the development server:
```bash
npm install
npm run dev
```

To deploy on GitHub-Pages
```bash
npm run deploy
```

## Debugging

The project includes pre-configured debug settings in the `.run` directory for IDEs that support them (like JetBrains IDEs).
- It is recommended to run the **Compound** configuration (e.g., "Compound Debug") to debug both the frontend and any associated services simultaneously.
- Individual configurations for `npm dev` and `JS Debug` are also available if needed.
