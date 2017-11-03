const Unit = require("./test/Libs").Unit;


Unit.Suite("All")([
    require("./test/TemplateToolTest")
])
    .then(Unit.showDetail)
    .then(Unit.showSummary)
    .then(Unit.setExitCodeOnFailures);
