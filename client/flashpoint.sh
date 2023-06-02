#!/bin/bash

npm start > "logs/server_$(date +'%d_%m_%Y_%H_%M_%S').log" &
tail -f "logs/server_$(date +'%d_%m_%Y_%H_%M_%S').log"
