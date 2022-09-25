////////////////////////
// ┌────────────────┐ //
// │ MADE BY KRONAE │ //
// └────────────────┘ //
////////////////////////

const isNodeJS = new Function(`try {document} catch(err) {return true}; return false`)();
const newLine = `
`;

// EFMF for HTML
/** This function can fetch and modify element using Selector and parse it using EFMF_element.parse(). It doesn't work in Node.js.*/
EFMF_element = function(selectorsOrTagname, id) {
    var selectors = selectorsOrTagname;
    if (selectors == undefined) {
        throw Error("EFMF(): selectors or tag name is not set!");
    } else {
        if (EFMF.can(() => typeof(this) == "function" || this == window) ? typeof(this) == "function" || this == window : this.type != undefined) {
            var out = EFMF.parse(selectors).inselector();
            out.childs = new Selectors();
            for (var i = 0; i < out.length; i++) {
                out[i] = out[i].inselector(false);
                var childs = EFMF.parse(out[i].selectors + " > *").inselector();
                for (var ii = 0; ii < childs.length; ii++) {
                    out.childs.push(childs[ii]);
                }
            }
            var childsSelectors = [];
            for (var i = 0; i < out.childs.length; i++) {
                childsSelectors.push(out.childs[i].selectors);
            }
            out.childs = EFMF.parse(childsSelectors).inselector();
            return out;
        } else {
            var tagName = selectorsOrTagname;
            var id = id == undefined ? "EFMF-temp-html" : id;
            var temp = document.createElement(tagName);
            temp.setAttribute("id", id);
            temp.style.display = "none";
            _("html").appendChild(temp);
            var out = _("#" + id);
            setTimeout(function() {
                out.end();
            }, EFMF.settings.tempElement.defEndtime);
            out.end = function() {
                var elements = document.querySelectorAll(this.selectors);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].remove();
                }
                return true
            }
            return out
        }
    }
}
// HTML ELEMENT EDITER
/** This function parses the element. It doesn't work in Node.js. */
EFMF_element.parse = function(data) {
    var out = new Selectors(data);
    out.selectors = data
    out.selectors = EFMF.type(out.selectors) == "array" ? out.selectors : [out.selectors]

    if (out.selectors.indexOf(document) != -1) {
        out.ready = function(func) {
            EFMF.docreadys.push(func);
        }
    }
    /** Get nth child element */
    out.th = function(th) {
        if (document.querySelectorAll(this.selectors).length > 1) {
            return EFMF(`${this.selectors}:nth-child(${th})`);
        } else {
            return EFMF(this.selectors);
        }
    }
    /** Get or set attribute of this element. */
    out.attribute = function(attribute, value) {
        return value == undefined ? this.getAttribute(attribute) : this.setAttribute(attribute, value);
    }
    /** Get or set attribute of this element. It acts like EFMF_element.parse(...).attribute() */
    out.attr = function(attribute, value) {
        return this.attribute(attribute, value);
    }
    /** Set attribute of this element. */
    out.setAttribute = function(attribute, value) {
        var elements = document.querySelectorAll(this.selectors);
        if (attribute == undefined || value == undefined) {
            throw Error("EFMF(...).setAttribute: attribute or value does not set.");
        } else {
            if (attribute.match(/^(action|method|lang|value|name|class|id|style|href|alt|type|placeholder|aria-describedby|autocomplete|onkeyup|onkeypress|onkeydown)$/) == null ? true : false) {
                console.warn("EFMF(...).setAttribute: This attribute name is not good!");
            }
            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute(attribute, value);
            }
            return true
        }
    }
    /** Set attribute of this element. It acts like EFMF_element.parse(...).setAttribute() */
    out.setAttr = function(attribute, value) {
        return this.setAttribute(attribute, value);
    }
    /** Remove attribute of this element. */
    out.removeAttribute = function(attribute) {
        var elements = document.querySelectorAll(this.selectors);
        if (attribute == undefined) {
            throw Error("EFMF(...).removeAttribute: attribute or value does not set.");
        } else {
            for (var i = 0; i < elements.length; i++) {
                elements[i].removeAttribute(attribute);
            }
            return true
        }
    }
    /** Remove attribute of this element. It acts like EFMF_element.parse(...).removeAttribute() */
    out.removeAttr = function(attribute) {
        return this.removeAttribute(attribute);
    }
    /** Get attribute of this element. */
    out.getAttribute = function(attribute) {
        var elements = document.querySelectorAll(this.selectors);
        if (attribute == undefined) {
            throw Error("EFMF(...).getAttribute: attribute or value does not set.");
        } else {
            var out = []
            for (var i = 0; i < elements.length; i++) {
                out.push(elements[i].getAttribute(attribute));
            }
            return out
        }
    }
    /** Get attribute of this element. It acts like EFMF_element.parse(...).getAttribute() */
    out.getAttr = function(attribute) {
        return this.getAttribute(attribute);
    }
    /** Get or set value of this element. */
    out.val = function(text) {
        var elements = document.querySelectorAll(this.selectors);
        if (text == undefined) {
            var out = []
            for (var i = 0; i < elements.length; i++) {
                out.push(elements[i].value);
            }
            return out
        } else {
            for (var i = 0; i < elements.length; i++) {
                elements[i].value = text
            }
            return true
        }
    }
    /** Get child elements of this element. */
    out.child = function(selectors) {
        return EFMF(this.selectors + " > " + selectors);
    }
    /** Delete this element. */
    out.delete = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
        return true
    }
    /** Remove this element. It acts like EFMF_element.parse(...).delete() */
    out.remove = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
        return true
    }
    /** Select this element. */
    out.select = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].select();
        }
        return true
    }
    /** Focus this element. */
    out.focus = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].focus();
        }
        return true
    }
    /** Show this element. */
    out.show = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            document.querySelector(elements[i].selectors).style.display = "block"
        }
        return true
    }
    /** Hide this element. */
    out.hide = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none"
        }
        return true
    }
    /** Append HTML code in this element. */
    out.append = function(HTML) {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].append(HTML);
        }
        return true
    }
    /** Append a child code. */
    out.appendChild = function(HTML) {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            elements[i].appendChild(HTML);
        }
        return true
    }
    /** Get or set HTML code in this element. */
    out.html = function(HTML, nl) {
        var elements = document.querySelectorAll(this.selectors);
        if (HTML == undefined) {
            var out = []
            for (var i = 0; i < elements.length; i++) {
                out.push(elements[i].innerHTML);
            }
            return out
        } else {
            for (var i = 0; i < elements.length; i++) {
                if(nl == true) {
                    elements[i].innerHTML = HTML.replaceAll("\nl","<p class=\"EFMF_AUTO_NL\"></p>");
                } else {
                    elements[i].innerHTML = HTML
                }
            }
            return true
        }
    }
    /** Get or set outerHTML of this element. */
    out.outerHTML = function(HTML) {
        var elements = document.querySelectorAll(this.selectors);
        if (HTML == undefined) {
            var out = []
            for (var i = 0; i < elements.length; i++) {
                out.push(elements[i].outerHTML);
            }
            return out
        } else {
            for (var i = 0; i < elements.length; i++) {
                elements[i].outerHTML = HTML
            }
            return true
        }
    }
    /** Fade out this element. */
    out.fadeOut = function(time, options) {
        var elements = document.querySelectorAll(this.selectors);
        if (time == undefined) {
            var time = EFMF.settings.fade.defTime
        } else if (EFMF.type(time) != "number") {
            throw Error("EFMF(...).fadeOut: time is not a number!");
        }
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "block"
            elements[i].style.opacity = 1
        }
        var thisEle = elements
        var Intr = setInterval(function() {
            for (var i = 0; i < thisEle.length; i++) {
                thisEle[i].style.display = "block"
                thisEle[i].style.opacity = (thisEle[i].style.opacity * 1) - (1 / EFMF.settings.fade.frames);
                if (thisEle[i].style.opacity < 0) {
                    thisEle[i].style.opacity = 0
                    thisEle[i].style.display = "none"
                    if (EFMF.type(options) == "function") {
                        options();
                    } else if (EFMF.type(options) == "object") {
                        if (EFMF.type(options.callback) == "function") {
                            options.callback();
                        }
                    }
                    clearInterval(Intr);
                }
            }
            if (EFMF.type(options) == "object") {
                if (EFMF.type(options.while) == "function") {
                    options.while(1 / EFMF.settings.fade.frames);
                }
            }
        }, time / EFMF.settings.fade.frames);
        return true
    }
    /** Fade in this element. */
    out.fadeIn = function(time, options) {
        var elements = document.querySelectorAll(this.selectors);
        if (time == undefined) {
            var time = EFMF.settings.fade.defTime
        } else if (EFMF.type(time) != "number") {
            throw Error("EFMF(...).fadeOut: time is not a number!");
        }
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "block"
            elements[i].style.opacity = 0
        }
        var thisEle = elements
        var Intr = setInterval(function() {
            for (var i = 0; i < thisEle.length; i++) {
                thisEle[i].style.display = "block"
                thisEle[i].style.opacity = (thisEle[i].style.opacity * 1) + (1 / EFMF.settings.fade.frames);
                if (thisEle[i].style.opacity > 1) {
                    thisEle[i].style.opacity = 1
                    thisEle[i].style.display = "block"
                    if (EFMF.type(options) == "function") {
                        options();
                    } else if (EFMF.type(options) == "object") {
                        if (EFMF.type(options.callback) == "function") {
                            options.callback();
                        }
                    }
                    clearInterval(Intr);
                }
            }
            if (EFMF.type(options) == "object") {
                if (EFMF.type(options.while) == "function") {
                    options.while(1 / EFMF.settings.fade.frames);
                }
            }
        }, time / EFMF.settings.fade.frames);
        return true
    }
    /** Create a eventListener in this element. */
    out.on = function(event, func) {
        var elements = document.querySelectorAll(this.selectors);
        if (event == undefined || func == undefined) {
            throw Error("EFMF(...).on event or func does not set.");
        } else {
            for (var i = 0; i < elements.length; i++) {
                return elements[i].addEventListener(event, func);
            }
        }
    }
    /** Move cursor. */
    out.cursor = function(cursorPosition) {
        var element = document.querySelector(this.selectors);
        if (element == null) {
            throw Error("EFMF(...).cursor: can't find the element!");
        } else {
            if (cursorPosition == undefined) {
                var cursorPosition = 0
                if (document.selection) {
                    element.focus();
                    var oSel = document.selection.createRange();
                    oSel.moveStart("character", -element.value.length);
                    var cursorPosition = oSel.text.length
                } else if (element.selectionStart || element.selectionStart == "0") {
                    var cursorPosition = element.selectionDirection == "backward" ? element.selectionStart : element.selectionEnd
                }
                return cursorPosition;
            } else {
                if (element.createTextRange) {
                    var range = element.createTextRange();
                    range.move("character", cursorPosition);
                    range.select();
                } else {
                    if (element.selectionStart) {
                        element.focus();
                        element.setSelectionRange(cursorPosition, cursorPosition);
                    } else {
                        element.focus();
                    }
                }
            }
        }
    }
    out.style = document.querySelector(out.selectors) == null ? {} : document.querySelector(out.selectors).style
    /** Submit this element. It only works on form elements. */
    out.submit = function() {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].submit != undefined) {
                elements[i].submit();
            }
        }
    }
    /** Execute command at this element. */
    out.execCommand = function(aCommandName, aShowDefaultUI, aValueArgument) {
        var elements = document.querySelectorAll(this.selectors);
        for (var i = 0; i < elements.length; i++) {
            document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
        }
    }
    /** This function is a function that parses selectors, and it is automatically executed when EFMF_element() is executed, so there is no need to execute it manually. It is not recommended to use. */
    out.inselector = function(nthchild) {
        var out = this
        for (var i = 0; i < out.length; i++) {
            if (EFMF.type(out[i]) == "object") {
                out[i] = EFMF.parse(`${out.selectors == undefined ? out[i].selectors == undefined ? s : out[i].selectors : out.selectors}${nthchild == false ? "" : document.querySelectorAll(out.selectors).length > 1 ? `:nth-child(${i + 1})` : ""}`);
            } else {
                throw Error(`EFMF(...).inselector: this[${i}] is not object.`);
            }
        }
        return out
    }
    return out
}
// document querySelector
if(!isNodeJS) {
    /** This function is really document.querySelectorAll. */
    document.RquerySelectorAll = document.querySelectorAll
    /** This function is the EFMF version of document.querySelector. */
    document.querySelector = function(selectors) {
        return document.querySelectorAll(selectors).length > 0 ? document.querySelectorAll(selectors)[0] : null
    }
    /** This function is the EFMF version of document.querySelectorAll. */
    document.querySelectorAll = function(selectors) {
        var out = new Selectors();
        if(EFMF.type(selectors) != "array") {
            var selectors = [selectors];
        }
        for(var i = 0; i < selectors.length; i++) {
            if(selectors[i].toString() == "[object HTMLDocument]") {
                selectors[i] = "html";
            }
            if(EFMF.can(function() { document.RquerySelectorAll(selectors[i]) }) == true) {
                var data = document.RquerySelectorAll(selectors[i]);
                for(var ii = 0; ii < data.length; ii++) {
                    out.push(data[ii]);
                }
            }
        }
        return out
    }
}

// EFMF for Node.js
EFMF_node = function() {
        
}


if (isNodeJS) {
    var EFMF = EFMF_node;
} else {
    EFMF = EFMF_element;
}

// Def settings & Variables
EFMF.docreadys = [];
EFMF.settings = {
    "fade": {
        "frames": 30,
        "defTime": 0
    },
    "ajax": {
        "defURL": "/",
        "defMethod": "GET",
        "settingTime": 100
    },
    "tempElement": {
        "defEndtime": 100
    },
    "css": true,
    "econsole": false
}
EFMF.types = {
    "list": [],
    "data": []
}

// Sub functions v1.2.0

/** Get length of VALUE */
EFMF.len = function(value) {
    try {
        return value.length
    } catch(err) {
        try {
            return value.length();
        } catch(err) {
            return -1
        }
    }
}
/** Check if the function can be executed. */
EFMF.can = function(func, msg) {
    if(typeof(func) == "function") {
        try {
            func();
        } catch(err) {
            return msg == true ? err : false
        }
        return true
    } else {
        return false
    }
}
/** Replace values with letters. */
EFMF.toString = (any, radix) => {
    if(any == undefined) {
        return "undefined"
    } else if(can(function() {JSON.stringify(any)}) == true) {
        return JSON.stringify(any);
    } else {
        return any.toString(radix);
    }
}
/** Split array, object or string. */
EFMF.split = (any, at) => {
    if(EFMF.type(any) == "array") {
        var out = []
        for(var i = 0; i < any.length; i++) {
            if(["number","string"].indexOf(any[i])) {
				var value = any[i].toString().split(at);
				var outvalue = []
				for(var ii = 0; ii < value.length; ii++) {
					outvalue.push(value[ii].replaceAll(",",""));
				}
				out.push(outvalue);
            }
        }
        return out
    } else if(EFMF.type(any) == "object") {
        var out = []
        for(var i = 0; i < Object.values(any).length; i++) {
            if(["number","string"].indexOf(Object.values(any)[i])) {
                out.push(Object.values(any)[i].toString().split(at).toString().replaceAll(",",""));
            }
        }
        return out
    } else  if(EFMF.type(any) == "string") {
        return any.split(at);
    } else {
        throw Error("EFMF.split: Can't split it.");
    }
}
/** Replace the value with Dict. */
EFMF.toDict = (v) => {
    if(EFMF.type(v) == "array") {
        if(v.length == 1) {
            var out = v[0]
            for(var i = 0; i < Object.keys(v).length; i++) {
                out[Object.keys(v)[i]] = Object.values(v)[i]
            }
            return out
        } else {

        }
    } else {
        throw Error("EFMF.toDict: This is not a array.");
    }
}
/** Ajax. It doesn't work in Node.js. */
EFMF.ajax = (optionsORurl, callback) => {
    if(XMLHttpRequest == undefined) {
        throw Error("Can't ajax now! XMLHttpRequest isn't set!");
    } else {
        var options = EFMF.type(optionsORurl) == "string" ? {"url": optionsORurl} :
                      optionsORurl == undefined ? {} : optionsORurl
        var out = new XMLHttpRequest();
        out.done = callback != undefined ? callback : options.success == undefined ? null : options.success
        out.url = options.url == undefined ? EFMF.settings.ajax.defURL : options.url
        options.method = options.method == undefined ? EFMF.settings.ajax.defMethod : options.method
        setTimeout(function() {
            out.onreadystatechange = out.done == null ? out.onreadystatechange : function() {
                if(out.readyState == XMLHttpRequest.DONE) {
                    var response = can(function () { JSON.parse(out.response) }) == true ? JSON.parse(out.response) : out.response
                    out.json = ["array","object"].indexOf(EFMF.type(response)) != -1
                    out.error = out.status != 200
                    if(EFMF.type(out.done) == "function") {
                        out.done({
                            "response": response,
                            "status": out.status,
                            "json": out.json,
                            "error": out.error
                        });
                    }
                }
            }
            out.open(options.method, out.url);
            out.send(options.data == undefined ? {} : options.data);
        }, EFMF.settings.ajax.settingTime);
        return out
    }
}
/** Limit the number of decimals by setting the maximum number of decimal places. */
EFMF.float = function(it, length) {
    var it = it.toString();
    var spl = it.split(".");
	if(spl.length != 2) {
		spl.push("0");
	}
    if(spl.length == 2) {
        if(length < 0) {
            throw Error("length is very low.");
        } else {
            for(var i = 0; i < it.length; i++) {
                if(spl[1].length == length) {
                    break
                } else if(spl[1].length > length) {
                    spl[1] = spl[1].substr(0, spl[1].length - 1);
                } else {
                    spl[1] = spl[1] + "0"
                }
            }
            return (spl[0] + "." + spl[1]) * 1
        }
    } else {
		throw Error("Easy_float: So many dots.");
	}
}
/** Get type of value. */
EFMF.getType = function(value) {
    if(value == undefined) {
        return "undefined"
    } else if(EFMF.types.list.indexOf(value.toString()) != -1) {
        for(var i = 0; i < EFMF.types.data.length; i++) {
            if(EFMF.types.data[i].name == value.toString()) {
                return EFMF.types.data[i].type;
            }
        }
    } else if(typeof(value) == "object") {
        if(EFMF.can(function() { JSON.stringify(value) }) == true) {
            if(value.toString() == "[object Object]") {
                return "object";
            } else if(value.toString().substr(0,1) == "[") {
                return typeof(value);
            } else {
                return "array";
            }
        } else {
            return "object";
        }
    } else {
        return typeof(value);
    }
}
/** Make a type. */
EFMF.makeType = function(name, toString, defProto, global, func) {
    return new Function("EFMFTYPES", "prototypes", `if(EFMFTYPES.list.indexOf("${toString == undefined ? "[EFMF newTYPE]" : toString}") == -1) {
        ${!global ? "var " : ""}${name} = ${func == undefined ? `function() {}` : func.toString()};
        ${name}.prototype = ${defProto == undefined ? "Object" : defProto}.prototype;
        ${name}.prototype.toString = function() {
            return "${toString == undefined ? "[EFMF newTYPE]" : toString}";
        }
        if(prototypes != undefined) {
            for(var i = 0; i < Object.keys(prototypes).length; i++) {
                ${name}.prototype[Object.keys(prototypes)[i]] = Object.values(prototypes)[i];
            }
        }
        EFMFTYPES.list.push("${toString == undefined ? "[EFMF newTYPE]" : toString}");
        EFMFTYPES.data.push({
            "name": "${toString == undefined ? "[EFMF newTYPE]" : toString}",
            "type": "${name == undefined ? "newType" : name}"
        });
    } else {
        throw Error("new EFMF.type: This tostring name is already set.");
    }`);
}
/** Get or make a type. */
EFMF.type = function(any, type, toString, defProto, variable, func) {
    if(isNodeJS) {
        return EFMF.getType(any);
    } else {
        if(EFMF.can(() => typeof(this) == "function" || this == window) ? typeof(this) == "function" || this == window : this.type != undefined) {
            return EFMF.getType(any);
        } else {
            return EFMF.makeType(any, type, toString, defProto, variable, func);
        }
    }
}
/** Check device. It dosn't work in Node.js. */
EFMF.isMobile = function() {
    if(!isNodeJS) {
        if (navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
            return true
        } else {
            return false
        }
    } else {
        throw Error("EFMF.copy: Can't check this condition in Node.js!");
    }
}
/** Replace url. It dosn't work in Node.js. */
EFMF.replaceURL = function(urlORelement) {
    if(EFMF.type(urlORelement) == "string") {
        var url = urlORelement
    } else {
        try {
            if(EFMF.isEmpty(urlORelement.value) == false) {
                var url = urlORelement.value
            } else if(EFMF.isEmpty(urlORelement.innerHTML) == false) {
                var url = urlORelement.innerHTML
            } else if(EFMF.isEmpty(urlORelement.text) == false) {
                var url = urlORelement.innerHTML
            } else {
                throw Error("EFMF: Can't find the url in '" + urlORelement + "'");
            }
        } catch(error) {
            throw error
        }
    }
    if(isNodeJS == false) {
        var temp = new EFMF("form","EFMF-replURL-function-runner");
        temp.setAttribute("method", "GET");
        temp.setAttribute("action", url);
        temp.submit();
        temp.end();
    } else {
        throw Error("EFMF.copy: Can't replace the URL in Node.js!");
    }
}
/** Copy text. It dosn't work in Node.js. */
EFMF.copy = function(text) {
    if(isNodeJS == false) {
        var temp = new EFMF("textarea", "EFMF-copy-function-runner");
        temp.val(text);
        temp.style.display = "block"
        temp.select();
        document.execCommand("copy");
        temp.end();
    } else {
        throw Error("EFMF.copy: Can't copy in Node.js!");
    }
}
EFMF.replURL = function(urlORelement) {
    EFMF.replaceURL(urlORelement);
}
EFMF.link = function(urlORelement) {
    EFMF.replaceURL(urlORelement);
}
EFMF.time = function(time, func) {
    setTimeout(func, time);
}
EFMF.replaceAll = function(str, it, to) {
    return str.replace(new RegExp(it.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), to);
}
EFMF.isJSON = function(it) {
    return ["object","array"].indexOf(EFMF.type(it)) != -1
}
EFMF.isEmpty = function(it) {
    var it = EFMF.type(it) == "string" ? it.replaceAll(" ","").replaceAll(newLine,"") : it
    return [undefined, "", 0, [], {}, NaN, null].indexOf(it) == -1 ? it.length <= 0 ? true : EFMF.type(it) == "object" ? Object.keys(it).length <= 0 : false : true
}
EFMF.noSpace = function(text) {
    return text.toString().replaceAll(" ","").replaceAll("\n","").replaceAll("\t","");
}
EFMF.NSlength = function(text) {
    return EFMF.noSpace(text).length
}

// BETA TESTING FUNCTIONS
EFMF.data = {}
EFMF.data.reduction = function(x, size, binary) {
    if(binary == undefined) {
        var binary = 2
    }
    var negative = x >= 0 ? 0 : 1
    
    var numsOFdigits = 0
    while(true) {
        if(x - Math.floor(x) != 0) {
            var x = x * 10
        } else {
            break
        }
        var numsOFdigits = numsOFdigits + 1
    }
    var x = x < 0 ? ( 0 - x ) : x
    var binInt = x.toString(binary);
    var out = [negative]
    var binNumsOFdigits = numsOFdigits.toString(binary);
    var binSize = size.toString(binary);
    out.push(binSize.substr(0, 1));
    out.push(binSize.substr(1, 1));
    for(var i = 0; i < size; i++) {
        out.push(binNumsOFdigits.substr(i,1) != "" ? binNumsOFdigits.substr(i,1) : binNumsOFdigits.substr(i,1));
    }
    for(var i = 0; i < size; i++) {
        out.push(binInt.substr(i,1) != "" ? binInt.substr(i,1) : binInt.substr(i,1));
    }
    return out
}
EFMF.data.enlargement = function(x, binary) {
    if(binary == undefined) {
        var binary = 2
    }
    var negative = x[0]
    var size = parseInt(x[1] + x[2], binary);
    var numsOFdigits = ""
    for(var i = 0; i < size; i++) {
        var numsOFdigits = numsOFdigits + x[i + 3]
    }
    var numsOFdigits = parseInt(numsOFdigits, binary);
    var value = ""
    for(var i = 0; i < size; i++) {
        var value = value + x[i + 3 + size]
        console.log(value);
    }
    var value = parseInt(value, binary);
    console.log(negative);
    console.log(size);
    console.log(numsOFdigits);
    console.log(value);
    if(negative == 1) {
        var value = 0 - value
    }
    for(var i = 0; i < numsOFdigits; i++) {
        var value = value / 10
    }
    return value
}

// New type
if(isNodeJS == false) {
    EFMF.makeType("Selectors", "[EFMF selectorsList]", "Array", true, function(selectorsORcount) {
        if(EFMF.type(selectorsORcount) == "string") {
            var count = document.querySelectorAll(selectorsORcount).length
        }
        if(EFMF.type(selectorsORcount) == "array") {
            var count = 0
            for(var i = 0; i < selectorsORcount.length; i++) {
                var count = count + document.querySelectorAll(selectorsORcount[i]).length
            }
        }
        if(EFMF.type(count) == "number") {
            var out = new Selectors();
            for(var i = 0; i < count; i++) {
                out.push(new Selector());
            }
            return out
        }
    })(EFMF.types);
    EFMF.makeType("Selector", "[EFMF selector]", "Object", true, function(selectors) {
        if(selectors != undefined) {
            return EFMF(selectors);
        }
    })(EFMF.types);
}

// PROTOTYPE
String.prototype.type = "string"
if(String.prototype.replaceAll == undefined) {
    String.prototype.replaceAll = function(it, to) {
        EFMF.replaceAll(this, it, to);
    }
}
String.prototype.write = function(t) {
    return this + t
}
String.prototype.color = function(v) {
    if(v == undefined) {
        return this.replaceAll("&le","\x1b[93m").replaceAll("&f","\x1b[37m")
        .replaceAll("&b0","\x1b[40m").replaceAll("&b4","\x1b[41m")
        .replaceAll("&b2","\x1b[42m").replaceAll("&be","\x1b[43m")
        .replaceAll("&b1","\x1b[44m").replaceAll("&bd","\x1b[45m")
        .replaceAll("&bb","\x1b[46m").replaceAll("&bf","\x1b[47m")
        .replaceAll("&b7","\x1b[100m").replaceAll("&ba","\x1b[102m")
        .replaceAll("&b9","\x1b[104m").replaceAll("&blb","\x1b[106m")
        .replaceAll("&0","\x1b[30m").replaceAll("&1","\x1b[34m")
        .replaceAll("&2","\x1b[32m").replaceAll("&3","\x1b[36m")
        .replaceAll("&4","\x1b[31m").replaceAll("&5","\x1b[35m")
        .replaceAll("&6","\x1b[33m").replaceAll("&7","\x1b[90m")
        .replaceAll("&8","\x1b[33m").replaceAll("&9","\x1b[94m")
        .replaceAll("&a","\x1b[92m").replaceAll("&b","\x1b[96m")
        .replaceAll("&c","\x1b[31m").replaceAll("&d","\x1b[35m")
        .replaceAll("&e","\x1b[33m").replaceAll("&f","\x1b[37m")
        .replaceAll("&r","\x1b[0m").replaceAll("&n","\x1b[4m")
        .replaceAll("&&","")
        + "\x1b[0m"; // \x1b[0m`
    } else {
        if(v == "red") {
            return "\x1b[31m" + this; // \x1b[0m]
        } else if(v == "yellow") {
            return "\x1b[33m" + this; // \x1b[0m]
        } else if(v == "orange") {
            return "\x1b[33m" + this; // \x1b[0m]
        } else if(v == "lightblue") {
            return "\x1b[96m" + this; // \x1b[0m]
        } else if(v == "blue") {
            return "\x1b[94m" + this; // \x1b[0m]
        } else if(v == "white") {
            return "\x1b[47m" + this; // \x1b[0m]
        } else if(v == "black") {
            return "\x1b[30m" + this; // \x1b[0m]
        } else if(v == "reset") {
            return this + "\x1b[0m"
        }
    }
}
String.prototype.NSlength = function() {
    return EFMF.NSlength(this);
}
Number.prototype.length = function() {
    return this.toString().length
}
Object.prototype.type = "object"
Object.prototype.toStr = function() {
    return JSON.stringify(this);
}
Object.prototype.keys = function() {
    return Object.keys(this);
}
Object.prototype.values = function() {
    return Object.values(this);
}
Object.prototype.split = function(to) {
    return EFMF.split(this, to);
}
Array.prototype.values = function() {
    var out = []
    for(var i = 0; i < this.length; i++) {
        out.push(this[i]);
    }
    return out
}
Array.prototype.keys = function() {
    return Object.keys(this);
}
Array.prototype.split = function(to) {
    return EFMF.split(this, to);
}
Array.prototype.remove = function(it) {
    var out = []
    if(EFMF.type(it) == "string") {
        var ok = true
        for(var i = 0; i < this.length; i++) {
            var check = true
            if(this[i] == it) {
                var check = false
            }
            if(check == true || ok == false) {
                out.push(this[i]);
            } else {
                var ok = false
            }
        }
        return out
    } else {
        throw Error("EFMF_ Array.remove: It arg is not string!");
    }
}
Array.prototype.removeAll = function(it) {
    var out = []
    if(EFMF.type(it) != "array") {
        var it = [it]
    }
    for(var i = 0; i < this.length; i++) {
        var check = true
        for(var ii = 0; ii < it.length; ii++) {
            if(this[i] == it[ii]) {
                var check = false
            }
        }
        if(check == true) {
            out.push(this[i]);
        }
    }
    return out
}
Array.prototype.indexofAnother = function(it) {
    var it = EFMF.type(it) == "array" ? it : [it]
    var count = 0
    var another = 0
    for(var i = 0; i < this.length; i++) {
        if(it.indexOf(this[i])) {
            count++
        } else {
            another++
        }
    }
    return another > 0
}
Function.prototype.type = "function"

// DocReady
if(isNodeJS == false) {
    window.addEventListener("load", function() {
        if(document.readyState == "complete") {
            setTimeout(function() {
                for(var i = 0; i < EFMF.docreadys.length; i++) {
                    if(EFMF.type(EFMF.docreadys[i]) == "function") {
                        EFMF.docreadys[i]();
                    }
                }
                if(EFMF("html").html()[0].toLowerCase().indexOf(`<link rel="stylesheet" href="https://efmf.netlify.app/EFMF.css">`) == -1 && EFMF.settings.css == true) {
                    EFMF("head").append(`<link rel="stylesheet" href="https://efmf.netlify.app/EFMF.css">`);
                }
            }, 5);
        }
    });
}

setTimeout(() => {
    if(EFMF.settings.econsole) {
        EFMF.makeType("EFMF_consoleLogs", "[EFMF console-logs list]", "Array", true, function() {})(EFMF.types);
        console.console = {}
        console.console.clear = console.clear;
        console.console.log = console.log;
        console.console.warn = console.warn;
        console.console.error = console.error;
        console.console.info = console.info;
        console.logs = new EFMF_consoleLogs();
        if(isNodeJS) {
            process.stdout.RWrite = process.stdout.write;
        }
        console.reload =  function() {
            console.console.clear();
            for(var i = 0; i < console.logs.length; i++) {
                if(typeof(console.logs[i]) == "object") {
                    if(console.logs[i][0].display) {
                        if(["log","info","warn","error"].indexOf(console.logs[i][0].type) != -1) {
                            if(typeof(console.logs[i][0].text) ==  "string") {
                                if(console.logs[i].length == 1) {
                                    new Function("i",`process.stdout.RWrite(JSON.stringify(console.logs[i][0].text).color())`)(i);
                                } else {
                                    new Function("i",`console.console.${console.logs[i][0].type}(console.logs[i][0].text.color())`)(i);
                                }
                            } else {
                                if(console.logs[i].length == 1) {
                                    new Function("i",`process.stdout.RWrite(JSON.stringify(console.logs[i][0].text))`)(i);
                                } else {
                                    new Function("i",`console.console.${console.logs[i][0].type}(console.logs[i][0].text)`)(i);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.LF = (type, t) => {
            return new Function("type","t",`return {
                "text": t,
                "type": type,
                "display": true,
                "val": (t) => {
                    if(typeof(console.logs[${console.logs.length}]) == "object") {
                        console.logs[${console.logs.length}].text = t
                        console.reload();
                        return true
                    } else {
                        throw Error("EFMF_Econsole: This text has been &ndeleted&r&c!");
                        return false
                    }
                },
                "show": function() {
                    if(typeof(console.logs[${console.logs.length}]) == "object") {
                        console.logs[${console.logs.length}].display = true
                        console.reload();
                        return true
                    } else {
                        throw Error("EFMF_Econsole: This text has been &ndeleted&r&c!");
                        return false
                    }
                },
                "hide": function() {
                    if(typeof(console.logs[${console.logs.length}]) == "object") {
                        console.logs[${console.logs.length}].display = false
                        console.reload();
                        return true
                    } else {
                        throw Error("EFMF_Econsole: This text has been &ndeleted&r&c!");
                        return false
                    }
                },
                "delete": function() {
                    if(typeof(console.logs[${console.logs.length}]) == "object") {
                        console.logs[${console.logs.length}] = undefined
                        console.reload();
                        return true
                    } else {
                        throw Error("EFMF_Econsole: This text has already been &ndeleted&r&c!");
                        return false
                    }
                }
            }`)(type, t);
        }
        console.log = (t) => {
            if(t == undefined) {
                var t = ""
            }
            var o = console.LF("log", t);
            console.logs.push([o, "\n"]);
            console.console.log(EFMF.type(t) == "string" ? t.color() : t);
            return o
        },
        console.info = (t) => {
            if(t == undefined) {
                var t = ""
            }
            var o = console.LF("info", t);
            console.logs.push([o, "\n"]);
            console.console.log(EFMF.type(t) == "string" ? t.color() : t);
            return o
        },
        console.warn = (t) => {
            if(t == undefined) {
                var t = ""
            }
            var o = console.LF("warn", t);
            console.logs.push([o, "\n"]);
            console.console.log(EFMF.type(t) == "string" ? t.color() : t);
            return o
        },
        console.error = (t) => {
            if(t == undefined) {
                var t = ""
            }
            var o = console.LF("error", t);
            console.logs.push([o, "\n"]);
            console.console.error(EFMF.type(t) == "string" ? t.color() : t);
            return o
        }
        if(isNodeJS) {
            process.stdout.write = (t) => {
                if(t == undefined) {
                    var t = ""
                }
                var o = console.LF("stdout", t);
                console.logs.push([o]);
                process.stdout.RWrite(EFMF.type(t) == "string" ? t.color() : JSON.stringify(t));
                return o
            }
        }
        console.clear = function() {
            console.logs = new EFMF_consoleLogs();
            console.reload();
        }
    }
}, 5);

// SHORTER SUB FUNCTIONS
for(var i = 0; i < Object.keys(EFMF).length; i++) {
    if(["parse","settings","types","docreadys"].indexOf(Object.keys(EFMF)[i]) == -1) {
        new Function("i","EFMF",`${Object.keys(EFMF)[i]} = Object.values(EFMF)[i]`)(i,EFMF);
    }
}

// OTHERS
if(isNodeJS) {
    EFMF[1] = EFMF;
    EFMF[0] = EFMF_element;
} else {
    EFMF[0] = EFMF;
    EFMF[1] = EFMF_node;
}

// SHORTER EFMF
if(!isNodeJS) {
    efmf = EFMF;
    _ = EFMF;
}

// Module exports
if(isNodeJS) {
    module.exports = EFMF;
}
