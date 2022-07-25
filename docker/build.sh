#!/bin/bash

docker build -t nft-server .
docker build -t nft-client --target nft-client .