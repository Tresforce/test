####### BUILD STAGE
# Choosing Node Image for builder file
FROM node:12-alpine as builder
# Copy just the package.json
COPY package.json .
# install dependencies 
RUN apk add --no-cache --virtual .gyp python make g++ \
  && npm install \
  && apk del .gyp
# Copy application
COPY . .
# Build application
RUN npm run build:bundle

###### CONTAINER STAGE
## Containerize Prod
FROM node:12-alpine as app
# Install dependencies
COPY package.json .
RUN npm install --production
COPY --from=builder ./dist ./dist
EXPOSE 3005
CMD ["npm", "start"]