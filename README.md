# InventoryDA
node app using database on mongodb for managing the inventory


Steps to connect to EC2 Instance on AWS

-Create a new instance of ec2 selecting ubuntu as the OS
- create the key pair file to be able to connect to this instance using ssh
- install docker and docker-compose using the next script as user Data in the creation
  
                  #!/bin/bash
                  
                  sudo apt-get update -y
                  
                  sudo apt-get install ca-certificates curl gnupg -y
                  
                  sudo install -m 0755 -d /etc/apt/keyrings
                  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
                  sudo chmod a+r /etc/apt/keyrings/docker.gpg
                  
                  echo \
                  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
                  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
                  
                  sudo apt-get update -y
                  
                  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
                  
                  sudo groupadd docker 
                  
                  sudo usermod -aG docker $USER
                  
                  newgrp docker

  
- Connect to the ec2 instance  using ssh
- Copy the project carpet to the ec2 instance using the next command
  -   scp -i {/path/to/your/}.pemkey -r {/copy/from/path} user@server:{/copy/to/path}
 
-   When the file is in the server can run the project
  -   run teh next commant inside the path the project is on
  -     docker compose up --build  
