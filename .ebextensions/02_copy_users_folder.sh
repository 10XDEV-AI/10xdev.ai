files:
  "/opt/elasticbeanstalk/hooks/appdeploy/post/99_copy_users_folder.sh":
    mode: "000755"
    owner: root
    group: root
    content: |
      #!/bin/bash
      if [ ! -d "/var/app/current/users" ]; then
        cp -R /var/backup/users /var/app/current/
      fi

      cd /var/app/current/

      if [ -f /var/backup/users.zip ]; then
        unzip -o /var/backup/users.zip -d users/
      fi
