# Copydeck-CLI
Copydeck-CLI is a command line interface that allow you to transform Android, IOS or i18Next ressources files into a more user friendly Csv files. The translation from any type of file to any other type of file.
## Install
To install this command line interfaces you will need to run those two command

First of course 
```
npm i copydeck-cli
```
then 
```
npm link @helsing45/copydeck-cli
```

# Commands
## Init
To create your configuration file you will need to run the command
```
copydeck --init [path]
```
or 
```
copydeck -i [path]
```

Where the path is where your config file will be save.

When creating your config file you will need to answers a few question.
### 1) Reading file type 
Determine what type of file you will translate from. You can choose between those 5 types; _'Android'_,_'Csv'_, _'IOS'_, _'i18Next'_, _'universal'_
### 2) Reading file path
The path where the reading file are.
### 3) Filter by
The eval string use to filter what item you want to keep. If you translate from a Csv file you can filter by column name. Let's say in my Csv file there's a column name Target where you can have the string for Android, IOS, Mobile (use by both Android and IOS) and some for the WebConsole. Now i'm building my config file to translate Csv to Android i can filter with:
```
Target == "Android" || Target == "Mobile" 
```

if in my Csv file contain mutliple project you can always add a column Project and filter like this:
```
(Target == "Android" || Target == "Mobile") && (Project == "P1" || Project == "All")
```
### 4) Writing file type 
Determine what type of file you will translate to. You can choose between those 5 types; _'Android'_,_'Csv'_, _'IOS'_, _'i18Next'_, _'universal'_

### 5) Writing file path  
The path where the file will be written.
### 6) Is there a default language 
In the case you translating a Csv to Android you want to indicate what language will be name values 
### 6.1) What is the default language 
Indicate what the default language is.

## Translate
To create your configuration file you will need to run the command
```
copydeck --translate_path [path]
```
or 
```
copydeck -t [path]
```

Where the path is where your config file is saved

If you are at the location of your config file, and the file is named _config.json_ you can also run.

```
copydeck translate
```