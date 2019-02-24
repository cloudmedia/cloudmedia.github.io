/**
 * Submit.js
 * Written by: Jay Simons
 * Cloudulus.Media (https://code.cloudulus.media)
 */

class Submit
{
    constructor(url)
    {
        this.url = url;
        this.query={};
        this.message = "";
        this.response = null;
        this.callback;
        return true;
    }

    addData(fld, val)
    {
        if (typeof fld === typeof undefined) fld="";
        if (typeof val === typeof undefined) val="";

        if (fld.length < 1)
        {
            this.message = "NULL field name not allowed!";
            this.log();
            return false;
        }

        this.query[fld] = val;
        return true;
    }

    submit(resType, callback)
    {
        this.callback = callback;
        if (typeof resType === typeof undefined) resType = null;
        $.post(this.url, this.query, $.proxy(this.process, this), resType);
        return true;
    }

    process(data, callback)
    {
        callback = this.callback;
        this.response = data;
        callback(data);
    }

    log()
    {
        console.log("Submit.js: "+this.message);
        return true;
    }
}