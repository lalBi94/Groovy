#!/bin/bash

cd server && pm2 start server.sh --watch
sleep 5
cd ../client && pm2 start client.sh --watch

echo "HEAVEN??, c'est réel."
