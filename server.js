var connect = require('connect'),
    gzipStatic = require('connect-gzip-static'),
    serveStatic = require('serve-static'),
    history = require('connect-history-api-fallback'),
    proxy = require('http-proxy-middleware'),
    argv = require('yargs').argv,
    path = require('path'),
    bodyParser = require('body-parser'),
    connectExtensions = require('nodejs-connect-extensions');

var app = connect();

connectExtensions.extendConnectUse(app);

const wwwroot = path.join(__dirname, "wwwroot");
const serverPath = path.join(wwwroot, 'dist/server.es2015.js');
const proxyUrlFile = path.join(__dirname, 'proxyUrl.js');
var serverRenderFunc;
var proxyUrl = "http://127.0.0.1:8080";

/**
 * Gets function used for server side rendering
 */
function getServerRenderFunc()
{
    if(!serverRenderFunc || !!argv.webpack)
    {
        serverRenderFunc = require(serverPath).serverRender;
    }

    return serverRenderFunc;
}

function isRequireAvailable(path)
{
    try
    {
        require.resolve(path);
    }
    catch(e)
    {
        return false;
    }

    return true;
}

if(isRequireAvailable(proxyUrlFile))
{
    proxyUrl = require(proxyUrlFile);
}

if(process.env.GUI_API_BASE_URL)
{
    proxyUrl = process.env.GUI_API_BASE_URL;
}

console.log(`Using proxy url '${proxyUrl}'`);

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    var webpack = require('webpack'),
        webpackConfig = require('./webpack.config.js')[0]({hmr: true, dll: true, aot: true, css: true}),
        webpackDev = require('webpack-dev-middleware'),
        hmr = require("webpack-hot-middleware");

    var compiler = webpack(webpackConfig);

    //enables webpack dev middleware
    app.use(webpackDev(compiler,
    {
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(hmr(compiler));
}

//mock rest api
require('./server.mock')(app);

//REST api for server dynamic
require('./server.dynamic.api')(app);

//proxy special requests to other location
app.use(proxy(['/api', '/swagger'], {target: proxyUrl, ws: true}));

//custom rest api
require('./server.rest')(app);

//parse html request json body
app.use(bodyParser.json({limit: '50mb'}));

//enable html5 routing
app.use(history());

//angular server side rendering
app.use(function (req, res, next)
{
    if(req.url == '/index.html')
    {
        if(!isRequireAvailable(serverPath))
        {
            next();

            return;
        }

        getServerRenderFunc()(path.join(wwwroot, 'index.html'), req.originalUrl, {baseUrl: "http://localhost:8888/", requestCookies: req.headers['cookie']}, function(err, succ)
        {
            res.setHeader('Content-Type', 'text/html');

            if(succ && succ.statusCode)
            {
                res.statusCode = succ.statusCode;
            }

            res.end((err && err.toString()) || succ.html);
        });

        return;
    }

    next();
});

//return static files
app.use(gzipStatic(wwwroot, 
                   {
                       maxAge: '1d',
                       setHeaders: function setCustomCacheControl (res, path) 
                       {
                           if (serveStatic.mime.lookup(path) === 'text/html') 
                           {
                               // Custom Cache-Control for HTML files
                               res.setHeader('Cache-Control', 'public, max-age=0');
                           }
                       }
                   }));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);