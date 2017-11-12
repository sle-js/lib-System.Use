const Assertion = require("./Libs").Assertion;
const FileSystem = require("../src/FileSystem");
const Path = require("path");
const Unit = require("./Libs").Unit;

const TemplateTool = require("./TemplateTool");


const toString = o =>
    JSON.stringify(o, null, 2);


const path = relativeName =>
    Path.join(Path.dirname(__filename), relativeName);


module.exports = Unit.Suite("TemplateToolTest")([
    TemplateTool.translate(process.cwd() + "/unknown.template")
        .then(_ => false)
        .catch(_ => true)
        .then(result => Unit.Test("Unknown file")(Assertion.isTrue(result))),

    Promise.all([
        TemplateTool.translate(path("/sample.template")),
        FileSystem.readFile(path("/expected.sample.js"))
    ])
        .then(_ => Promise.all([
            FileSystem.readFile(path("/sample.js")),
            _[1]]))
        .then(_ => Unit.Test("Translate sample.template")(Assertion.equals(_[0])(_[1])))
        .catch(_ => Unit.Test("Translate sample.template")(Assertion.fail(toString(_))))
]);