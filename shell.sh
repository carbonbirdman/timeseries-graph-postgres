# Run the container and open a shell
# cleanup afterwards
#! /bin/bash
IMAGE_NAME=tsa
docker run -it \
--entrypoint /bin/bash \
-p 7546:7545 \
-p 3000:3000 \
-p 3001:3001 \
--volume /home/$USER/tsa:/home/birdman/app \
--rm \
$IMAGE_NAME
