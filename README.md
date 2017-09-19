# Reddit App for Android

## Quickstart

Install Cordova CLI:

    sudo npm install -g cordova

Create Cordova project:

    cordova create reddit_app

Navigate to the app files in project directory and remove all pre-generated files:

    cd reddit_app/www

Get the source from GitHub:

    git clone git@github.com:domazet93/reddit_app.git

Add android platform:

    cordova platform add android

Check all requirements for building the platform:

    cordova requirements
    
Build the app:

    cordova emulate android

Open app with Android SDK emulator or run it on your device(must be connected into computer):

    cordova emulate android
    cordova run android
