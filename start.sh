#!/bin/bash

cd server && pm2 start server.sh
sleep 5
cd ../client && pm2 start client.sh

echo "HEAVEN??, c'est réel."
