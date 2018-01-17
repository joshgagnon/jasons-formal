git pull
rm -rf node_modules/good-companies-templates
rm -rf node_modules/json-schemer

yarn install --check-files
rm serviceIsLive.flag
pm2 stop jf.config.json
NODE_ENV=production webpack
pm2 start jf.config.json --env production

