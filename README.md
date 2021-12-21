# Messenger

A one-to-one realtime chat app.

## Initial Setup

Create the PostgreSQL database (these instructions may need to be adapted for your operating system). You may follow [these steps](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database) to install PostgreSQL and run these commands to setup the database:

```console
psql
CREATE DATABASE messenger;
\q
```

Alternatively, if you have docker installed, you can use it to spawn a postgres instance on your machine:

```
docker run -it -p 5432:5432 -e POSTGRES_DB=<database-name> -e POSTGRES_USER=<database-username> -e POSTGRES_PASSWORD=<database-password> postgres -c log_statement=all
```

Update db.js to connect with your local PostgreSQL set up. The [Sequelize documentation](https://sequelize.org/master/manual/getting-started.html) can help with this.

Initiate all necessary environment variables. All environment variables need to be stored inside `.env`, which needs to be created at the project root:

```env
DATABASE_URL = "postgres://localhost:5432/postgres"
SESSION_SECRET = "your session secret"
```

In the project root, install dependencies and then seed the database:

```console
npm install
npm run seed
```

## Running the Application Locally

Open the terminal at the project root, then run.

```console
npm run dev
```

## Notes

Note that the project is using a custom server to handle websocket and middlewares. Also, the pages are rendered on the client-side, and server-side renderings are disabled.
