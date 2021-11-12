#!/bin/bash

set -e

export DATABASE_URL=postgresql://postgres:postgres@localhost:4432/poc_cypress_dev
export JWT_SECRET=poc-development

npx knex migrate:latest
npx ts-node-dev --watch --respawn --transpile-only src/server/index
