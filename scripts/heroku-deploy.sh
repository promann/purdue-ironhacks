echo "Create the heroku-deploy"
git checkout -B heroku-deploy
git merge master
npm run bundle

echo "bundle-cache/" > .bloggify/.gitignore

git add . -A
git commit -m 'Bundle and deploy' .

git push heroku heroku-deploy:master -f
git checkout master
git branch -D heroku-deploy
