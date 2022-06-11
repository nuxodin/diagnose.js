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
    for (let query of queries) {
        let match = matchMedia('('+query+')');
        let matches = match.matches;
        if (match.media === 'not all') matches = null;
    
        res.media[query] = matches;
    }
    
    
    // navigator porpoerties
    /*
    var props = Object.getOwnPropertyNames(Navigator.prototype);
    console.log(props)
    let nav = {};
    for (let prop of props) {
        let value = navigator[prop];
        if (typeof value === 'function') continue;
        nav[prop] = value;
    }
    */
    res.devicePixelRatio = window.devicePixelRatio;

    res.navigator = {
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        cookieEnabled: navigator.cookieEnabled,
        connection: navigator.connection,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        languages: navigator.languages,
        maxTouchPoints: navigator.maxTouchPoints,
        onLine: navigator.onLine,
        oscpu: navigator.oscpu,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        platform: navigator.platform,
        product: navigator.product,
        productSub: navigator.productSub,
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
    };
    
    
    // screen properties
    res.screen = {
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        "orientation.type": screen.orientation.type,
        "orientation.angle": screen.orientation.angle,
        isExtended: screen.isExtended,    
    }
    
    // performance
    res.performance = performance.getEntriesByType("navigation")[0];
    
    res.inputs = inputs;    
    
    return res;
}

export function collectInputs(){
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
    // keypresses
    document.addEventListener('keydown', e => {
        inputs.keyboard.push({
            key: e.key,
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
