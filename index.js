const Errors = require("./src/Errors");
const FileSystem = require("./src/FileSystem");
const String = require("./src/String");


const promiseRequire = name => {
    try {
        return Promise.resolve(require(name));
    } catch (e) {
        return Promise.reject(e);
    }
};


const fileExists = fileName =>
    FileSystem.stat(fileName)
        .then(stat => stat.isFile())
        .catch(_ => false);


const modificationTime = fileName =>
    FileSystem.stat(fileName)
        .then(stat => stat.mtime);


const use = fileName =>
    "";


const handlers = {
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


const compile = tool => fileName => {
    console.log(`Compiling ${fileName}`);

    return tool
        .translate(fileName)
        .then(_ => promiseRequire(tool.target(fileName)));
};


const useOn = toolName => fileName =>
    loadTool(toolName)
        .then(tool => {
            const targetFileName =
                tool.target(fileName);

            return fileExists(targetFileName)
                .then(exists => exists
                    ? Promise.all([modificationTime(fileName), modificationTime(targetFileName)])
                        .then(times => times[0] < times[1]
                            ? promiseRequire(targetFileName)
                            : compile(tool)(fileName))
                    : compile(tool)(fileName));
        });


module.exports = {
    use,
    useOn
};
