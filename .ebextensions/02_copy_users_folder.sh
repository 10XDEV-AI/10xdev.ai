files:
  "/opt/elasticbeanstalk/hooks/appdeploy/post/02_copy_users_folder.sh":
    mode: "000755"
    owner: root
    group: root
    content: |
      if [ ! -d "/var/app/current/users" ]; then
        cp -R /var/backup/users /var/app/current/
      fi
