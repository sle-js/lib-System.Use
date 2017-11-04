// data Errors =
//      UnknownToolNameFormat { package :: String, name :: String }
//    | UnknownToolProvider { package :: String, provider :: String, valid :: Array String }
//    | UnknownTool { package :: String, name :: String }


const UnknownToolNameFormat = name =>
    ({package: "lib-System.Use", kind: "UnknownToolNameFormat", name});


const UnknownToolProvider = provider => valid =>
    ({package: "lib-System.Use", kind: "UnknownToolProvider", provider, valid});


const UnknownTool = name =>
    ({package: "lib-System.Use", kind: "UnknownTool", name});


module.exports = {
    UnknownTool,
    UnknownToolNameFormat,
    UnknownToolProvider
};