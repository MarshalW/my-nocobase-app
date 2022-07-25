#!/bin/bash

grep_command="grep"

if [[ $OSTYPE == 'darwin'* ]]; then
  grep_command="ggrep"
fi

password=$($grep_command -Po '(^|[ ,])MYSQL_ROOT_PASSWORD=\K[^,]*' .env)
database=$($grep_command -Po '(^|[ ,])DB_DATABASE=\K[^,]*' .env)
mysql_container_name=mysql1
server_container_name=server
# uploads_path=/usr/src/app/my-app/storage/uploads

local_uploads_path=/tmp/my-nocobase-app/storage/uploads


tmp_backup_path=/tmp/backup

rm -rf $tmp_backup_path
mkdir -p $tmp_backup_path

# 备份 mysql 数据库
docker exec $mysql_container_name /usr/bin/mysqldump -u root --password=$password $database >$tmp_backup_path/mysql.sql

# 备份 uploads 目录
# docker cp $server_container_name:$uploads_path $tmp_backup_path
cp -r $local_uploads_path $tmp_backup_path

cd $tmp_backup_path
tar -czvf backup.tar.gz uploads mysql.sql

cd -
mv $tmp_backup_path/backup.tar.gz ./backup-$(date +"%Y%m%d-%H-%M").tar.gz

rm -rf $tmp_backup_path