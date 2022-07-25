#!/bin/bash

volume_name=docker_nft-upload-data
uploads_path=/usr/src/app/storage/uploads
backup_file=$1
uploads_backup_path=backup/uploads

rm -rf backup
mkdir -p backup
cd backup
tar -zxf ../$backup_file
cd -

docker container create --name dummy -v $volume_name:$uploads_path tianon/true
docker cp $uploads_backup_path dummy:$uploads_path/..
docker rm dummy