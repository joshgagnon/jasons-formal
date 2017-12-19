git pull
rm -rf node_modules/good-companies-templates
rm -rf node_modules/json-schemer

yarn install
rm serviceIsLive.flag
pm2 stop json-formal.config.json
NODE_ENV=production webpack
pm2 start json-formal.config.json --env production

