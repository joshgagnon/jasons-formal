git pull
rm -rf node_modules/good-companies-templates
rm -rf node_modules/el-templates


yarn install
rm serviceIsLive.flag
pm2 stop jf.config.json
NODE_ENV=production webpack
pm2 start jf.config.json --env production

