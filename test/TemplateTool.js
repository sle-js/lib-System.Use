const FileSystem = require("../src/FileSystem");
const Path = require("path");


const replaceExtension = newExtension => fileName => {
    const parseFileName =
        Path.parse(fileName);

    return Path.join(parseFileName.dir, parseFileName.name + newExtension);
};
assumptionEqual(replaceExtension(".js")("/home/bob/test.sample"), "/home/bob/test.js");
assumptionEqual(replaceExtension(".js")("./test.sample"), "test.js");


const target = fileName =>
    replaceExtension(".js")(fileName);


const translate = fileName => {
    const targetFileName =
        replaceExtension(".js")(fileName);


    return FileSystem.readFile(fileName);
};


module.exports = {
    target,
    translate
};

