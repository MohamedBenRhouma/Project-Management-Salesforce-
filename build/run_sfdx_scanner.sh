#!/bin/bash

echo "Installing JDK"
sudo apt update
sudo apt install openjdk-11-jdk

echo "Installing Node.js 18 using nvm"
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# Activate nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18

echo "Install SFDX Scanner"
echo -e 'y/n' | sfdx plugins:install @salesforce/sfdx-scanner

echo "Running SFDX Scanner"
# Assuming a configuration file is available at 'config/scan-config.json'
sfdx scanner:run -c config/scan-config.json --target "**/default/**" --format "csv" --outfile "sfdxScannerAnalysis.csv" --violations-cause-error
