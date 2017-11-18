const Errors = require("./src/Errors");
const FileSystem = require("./src/Libs").FileSystem;
const String = require("./src/String");


const promiseMRequire = name => {
    try {
        return Promise.resolve(mrequire("core:" + name));
    } catch (e) {
        return Promise.reject(e);
    }
};


const promiseRequire = name => {
    try {
        return Promise.resolve(require(name));
    } catch (e) {
        return Promise.reject(e);
    }
};


const fileExists = fileName =>
    FileSystem
        .stat(fileName)
        .then(stat => stat.isFile())
        .catch(_ => false);


const modificationTime = fileName =>
    FileSystem
        .stat(fileName)
        .then(stat => stat.mtime);


const use = fileName =>
    "";


const handlers = {
    "core:": promiseMRequire,
    "file:": promiseRequire
};


const loadTool = toolName =>
    String.indexOf(":")(toolName).reduce(
        () => Promise.reject(Errors.UnknownToolNameFormat(toolName)))(
        index => {
            const handlerName =
                String.substring(0)(index + 1)(toolName);

            const handlerArgument =
                String.drop(index + 1)(toolName);

            return (handlers.hasOwnProperty(handlerName))
                ? handlers[handlerName](handlerArgument)
                    .catch(_ => Promise.reject(Errors.UnknownTool(toolName)))
                : Promise
                    .reject(Errors.UnknownToolProvider(handlerName)(Object.keys(handlers)));
        });


const compile = tool => sourceName => {
    console.log(`Compiling ${sourceName}`);

    return tool
        .translate(sourceName)
        .then(_ => promiseRequire(tool.target(sourceName)));
};


const useOn = toolName => sourceName =>
    loadTool(toolName)
        .then(tool => {
            const targetName =
                tool.target(sourceName);

            return fileExists(targetName)
                .then(exists => exists
                    ? Promise.all([modificationTime(sourceName), modificationTime(targetName)])
                        .then(times => times[0] < times[1]
                            ? promiseRequire(targetName)
                            : compile(tool)(sourceName))
                    : compile(tool)(sourceName));
        });


module.exports = {
    use,
    useOn
};
