#!/bin/bash

DBSTRING="host=$DBHOST user=$POSTGRES_USER password=$POSTGRES_PASSWORD dbname=$POSTGRES_DB"

goose postgres "$DBSTRING" up