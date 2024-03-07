export function diagnose(){
    const res = {};

    // media queries
    const queries = [
        'any-hover:none',
        'any-hover:hover',
        'any-pointer:coarse',
        'any-pointer:fine',
        'any-pointer:none',
        'color',
        'color:16',
        'color:32',
        'color:64',
        'color:8',
        'display-mode:browser',
        'display-mode:fullscreen',
        'display-mode:minimal-ui',
        'display-mode:standalone',
        'display-mode:browser',
        'display-mode:minimal-ui',
        'display-mode:fullscreen',
        'display-mode:standalone',
        'grid:1',
        'hover:none',
        'hover:hover',
        'orientation:landscape',
        'orientation:portrait',
        'overflow-block:none',
        'overflow-block:paged',
        'overflow-block:optional-paged',
        'overflow-block:scroll',
        'overflow-inline:none',
        'overflow-inline:paged',
        'overflow-inline:optional-paged',
        'overflow-inline:scroll',
        'pointer:coarse',
        'pointer:fine',
        'pointer:none',
        'prefers-color-scheme:dark',
        'prefers-color-scheme:light',
        'prefers-contrast:custom',
        'prefers-contrast:less',
        'prefers-contrast:more',
        'prefers-contrast:no-preference',
        'prefers-reduced-data:no-preference',
        'prefers-reduced-data:reduce',
        'prefers-reduced-motion:no-preference',
        'prefers-reduced-motion:reduce',
        'scripting:enabled',
        'scripting:initial-only',
        'scripting:none',
        'update:fast',
        'update:none',
        'update:slow',
    ];
    res.media = {};
    for (const query of queries) {
        const match = matchMedia('('+query+')');
        const matches = match.matches;
        if (match.media === 'not all') matches = null;
        res.media[query] = matches;
    }


    res.devicePixelRatio = window.devicePixelRatio;
    res.navigator = getProperties(navigator);
    res.screen = getProperties(screen);
    res.visualViewport = getProperties(window.visualViewport);

    // performance
    res.performance = performance.getEntriesByType("navigation")[0];

    //res = flat(res);

    /*
    // window properties
    res.window = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
        screenX: window.screenX,
        screenY: window.screenY,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        pageXOffset: window.pageXOffset,
        pageYOffset: window.pageYOffset,
        screenLeft: window.screenLeft,
        screenTop: window.screenTop,
        screenAvailLeft: window.screenAvailLeft,
        screenAvailTop: window.screenAvailTop,
        screenAvailHeight: window.screenAvailHeight,
        screenAvailWidth: window.screenAvailWidth,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio,
        clientWidth: window.clientWidth,
        clientHeight: window.clientHeight,
        scrollMaxX: window.scrollMaxX,
        scrollMaxY: window.scrollMaxY,
        scrollbarWidth: window.scrollbarWidth,
        scrollbarHeight: window.scrollbarHeight,
    };
    */


    res.inputs = inputs;

    return res;
}

export function collectInputs(){
    // keypresses
    document.addEventListener('keydown', e => {
        inputs.keyboard.push({
            key: e.key,
            time: e.timeStamp,
        });
    }, {passive: true} );
    // mouse movement
    document.addEventListener('mousemove', e => {
        inputs.mouse.push({
            x: e.pageX,
            y: e.pageY,
            time: e.timeStamp,
        });
    });
    // touch movement
    document.addEventListener('touchmove', e => {
        inputs.touch.push({
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
            time: e.timeStamp,
        });
    }, {passive: true} );
}

const inputs = {
    mouse:[],
    touch:[],
    //wheel:[],
    keyboard:[],
}


// todo extensions:
// facbook container
// property "--fbc-blue-60" on body

const used = new Set();

function getProperties(obj){
    const props = Object.create(null);

    let currentProto = obj;
    while (currentProto) {
        if (currentProto===Object) break;
        for (const prop of Object.getOwnPropertyNames(currentProto)) {

            if (prop === '__proto__') continue;

            let value = null;


            try {
                value = obj[prop]; // currentProto[prop].call(obj); // how to trigger the original getter?
            } catch (e) {
                value = e.message;
            }

            if (typeof value === 'function') continue;
            if (value == null) continue;

            if ({string:1,number:1,boolean:1}[typeof value] || value == null) {
                props[prop] = value;
                continue;
            }
            /*
            if (Array.isArray(value)) continue;
            */
            if (typeof value === 'object') {
                if (value instanceof Node) continue;

                if (used.has(value)) continue;
                used.add(value);
                value = getProperties(value);
                if (Object.keys(value).length === 0) continue;
                props[prop] = value;
                continue;
            }
        }
        currentProto = Object.getPrototypeOf(currentProto);
    }
    return props;

}


function flat(obj){
    const nObj = {};
    run(obj,'');
    return nObj;

    function run(obj, prefix){
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'object') {
                run(value, prefix+key+'.');
                continue;
            }
            nObj[prefix+key] = value;
        }
    }

}
