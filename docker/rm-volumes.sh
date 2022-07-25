#!/bin/bash

docker rm -f dummy

docker volume rm docker_nft-mysql-data
docker volume rm docker_nft-upload-data