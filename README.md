# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Installing vite 

If you never used vite before, in order to run the UI you have to run npm install 

## Running UI

Enter the frontend directory and then call "npm run dev" in the terminal 

## Running mobile-app 

Install in order if haven't already
1. npm install
2. npm expo install
3. npx expo install expo-router react-native-safe-area-context react-native-screens

command to start expo --> $env:EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1; npx expo start
## Setup Guide

This guide explains how to run the Atelier backend and mobile app on your own computer.

### 1. Backend

```
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in two values:

- `DATABASE_URL`: the shared Supabase connection string. Ask Bradley for it privately. Do not post it in a public channel or commit it.
- `JWT_SECRET`: a random secret of 32 or more characters. Generate one with:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The `.env` file is ignored by git, so it stays on your computer.

Check that the database connects:

```
node test-connection.js
```

You want "Connected successfully". If the tables have never been created in the database, create them once:

```
node -e "require('./db').initDb().then(() => process.exit(0))"
```

Start the backend and leave it running:

```
npm start
```

You want "Server listening on port 3000". In a second terminal, check it:

```
curl http://localhost:3000/
```

You want "Atelier API is running". To make a test account:

```
curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
```

Passwords must be at least 8 characters.

### 2. Mobile app

```
cd mobile-app
npm install
npx expo start
```

Press `w` to open the app in the browser, or scan the QR code with Expo Go on your phone.

The screens (`LoginScreen.js`, `ClosetScreen.js` and `AddItemScreen.js`) have an `API_URL` near the top. It must point at the computer running the backend:

- In the browser on the same computer, `http://localhost:3000` works.
- On a phone, `localhost` does not work. Use your computer's address on the same Wi-Fi, for example `http://192.168.1.25:3000`. On a Mac, `ipconfig getifaddr en0` prints it.

Keep your own address changes on your computer and do not commit them. When you commit, add only the files you changed on purpose (`git add` with file names).

### 3. Troubleshooting

**The login page keeps loading, or requests time out.** The shared Supabase project pauses after about a week of no use. Open the project at supabase.com/dashboard and click Restore project, wait a few minutes, then run `node test-connection.js` again. The error `tenant/user ... not found` means the project is paused.

**`relation "wardrobe" does not exist`.** The tables were never created. Run the `initDb` command in the backend section.

**The backend stops with "JWT_SECRET is missing or too short".** Add a `JWT_SECRET` of 32 or more characters to `backend/.env`.

**The closet says it is empty but you added items.** The screen shows the same message when the server returns an error. Look at the terminal running the backend for a line that starts with an error name.

**Expo shows "expo-router is no longer compatible with react-navigation".** The app does not use expo-router, so skip that check when you start it.

- Mac: `EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1 npx expo start`
- Windows PowerShell: `$env:EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1; npx expo start`

**Expo then says static rendering requires expo-router.** In `mobile-app/app.json`, change `"output": "static"` to `"output": "single"` in the `web` section. Keep this change on your computer.

**Port 3000 is already in use, or the backend seems frozen.** Stop whatever holds the port, then start again:

```
kill -9 $(lsof -ti :3000 -sTCP:LISTEN)
```

## Setup Guide

This guide explains how to run the Atelier backend and mobile app on your own computer.

### 1. Backend

```
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in two values:

- `DATABASE_URL`: the shared Supabase connection string. Ask Bradley for it privately. Do not post it in a public channel or commit it.
- `JWT_SECRET`: a random secret of 32 or more characters. Generate one with:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The `.env` file is ignored by git, so it stays on your computer.

Check that the database connects:

```
node test-connection.js
```

You want "Connected successfully". If the tables have never been created in the database, create them once:

```
node -e "require('./db').initDb().then(() => process.exit(0))"
```

Start the backend and leave it running:

```
npm start
```

You want "Server listening on port 3000". In a second terminal, check it:

```
curl http://localhost:3000/
```

You want "Atelier API is running". To make a test account:

```
curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
```

Passwords must be at least 8 characters.

### 2. Mobile app

```
cd mobile-app
npm install
npx expo start
```

Press `w` to open the app in the browser, or scan the QR code with Expo Go on your phone.

The screens (`LoginScreen.js`, `ClosetScreen.js` and `AddItemScreen.js`) have an `API_URL` near the top. It must point at the computer running the backend:

- In the browser on the same computer, `http://localhost:3000` works.
- On a phone, `localhost` does not work. Use your computer's address on the same Wi-Fi, for example `http://192.168.1.25:3000`. On a Mac, `ipconfig getifaddr en0` prints it.

Keep your own address changes on your computer and do not commit them. When you commit, add only the files you changed on purpose (`git add` with file names).

### 3. Troubleshooting

**The login page keeps loading, or requests time out.** The shared Supabase project pauses after about a week of no use. Open the project at supabase.com/dashboard and click Restore project, wait a few minutes, then run `node test-connection.js` again. The error `tenant/user ... not found` means the project is paused.

**`relation "wardrobe" does not exist`.** The tables were never created. Run the `initDb` command in the backend section.

**The backend stops with "JWT_SECRET is missing or too short".** Add a `JWT_SECRET` of 32 or more characters to `backend/.env`.

**The closet says it is empty but you added items.** The screen shows the same message when the server returns an error. Look at the terminal running the backend for a line that starts with an error name.

**Expo shows "expo-router is no longer compatible with react-navigation".** The app does not use expo-router, so skip that check when you start it.

- Mac: `EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1 npx expo start`
- Windows PowerShell: `$env:EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1; npx expo start`

**Expo then says static rendering requires expo-router.** In `mobile-app/app.json`, change `"output": "static"` to `"output": "single"` in the `web` section. Keep this change on your computer.

**Port 3000 is already in use, or the backend seems frozen.** Stop whatever holds the port, then start again:

```
kill -9 $(lsof -ti :3000 -sTCP:LISTEN)
```
