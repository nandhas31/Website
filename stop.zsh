#!/bin/zsh
sudo mongo --eval "db.getSiblingDB('admin').shutdownServer()";

