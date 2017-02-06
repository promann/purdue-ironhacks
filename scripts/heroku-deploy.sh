git checkout -B heroku-deploy
git merge master
npm run bundle

echo "*
!public
!.gitignore" > .bloggify/.gitignore

git add . -A
git commit -m 'Bundle and deploy' .

git push heroku heroku-deploy:master
