import arg from 'arg';
import inquirer from 'inquirer';
import copydeck from 'copydeck-module'
const fs = require('fs');

export async function cli(args) {
    let options = pargeArgsIntoOptions(args);
    options = await promptForMissingOptions(options);
    if (options["init"]) {

        let initPath = options["init"];
        if (!fs.existsSync(initPath)) {
            fs.mkdirSync(initPath);
        }
        if (fs.lstatSync(initPath).isDirectory()) {
            initPath += "/config.json";
        }
        delete options["init"];
        let contents = JSON.stringify(options);
        fs.writeFileSync(initPath, contents);
    }else{
        copydeck.translateToFile(options);
    }
}

function pargeArgsIntoOptions(rawArgs) {
    const args = arg({
        '--init': String,
        '--path': String,
        '-i': '--init',
        '-p': '--path'
    }, {
        argv: rawArgs.slice(2),
    });
    if (args["--init"]) {
        return {
            "init": args["--init"]
        };
    }
    if (args["--path"]) {
        let filename = args["--path"];
        try {
            let data = fs.readFileSync(filename, "utf8");
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    return {};
}

async function promptForMissingOptions(options) {
    const questions = [];

    if (!options.from) {
        questions.push({
            type: 'list',
            name: 'from',
            message: 'Please choose which reading file type',
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
            message: 'Please choose which writing file type',
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
    return {
        ...options,
        "from": options.from || answers.from,
        "to": options.to || answers.to,
        "readPath": options.readPath || answers.readPath,
        "writePath": options.writePath || answers.writePath,
        "filter": options.filter || answers.filter
    }
}