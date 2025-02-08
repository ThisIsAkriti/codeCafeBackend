## CodeCafe Backend 
> Backend Learnings!
 ### Deployment(via aws):
 - git clone "your backend repo"
 - npm install
 - npm run start to start the application
 - install pm2 (npm install pm2 -g) -g means globally.
   - we use this cause we cant keep our terminal open forever and as soon we close our terminal we loose the connection.
 -  Now run the code via (pm2 start npm -- start) 
   - and now the project will run 24/7 without and loose in connection.
 - pm2 logs (to check logs)
 - pm2 flush npm 
 - pm2 list(shows lists )
 - pm2 stop npm(stop the process) 
 - pm2 delete npm or name of the process

 ## Run project:
 - Give custom name like this ( pm2 start npm --name "codeCafeBackend" -- start);
  
  ##### Nginx config(proxy pass)
   - sudo nano /etc/nginx/sites-available/default
   - change config as:
      server_name 43.204.96.490;
      location /api/ {
         proxy_pass http://localhost:3000/; (keep? "/" in mind after api and 3000)
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
      }
      
      - ctrl + X , press Y and Enter;

   #### restart nginx
      sudo systemctl restart nginx
   - modify baseurl to /api in frontend.

### Tiny task Scheduler
   - node Cron (install it and use it);
   - crontab (editor for cron schedule expressions);
    Happy Coding💙