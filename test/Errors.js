// data Errors =
//      TemplateFileDoesNotExist { package :: String, name :: String }


const TemplateFileDoesNotExist = name =>
    ({package: "Text.Template", kind: "TemplateFileDoesNotExist", name});


module.exports = {
    TemplateFileDoesNotExist
};