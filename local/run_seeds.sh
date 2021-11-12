#!/bin/bash

set -e
export DATABASE_URL=postgresql://postgres:postgres@localhost:4432/poc_cypress_dev
npx knex migrate:latest
npx knex seed:run
