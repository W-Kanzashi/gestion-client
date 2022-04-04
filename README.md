# Project client management

## Development

Using [Next js](https://nextjs.org/) and REST api to make request to [Mondodb](https://mongodb.com) database.

UI made with [Tailwindcss](https://tailwindcss.com/) and [Material UI](https://mui.com/)

Copy the .env.example to .env and follow the step bellow.

### Mongodb Atlas
Create an account on the [Mongodb](https://www.mongodb.com/) and add a new database.
Create an user in the Database Access tab.
Edit the .env file and add your MongoDB Atlas credential found in Database &rarr; Connect your application.
Don't forget to add the IP of your machine in the Network Access tab.

### Auth0
Create an account on [Auth0](https://auth0.com).
Create a new application and follow the NextJS step to add your own credential in the .env file.


# The project is "normally" future proof, so you can update to the latest version if you want or for security purpose
```bash
# Requirement
# nodejs > 15 and you need to use yarn to be able to compile dependencies (npm can compile but with parameter)
# Copy paste the command bellow to start the project

yarn install or npm install
yarn dev or npm run dev
```

