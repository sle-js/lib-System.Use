const process = a => b => {
    const r=[];
    r.push("Hello ");
    r.push(a);
    r.push(",");
    r.push("\n");
    r.push("\n");
    r.push("Be safe.");
    r.push("\n");
    r.push("\n");
    r.push("From your friend ");
    r.push(b);
    r.push(".");
    return r.join("");
};


module.exports = process;
