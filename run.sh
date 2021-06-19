#!/bin/bash

NAME=thegame

CONTAINER=$(docker container ls -q -f "name=${NAME}")
if [[ ! -z ${CONTAINER} ]]
then
	docker stop ${CONTAINER} >/dev/null 2>&1
fi
docker -D run --rm --name thegame -d \
	-v ${PWD}/thegame.conf:/etc/nginx/conf.d/default.conf \
	-v ${PWD}/error.log:/var/log/nginx/host.error.log \
	-v ${PWD}/docs:/usr/share/nginx/html \
	-p 80:80 \
	nginx:alpine
