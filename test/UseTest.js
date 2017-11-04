const Assertion = require("./Libs").Assertion;
const Errors = require("./../src/Errors");
const FileSystem = require("../src/FileSystem");
const Path = require('path');
const Unit = require("./Libs").Unit;

const Use = require("./../index");


const toString = o =>
    JSON.stringify(o, null, 2);


const path = relativeName =>
    Path.join(Path.dirname(__filename), relativeName);


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
        err => Assertion.equals(toString(err))(toString(Errors.UnknownToolProvider("bob:")(["file:"])))),

    catchTest("Unknown Tool")(
        Use.useOn("file:./this_is_not_a_valid_tool_name")("./src"))(
        err => Assertion.equals(toString(err))(toString(Errors.UnknownTool("file:./this_is_not_a_valid_tool_name"))))
]);