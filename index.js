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


const useOn = toolName => fileName => {
    const loadTool = toolName => {
        const indexOfColon =
            String.indexOf(":")(toolName);

        if (indexOfColon.isNothing()) {
            return Promise.reject(Errors.UnknownToolNameFormat(toolName));
        } else {
            const handlerName =
                String.substring(0)(indexOfColon.withDefault(0) + 1)(toolName);

            const handlerArgument =
                String.drop(indexOfColon.withDefault(0) + 1)(toolName);

            if (handlers.hasOwnProperty(handlerName)) {
                return handlers[handlerName](handlerArgument)
                    .catch(_ => Promise.reject(Errors.UnknownTool(toolName)));
            } else {
                return Promise.reject(Errors.UnknownToolProvider(handlerName)(Object.keys(handlers)));
            }
        }
    };

    return loadTool(toolName)
        .then(tool => {
            // const targetFileName =
            //     tool.target(fileName);

            return tool;
        });
};


module.exports = {
    use,
    useOn
};
