# Emergency Dispatch System Frontend

This is a React + Vite template for an emergency dispatch system frontend. It displays:

- A list of events
- A list of units
- A map (React Leaflet) showing positions of events and units
- Ready for WebSocket connections for live updates

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

## Features

- Live updates via WebSocket (to be implemented)
- Interactive map using React Leaflet
- Modular React components

## Next Steps

- Connect to backend WebSocket for live data
- Style the UI for usability
- Add authentication if needed

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
