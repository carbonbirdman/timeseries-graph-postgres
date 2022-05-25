FROM node:16

RUN apt-get update -y --fix-missing
RUN apt-get install -y vim curl pkg-config
RUN apt-get install -y sudo
#RUN apt-get install -y postgresql

#COPY package*.json ./

# Create a user called birdman
# Create a non-root user to run the app
ENV USER birdman
ENV UID 1002
ENV GID 1003
ENV HOME /home/$USER
RUN addgroup --gid $GID traders
RUN adduser --disabled-password \
    --gecos "Non-root user" \
    --uid $UID \
    --gid $GID \
    --home $HOME \
    $USER
RUN adduser birdman sudo

# Set up the users home as a working directory
# This means that files created here will be saved on
# the host, i.e. we can do development in the docker
# instance
ENV WORKDIR /home/$USER/app
WORKDIR $WORKDIR
VOLUME $WORKDIR
ENV PATH=$WORKDIR:$PATH
RUN chown $UID:$GID $WORKDIR

# Now we can either copy the app into the container (best practice)
# or use the app directoy (better for development)
# when happy do this
USER $USER

# Setup entry files and app script
EXPOSE 8080
EXPOSE 5432
EXPOSE 3000
#CMD [ "yarn", "setupandrun" ]
ENTRYPOINT ["/home/birdman/app/entrypoint.sh"]

