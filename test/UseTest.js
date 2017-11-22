const Assertion = require("./Libs").Assertion;
const Errors = require("./../src/Errors");
const FileSystem = require("./../src/Libs").FileSystem;
const Path = require('path');
const TemplateErrors = require("./Errors");
const Unit = require("./Libs").Unit;

const Use = require("./../index");


const toString = o =>
    JSON.stringify(o, null, 2);


const path = relativeName =>
    Path.join(Path.dirname(__filename), relativeName);


const thenTest = name => promise => thenAssertion =>
    promise
        .then(okay => Unit.Test(name)(thenAssertion(okay)))
        .catch(err => Unit.Test(name)(Assertion.fail("Error handler raised: " + err)));


const catchTest = name => promise => errorAssertion =>
    promise
        .then(_ => Unit.Test(name)(Assertion.fail(toString(_))))
        .catch(err => Unit.Test(name)(errorAssertion(err)))
        .catch(err => Unit.Test(name)(Assertion.fail("Error handler raised: " + err)));


module.exports = Unit.Suite("UseTest")([
    catchTest("Unknown Tool Name Format")(
        Use.useOn("./this_is_not_a_valid_tool_name")("./src"))(
        err => Assertion.equals(toString(err))(toString(Errors.UnknownToolNameFormat("./this_is_not_a_valid_tool_name")))),

    catchTest("Unknown Tool Provider")(
        Use.useOn("bob:./this_is_not_a_valid_tool_name")("./src"))(
        err => Assertion.equals(toString(err))(toString(Errors.UnknownToolProvider("bob:")(["core:", "file:"])))),

    catchTest("Unknown Tool")(
        Use.useOn("file:./this_is_not_a_valid_tool_name")("./src"))(
        err => Assertion.equals(toString(err))(toString(Errors.UnknownTool("file:./this_is_not_a_valid_tool_name")))),

    catchTest("Use template tool with unknown template")(
        Use.useOn("file:" + path("./TemplateTool"))(path("./samples.template")))(
        err => Assertion.equals(toString(err))(toString(TemplateErrors.TemplateFileDoesNotExist(path("./samples.template"))))),

    thenTest("Use template tool with Bob and Mary")(
        Use.useOn("file:" + path("./TemplateTool"))(path("./sample.template"))
            .then(template => Promise.all([template("Bob")("Mary"), FileSystem.readFile(path("./BobMaryResult.txt"))])))(
        okay => Assertion.equals(okay[0])(okay[1])),

    thenTest("Use core:Tool.ESTree:1.0.3 with SampleAST.template")(
        Use.useOn("core:Tool.ESTree:1.0.3")(path("./SampleAST.estree")))(
        okay => Assertion.AllGood)

]);