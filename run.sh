#! /bin/bash
# Runs with the default entrypoint defined in the Dockerfile
IMAGE_NAME=tsa
docker run -d -it \
--rm \
-p 7546:7545 \
-p 3000:3000 \
-p 3001:3001 \
--volume /home/$USER/tsa:/home/birdman/app \
$IMAGE_NAME
