#! /bin/bash
IMAGE_NAME=tsa
docker build --file Dockerfile  --tag $IMAGE_NAME .
