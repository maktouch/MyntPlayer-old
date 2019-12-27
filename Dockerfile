FROM node:12.14.0-alpine as builder
ADD . /srv
WORKDIR /srv
RUN yarn 
RUN yarn react build
# RUN rm -rf dev
RUN yarn install --production

FROM node:12.14.0-alpine 
COPY --from=builder /srv /srv
WORKDIR /srv

