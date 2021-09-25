:: Before running setup file, please make sure you have the Node.js version >=6.9.1 installed in your machine

@echo off

echo Please wait for a few minutes to install all needed dependencies...

echo Installing global npm dependencies...
call npm i -g eslint eslint-plugin-react

echo Installing client's npm packages...
call npm install

pause