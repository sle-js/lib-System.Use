const Array = mrequire("core:Native.Data.Array:1.1.0");
const Errors = require("./Errors");
const FileSystem = require("../src/FileSystem");
const Path = require("path");
const String = require("../src/String");


const replaceExtension = newExtension => fileName => {
    const parseFileName =
        Path.parse(fileName);

    return Path.join(parseFileName.dir, parseFileName.name + newExtension);
};
assumptionEqual(replaceExtension(".js")("/home/bob/test.sample"), "/home/bob/test.js");
assumptionEqual(replaceExtension(".js")("./test.sample"), "test.js");


const target = fileName =>
    replaceExtension(".js")(fileName);


const parse = content => {
    const indexOfNewline =
        String.indexOf("\n")(content).withDefault(-1);

    const variables =
        indexOfNewline <= 0
            ? []
            : Array.map(String.trim)(String.split(",")(String.substring(0)(indexOfNewline)(content)));

    const template =
        String.drop(indexOfNewline + 1)(content);

    return {variables, template};
};
assumptionEqual(parse("a, b\nHello World"), {variables: ["a", "b"], template: "Hello World"});
assumptionEqual(parse("Hello World"), {variables: [], template: "Hello World"});


const validate = content =>
    content.variables.length === 0
        ? Promise.reject({kind: "VariablesException"})
        : Promise.resolve(content);


const templateRE =
    /<%(.+?)%>/g;


const toJavaScript = template => {
    const formatExpression = text =>
        '    r.push(' + text.trim() + ');\n';

    const formatLiteral = text =>
        (text === '')
            ? ""
            : '    r.push("' + text.replace(/"/g, '\\"') + '");\n';

    let code = '    const r=[];\n';
    template.split('\n').forEach((line, index) => {
        if (line.startsWith(">")) {
            code += line.substr(1) + '\n'
        } else {
            let cursor = 0;
            if (line.startsWith("+")) {
                cursor = 1;
            } else if (index > 0) {
                code += '    r.push("\\n");\n';
            }
            templateRE.lastIndex = 0;
            let match;
            while (match = templateRE.exec(line)) {
                code += formatLiteral(line.slice(cursor, match.index));
                code += formatExpression(match[1]);
                cursor = match.index + match[0].length;
            }
            code += formatLiteral(line.substr(cursor, line.length - cursor));
        }
    });
    code += '    return r.join("");';

    return code;
};


const readFile = name =>
    FileSystem
        .readFile(name)
        .catch(_ => Promise.reject(Errors.TemplateFileDoesNotExist(name)));


const translate = fileName => {
    const targetFileName =
        replaceExtension(".js")(fileName);

    return readFile(fileName)
        .then(parse)
        .then(validate)
        .then(_ => ({variables: _.variables, template: toJavaScript(_.template)}))
        .then(_ => "const process = " + _.variables.map(i => i + " => ").join("") + "{\n" + _.template + "\n" + "};\n\n\nmodule.exports = process;\n")
        .then(content => FileSystem.writeFile(targetFileName)(content));
};


module.exports = {
    parse,
    target,
    toJavaScript,
    translate
};

