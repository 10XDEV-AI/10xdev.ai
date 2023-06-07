files:
  "/opt/elasticbeanstalk/hooks/appdeploy/post/02_copy_users_folder.sh":
    mode: "000755"
    owner: root
    group: root
    content: |
      if [ ! -d "/var/app/current/user" ]; then
        if [ -f "/var/backup/users.zip" ]; then
          unzip /var/backup/users.zip -d /var/app/current/
        else
          echo "Error: The users.zip backup file does not exist. Please create it"
        fi
      fi


