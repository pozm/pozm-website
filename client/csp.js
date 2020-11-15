module.exports = {
    dev: {
        "style-src": [
            "'self'",
            "https://*.google.com",
            "'unsafe-inline'",
            "https://stackpath.bootstrapcdn.com",
            "https://*.googleapis.com",
        ],
        "script-src" :  [
            "*",
            "'unsafe-inline'",
            "'unsafe-eval'"
        ],
        "font-src" : ["https://*"],
    },
    prod: {
        "style-src": [
            "'self'",
            "https://*.google.com",
            "'unsafe-inline'",
            "https://stackpath.bootstrapcdn.com",
            "https://*.googleapis.com"
        ],
        "script-src" :  [
            "'self'",
            "https://*.pozm.pw",
            "https://cdnjs.cloudflare.com",
            "https://stackpath.bootstrapcdn.com",
            "https://code.jquery.com",
            "'sha256-GQrFe/mgM9DWkplwjVc1jXMPlWiyZB8kB6oQVzuloI8='",
            "https://*.cloudflare.com",
            "'sha256-eE1k/Cs1U0Li9/ihPPQ7jKIGDvR8fYw65VJw+txfifw='",
            "https://www.google.com",
            "https://www.gstatic.com"
        ],
        "font-src" : ["https://*"],
    }
}