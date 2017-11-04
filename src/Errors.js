// data Errors =
//      UnknownToolNameFormat { name :: String }
//    | UnknownToolProvider { provider :: String, valid :: Array String }
//    | UnknownTool { name :: String }


const UnknownToolNameFormat = name =>
    ({kind: "UnknownToolNameFormat", name});


const UnknownToolProvider = provider => valid =>
    ({kind: "UnknownToolProvider", provider, valid});


const UnknownTool = name =>
    ({kind: "UnknownTool", name});


module.exports = {
    UnknownTool,
    UnknownToolNameFormat,
    UnknownToolProvider
};