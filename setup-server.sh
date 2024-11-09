#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    git


# Create app directory
sudo mkdir -p /opt/auth
sudo chown $(whoami):$(whoami) /opt/auth

# Clone repository
git clone https://github.com/eliasnau/cAuth.git /opt/auth

# Setup deployment script
sudo chmod +x /opt/auth/deploy.sh

# Setup automatic updates
sudo tee /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF