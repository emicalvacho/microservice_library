FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app/front
WORKDIR /usr/src/app/front

# Install app dependencies
COPY package*.json /usr/src/app/front/
RUN npm install
ENV HOST=0.0.0.0

# Bundle app source
COPY . /usr/src/app/front

EXPOSE 8080