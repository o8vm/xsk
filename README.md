# XSK: CMS and Web Server written in ShellScript

XSK is a CMS and Web Server written in ShellScript.

XSK was created with RESTful web services in mind. The APIs and authentication mechanisms exposed for manipulating content are heavily influenced by Amazon S3.
XSK supports authentication using the AWS version 4 signing process, in addition to operations using the HTTP method.  
If the markdown file is placed, it will be converted to HTML and displayed.  
XSK also has a CGI aspect that allows you to execute ShellScripts in response to PATH and queries.

We intend to follow four basic design principles:

1. Explicitly use methods such as `GET` /` PUT` / `POST` /` PATCH` / `DELETE` /` OPTIONS` / `HEAD`.
2. Be stateless
3. Publish URIs in directory structure
4. Supports HTTP / HTTPS

## Featears
### Use HTTP methods explicitly
REST is defined that you must use the HTTP method, so XSK also tries to use the HTTP protocol as defined, as much as possible.  
XSK uses various HTTP methods in the manner shown in the following list.

* `GET`: Get the representation of the resource
* `PUT`: Create a new resource at the specified URI or overwrite and update an existing URI (always new)
* `POST`: Create or add a new resource that depends on the existing URI. The URI is determined by the server. Here we `POST` the MIME multipart data
* `PATCH`: Updates existing resources with patches based on diff data
* `DELETE`: Delete existing resource
* `OPTIONS`: Returns a list of allowed methods
* `HEAD`: Here, simply check for the existence of the resource and return the result in the status code.

Some of the above APIs are affected by Amazon S3 APIs.

### Stateless
XSK is stateless. Instead of maintaining state, the client includes parameters, context, and data in the HTTP header and body of the request.

### Publish a URI similar to a directory structure
The structure of the URI should be simple, predictable, and easily understood. From this perspective, XSK applies the UNIX directory structure directly to the URI hierarchy.
A virtual path is constructed from the specified directory for the root of the WEB server, and the root is on one path, and the sub-path that publishes each area of the service branches from that path. This is a directory and a file. I think it's very intuitive.
Publishing files / directories is entirely determined by the UNIX file permissions feature.

### HTTP / HTTPS support
XSK supports both HTTP and HTTPS. With a certificate in place, you can publish your content over HTTPS.
For example, if you acquired the dev domain in Google Domains, this will be a necessary function.

### XSK Signature Version 4 signing process
XSK originally supports HTTP methods such as `GET`,` PUT`, `POST`,` PATCH`, `DELETE`,` OPTIONS`, `HEAD`, but signature is needed for methods except for `GET`.  
XSK creates the signature in a process similar to the AWS Signature Version 4 signature process.  
You cannot access it unless you have the `Authorization` header signed by the signing process.  
XSK also calculates and verifies this signature in a ShellScript.

### markdown support
If you want to `GET` a file named ending in `.md`, XSK convert it to HTML with a server-side ShellScript before supplying it.

### Execute ShellScript
If the file located inside the public directory has a `.sh` extension and is executable, GET the script file will return the result of running the script.  
For example, you can use it to manipulate search queries. The query after `?` Can be processed, but of course how it is processed is the responsibility of the execution script.

### compatibility
XSK is implemented with care for compatibility.  
The only commands used internally are `socat`,` openssl`, `curl` /` wget`, except for the commands defined in POSIX Shell & Utilities.

### support twitter card
XSK supports twitter cards that display thumbnails when shared on twitter.

### Tree index page
XSK applies the UNIX directory structure directly to the URI hierarchy. 
I thought the UI should be also intuitive, so XSK simply return an index page like the result of the `tree` command. 
The implementation uses the find command.

### Supports comment function
Comments can be added to each article.

## Operation example and usage
### XSK (EXOSKELETON) structure and startup

```shell
$ tree -a .
.
├── .log # <============== access log
├── .xsk # <============== 
│   ├── credentials # <=== credentials
│   ├── fullchain.pem # <= Server certificate
│   └── privkey.pem # <=== privatekey for HTTPS
├── exo
│   ├── .attachments # <== css/js/cgi script
│   │   ├── css
│   │   ├── img
│   │   ├── js
│   │   └── sh
│   └── ... # <=========== document root for web server
|
├── pilot # <============= client command
├── skeleton 
|   └── ... # <=========== core script & tools
├── srvcs # <============= Service setting file for upstart
└── xsk # <=============== Server start command
```

When using XSK, you mainly use the server command `xsk` and the client command` pilot`.

### start XSK
Start XSK as follows. In the case of using HTTPS, it is necessary to prepare certificates, so here, try the example of starting on port 80 once.

Specify the port number in `-p` option, Twitter user name in` -u`, and host name in `-h`.  
If you add the `-s` option, it runs on HTTPS using the certificates you have set up in advance.

HTTP:

```shell
$ pwd
/path/to/exoskeleton
$ sudo ./xsk -p 80 -u "@twitter_username" -h "hostname"
```

HTTPS:

```shell
$ pwd
/path/to/exoskeleton
$ sudo ./xsk -p 443 -u "@twitter_username" -h "hostname" -s
```

In addition, prepare the following credentials file for signature authentication for methods other than `GET`.   
It is recommended that `key_id` and` secret` use a reasonably long random string of your choice.

```shell
$ pwd
/path/to/exoskeleton
$ cat credentials 
key_id: abcd
secret: efghijklmnopqrstuvwxyz
```

### Access with pilot command
`pilot` is a client command that generates a signed HTTP request to access XSK.
This command is also created for my own study. I wanted to create a HTTP request that is as raw as possible and experience REST. This command was also created based on that philosophy.
Basically, it works by creating a raw HTTP request mock up in text format and feeding it from standard input.

Therefore, although the usability of the `pilot` command is not good (rather bad), I personally think it is a relatively interesting attempt.

However, it is too difficult to reproduce the HTTP request format too faithful, so we simplified it a bit and defined the actual format to be similar to the HTTP request type:

```http
METHOD URI    
Key Value
key Value
Key Value    
Host: hostname 
Content-Type: application/hoghoge 
X-Xsk-moge: hogehogehoge 

body (JSON, XML. Binary)
```

The query is specified under the `METHOD URI` in the form of a key value.  
Save this to a file and pass it as the first argument or pipe it from standard input:

```shell
$ pilot RESTful_API_file
$ cat RESTful_API_file | pilot
```

However, the above command has a problem when you want to have a binary in the body.
So there are several options to address such issues.

* `-f file`: The body of the HTTP request can be specified in another file.
* `-q`: If you want to receive only the response body after the request, you can omit the response header by specifying this option.
* `-v`: When using curl, show the request status in detail.
* `-s`: Make requests over HTTPS.

