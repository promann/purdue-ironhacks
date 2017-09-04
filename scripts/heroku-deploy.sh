echo "Create the heroku-deploy"
git checkout -B heroku-deploy
git merge editor
rm -rf .bloggify/bundle-cache
npm run bundle
npm run purify:homepage

echo "bundle-cache/" > .bloggify/.gitignore

git add . -A
git commit -m 'Bundle and deploy' .

git push heroku heroku-deploy:master -f
git checkout editor
git branch -D heroku-deploy
