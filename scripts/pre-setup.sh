#!/usr/bin/env bash

#update instance
sudo yum -y update

# add nodejs to yum
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
curl -sL https://rpm.nodesource.com/setup_8.x | sudo bash -
sudo yum -y install nodejs npm git yarn
sudo yum -y install ImageMagick

# install pm2 module globally
sudo npm install -g pm2
pm2 update

ssh -o StrictHostKeyChecking=no git@bitbucket.org