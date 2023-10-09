## CS

This is a repository for my Computer Science final project.
As a computer science student, I was often asked to install different databases on my computer, and it was often a hassle to do so.
This website is meant to be a simple and friction-less way to set-up a database in the cloud and use it for your projects.
Ideally I would use kubernetes to scale the databases, but I don't have money to pay for a kubernetes cluster, so I'll just use docker for now, and deploy the website on heroku or something.

## Development

`scripts/start-db.sh` will start the databases in a kubernetes cluster. You need minikube installed for this to work.

`yarn dev` will start both the server and the client in development mode.

## Backend

### Validation

```
import { validate } from './lib/middleware';
import * as yup from 'yup';

const schemaValidator: yup.Schema = yup.object({
  query: yup.object().shape({
    age: yup.number().required().min(18).max(601),
  }),
});
...
app.get('/', validate(schemaValidator), (req, res) => {
 ...
});
```

## Adminer

Adminer is a database management tool that allows you to manage your databases from a web interface.
It supports multiple databases.
We need to start a PHP server for it to work, on a different port than the one we use for the API.
We use a proxy to redirect the requests to /admin\* to the PHP server.
In development it doesn't work properly. To test, run `yarn build` and then `yarn start` and go to `localhost:3000/admin`.
