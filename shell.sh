# Run the container and open a shell
# cleanup afterwards
#! /bin/bash
IMAGE_NAME=tsa
docker run -it \
--entrypoint /bin/bash \
-p 3002:3002 \
--volume /home/$USER/tsa:/home/birdman/app \
--rm \
$IMAGE_NAME
