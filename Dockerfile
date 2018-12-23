FROM node:10.14.2-alpine as builder
ADD . /srv
WORKDIR /srv
RUN yarn 
RUN yarn frontend build
RUN rm -rf dev
RUN yarn install --production

FROM node:10.14.2-alpine 
COPY --from=builder /srv /srv
WORKDIR /srv

