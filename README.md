# budgext
A web application to overview your finances in any way


# Getting Started

Here you can read up how to start your own version of budgext.

### Preqrequisites
Firstly, you have to install NodeJS and NestJS. <br>
You can visit [NodeJS](https://nodejs.org/) and [NestJS](https://docs.nestjs.com/)
for installation options but these are the defaults:<br>

NodeJS & NPM:
```
# install fnm (Fast Node Manager)
winget install Schniz.fnm
# download and install Node.js
fnm use --install-if-missing 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.15.0`
# verifies the right NPM version is in the environment
npm -v # should print `10.7.0`
```
### NestJS:
```
npm install -g @nestjs/cli
```

### Docker & Postgres

```
# Download/Install Docker on your computer
# If you use my docker-compose.yml locally:
docker compose up db -d
# or for the testing container
docker compose up test-db -d
```

You can enter one of the containers from the cmd line with
```
docker exec -it db bash
docker exec -it test-db bash
# and use a user:
psql -U dev_user -d nest_dev_db
psql -U test_user -d nest_test_db
```
or you can directly enter with your user of choice
```
docker exec -it db psql -U dev_user -d nest_dev_db
docker exec -it test-db psql -U test_user -d nest_test_db
```

### Prisma <br>
#### [Documentation](https://www.prisma.io/docs/getting-started)
```
npm install @prisma/client@latest @prisma/extension-accelerate
```
You can generate the Prisma Client by executing the following command:
```
npx prisma generate
```

To migrate your prisma schema, use:
```
prisma migrate deploy
```

### Passport (supported by nestJS) 

### JWT

### Pactum

### dotenv

### argon2
