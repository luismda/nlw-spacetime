# NLW Spacetime 🚀🪐⏳

This project is a **time capsule to record relevant moments of your life**, allowing you to register some text or media that remembers an event on a specific date. In addition, all memories are arranged on a timeline. The application was developed at **Rocketseat's Next Level Week (NLW) event**.

[**View web and mobile application layout in Figma**](https://www.figma.com/community/file/1240070456276424762)

This project has a mobile version developed with **React Native** and **Expo (with Expo Router)**, in addition to using **NativeWind** (**TailwindCSS** for React Native) for styling. In addition, the web front-end uses **React.js** in conjunction with **Next.js (with App Routes)** and also with **Tailwind**. The back-end uses **Node.js** and the **Fastify** framework, together with **Prisma ORM** to communicate with the database and **Docker** to up the **PostgreSQL** container. The application also uses an **oAuth** authentication model through **GitHub**.

## Instructions

First, you will need to clone the project repository. Next, you'll need to get your **oAuth client credentials from GitHub**. For that, you need to create two apps on GitHub Developer, one for the web app and one for the mobile app.

**When creating oAuth applications on GitHub it is important to add a callback url, used by GitHub to redirect the user back to the application after login**. Therefore, configure these callback urls as shown below.

On the app oAuth web, put this callback url: `http://localhost:3000/api/auth/callback`

On the app oAuth mobile, put this callback url: `exp://<your local IP address>:19000`

This mobile app url can also be found in the console when running the app with Expo.

You can consult the [**GitHub documentation**](https://docs.github.com/pt/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) for more details.

### Back-end

On the backend, install the dependencies. 

```sh
  npm i
```

Then run the command to upload the **Docker container** with **PostgreSQL**. 

```sh
  docker compose up -d
```

Then create an `.env` file in the root folder of the backend following the `.env.example` format. **When filling in the database connection url, prefer to use the local IP of your machine on the network, instead of localhost**. 

Finally, run the **prisma** command to **run all migrations** on the database.

```sh
  npx prisma migrate deploy
```

If you want, you can also visualize the database through **Prisma Studio**.

```sh
  npx prisma studio
```

Now run the application with the command:

```sh
  npm run dev
```

### Front-end

On the front-end, also install the dependencies and set the environment variables in an `.env.local` file following the example of the `.env.local.example` file. **You will need to provide the client id of the web application you created on GitHub**, in addition to the base url of the front-end and the base url of the API. **I also recommend putting your machine's local IP instead of localhost in the** `NEXT_PUBLIC_API_BASE_URL`.

Now run the application with the command:

```sh
  npm run dev
```

### Mobile

Finally, in the mobile application, install the dependencies and then add the base url of the api to an `.env` file, **also preferring to use the local IP of your machine**, in **addition to adding the client id of the mobile application created on the GitHub platform**.

Now run the application with the command:

```sh
  npm start
```

This mobile application uses **Expo**, so you can use an **Android or iPhone emulator** on your computer, or if you prefer, you can use the **Expo Go** application to scan the **QR Code** generated when running the application and thus test the application on your own cell.

## Created by

Luís Miguel | [**LinkedIn**](https://www.linkedin.com/in/luis-miguel-dutra-alves/)

##

**#NeverStopLearning 🚀**
