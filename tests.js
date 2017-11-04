const Unit = require("./test/Libs").Unit;


Unit.Suite("All")([
    require("./test/TemplateToolTest"),
    require("./test/UseTest")
])
    .then(Unit.showDetail)
    .then(Unit.showSummary)
    .then(Unit.setExitCodeOnFailures);
