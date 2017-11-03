const Assertion = require("./Libs").Assertion;
const Unit = require("./Libs").Unit;

const TemplateTool = require("./TemplateTool");

module.exports = Unit.Suite("TemplateToolTest")([
    TemplateTool.translate(process.cwd() + "/test/unknown.template")
        .then(_ => false)
        .catch(_ => true)
        .then(result => Unit.Test("Unknown file")(Assertion.isTrue(result)))
]);