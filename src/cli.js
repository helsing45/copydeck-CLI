import arg from 'arg';
import inquirer from 'inquirer';
import copydeck from 'copydeck-module'
const fs = require('fs');

export async function cli(args) {
    let options = pargeArgsIntoOptions(args);

    options = await promptForMissingOptions(options);
    if (options["init"]) {
        let path = options["init"].split('/');
        let destinationImmediate = path[path.length - 1];

        if (!destinationImmediate.endsWith('.json')) {
            path.push("config.json");
        }

        delete options["init"];
        let configFilePath = path.join('/');
        path.pop();

        let configParentPath = path.join('/');
        if (!fs.existsSync(configParentPath)) {
            fs.mkdirSync(configParentPath);
        }
        let contents = JSON.stringify(options);
        console.log("Writing " + contents + " file into: " + configFilePath);

        fs.writeFileSync(configFilePath, contents);
    } else {
        copydeck.translateToFile(options);
    }
}

function pargeArgsIntoOptions(rawArgs) {
    const args = arg({
        '--init': String,
        '--translate_path': String,
        '-i': '--init',
        '-t': '--translate_path'
    }, {
        argv: rawArgs.slice(2),
        stopAtPositional: true
    });

    if (args["--init"]) {
        return {
            "init": args["--init"]
        };
    }

    if (args["--translate_path"]) {
        let filename = args["--translate_path"];
        try {
            let data = fs.readFileSync(filename, "utf8");
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
        }
    }

    let runTask = args['_'][0];
    if (runTask == "translate") {
        let data = fs.readFileSync("config.json", "utf8");
        return JSON.parse(data);
    }


    return {};
}

async function promptForMissingOptions(options) {
    const questions = [];

    if (!options.from) {
        questions.push({
            type: 'list',
            name: 'from',
            message: 'Reading file type',
            choices: ['Android', 'Csv', 'IOS', 'i18Next', 'universal'],
            default: 'Csv',
        });
    }

    if (!options.readPath) {
        questions.push({
            type: 'input',
            name: 'readPath',
            message: 'Reading file path: '
        });
    }

    if (!options.filter) {
        questions.push({
            type: 'input',
            name: 'filter',
            message: 'Filter by: '
        });
    }

    if (!options.to) {
        questions.push({
            type: 'list',
            name: 'to',
            message: 'Writing file type',
            choices: ['Android', 'Csv', 'IOS', 'i18Next', 'universal'],
            default: 'universal',
        });
    }

    if (!options.writePath) {
        questions.push({
            type: 'input',
            name: 'writePath',
            message: 'Writing file path: '
        });
    }

    const answers = await inquirer.prompt(questions);
    options = {
        ...options,
        "from": options.from || answers.from,
        "to": options.to || answers.to,
        "readPath": options.readPath || answers.readPath,
        "writePath": options.writePath || answers.writePath,
        "filter": options.filter || answers.filter
    }

    if (typeof options.defaultLanguageRequired == 'undefined') {

        let answer = await inquirer.prompt({
            type: 'confirm',
            name: 'defaultLanguageRequired',
            message: 'Is there a default language ?'
        });
        options = {
            ...options,
            "defaultLanguageRequired": answer.defaultLanguageRequired,
        }
    }

    if (options.defaultLanguageRequired && !options.defaultLang) {

        let answer = await inquirer.prompt({
            type: 'input',
            name: 'defaultLang',
            message: 'What is the default language?'
        });
        options = {
            ...options,
            "defaultLang": answer.defaultLang,
        }
    }

    return options;
}