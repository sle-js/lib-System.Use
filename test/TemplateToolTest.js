const Assertion = require("./Libs").Assertion;
const FileSystem = require("../src/FileSystem");
const Unit = require("./Libs").Unit;

const TemplateTool = require("./TemplateTool");

module.exports = Unit.Suite("TemplateToolTest")([
    TemplateTool.translate(process.cwd() + "/test/unknown.template")
        .then(_ => false)
        .catch(_ => true)
        .then(result => Unit.Test("Unknown file")(Assertion.isTrue(result))),

    Promise.all([
        TemplateTool.translate(process.cwd() + "/test/sample.template"),
        FileSystem.readFile(process.cwd() + "/test/expected.sample.js")
    ])
        .then(_ => Promise.all([
            FileSystem.readFile(process.cwd() + "/test/sample.js"),
            _[1]]))
        .then(_ => Unit.Test("Translate sample.template")(Assertion.equals(_[0])(_[1])))
        .catch(_ => Unit.Test("Translate sample.template")(Assertion.fail(_)))
]);