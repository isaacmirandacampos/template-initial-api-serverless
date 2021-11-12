#!/bin/bash

set -e

export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/poc_cypress_test

export JWT_SECRET=poc-tests

npx knex migrate:latest
rm -rf dist
npx tsc
DEBUG=api:* npx jest --coverage --verbose $1
