# GroupEx Pro Mobile

The GXP Mobile App is built using Cordova. 
Cordova has commands that allow users to setup a new project, add plugins and platforms, 
and build those platforms. The Android platform can then be opened in Android Studio, 
and the IOS platform can be opened in XCode. 
Once tested, the APK (Android) and IOS Package (IOS) can then be deployed for customer download.


---


## First-Time Setup

#### Install Cordova

Using NPM - 
NPM is used on Mac to install Cordova. The argument "-g" will install Cordova for all users.

```sudo npm i -g cordova```

To view the installed version of Cordova, use the following command.

```cordova -v``` 


#### Clone the Repository

We must first pull down the latest version of the code from GitHub.

```git clone https://github.com/daxko/GroupExProMobile.git GroupExProMobile```


---


## Automatic Steps Using Cordova-Prepare


##### Install Platforms

1. 'cd' into the groupexpro folder
2. Install the latest platforms. You only need to install the platforms you are actively using.
   
   ```cordova platform add android```
   
   ```cordova platform add ios```
   
   ```cordova platform add browser```


##### Download Plugins

Follow these steps to add the necessary platforms and plugins.
Cordova reads the "config.xml" file to know which plugins to download.

1. 'cd' into the 'groupexpro' folder
2. Install the latest android, ios, and browser platforms. Also install the latest plugins.

```cordova prepare```


##### Build Platform - Android

```cordova build android```

##### Build Platform - iOS

```cordova build ios```


---


## Manual Steps

##### Add Platforms

Follow these steps to add the necessary platforms.

1. 'cd' into the 'groupexpro' folder
2. Install the latest android, ios, and browser platforms.

##### Install Platforms

1. 'cd' into the groupexpro folder
2. Install the latest platforms.
   
   ```cordova platform add android```
   
   ```cordova platform add ios```
   
   ```cordova platform add browser```

##### Install Plugins

1. 'cd' into the groupexpro folder
2. Install the necessary plugins.

```cordova plugin add cordova-plugin-device```

```cordova plugin add cordova-plugin-inappbrowser```

```cordova plugin add cordova-plugin-network-information```

```cordova plugin add cordova-plugin-whitelist```

```cordova plugin add onesignal-cordova-plugin```

##### Build Platform - Android

```cordova build android```

##### Build Platform - iOS

```cordova build ios```


---


## Cordova Reference

##### List Project Plugins

Lists the currently installed plugins for this project

```cordova plugin list```

##### Add Plugin

Adds the specified plugin to the cordova project

```cordova plugin add <plugin_name>```

##### Remove Plugin

Removes the specified plugin from the cordova project

```cordova plugin remove <plugin_name>```

##### Save Plugins & Platforms

This will save a record of the plugins and platforms you use to the "config.xml" file. 
When you run "cordova prepare" or "cordova build", all of the plugins listed in the "config.xml" 
file will be installed if they haven't been already.

```cordova plugin save```

##### List Project Platforms

Lists the currently installed platforms for this project

```cordova platform list```

##### Add Platform

Adds the specified platform to the cordova project

```cordova platform add <platform_name>```

##### Remove Platform

Removes the specified platform from the cordova project

```cordova platform remove <platform_name>```

##### Prepare and Update Plugins and Platforms

This will install all plugins and platforms listed in the "config.xml" file.
You can also specify a platform to prepare and build. Example: "cordova prepare android" will install just the android platform and required plugins.

```cordova prepare```


---