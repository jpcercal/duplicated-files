# DuplicatedFiles

An application that can be used to compare files between two or more directories. It will search for duplicated files using a hash MD5 to compare each file.

So, this is a desktop application created with Electron and AngularJS/Twitter Bootstrap to show an interface and a REST API provided by Spring Boot written in Java to serves a back-end application.

I say that is a proof of concept, that an desktop application really can be built with HTML5, Javascript, CSS and a lot of web technologies.

Feel free to use this project as an inception to your new project. and please, give me a star by this great job **=)**.

## Installation

We are assuming that will have installed in your OS:

- the Git;
- the JDK 8 with Maven 3.3.x;
- the NodeJS with NPM.

So, type the following in your terminal to download the source code and run this project.

```shell
git clone https://github.com/jpcercal/duplicated-files.git
cd duplicated-files/
mvn clean package
npm install
bower install
grunt
```

Now, you are able to start the application.

```shell
npm start
```

That is all folks, you will see a splash screen and the application. **=)**.

![SplashScreen](https://raw.github.com/jpcercal/duplicated-files/master/screenshots/splash-screen.png)

### Screenshot

#### Windows Seven

![Windows](https://raw.github.com/jpcercal/duplicated-files/master/screenshots/windows.png)

### API Documentation

Well, you can see below the HTTP routes where this application will handle your requests.

- **Post** */api/duplicated-files/* will search for duplicated files given the directories.
- **Delete** */api/remove-files* will move the files (that was selected previously) to OS trash.

#### Post

Your request must have:

- An endpoint `/api/duplicated-files/` using the HTTP verb `POST`;
- A header `Content-Type: application/json`;
- A body filled with a JSON string, like this (if you are using Windows):

```json
{
    "directories": [
        "C:\\Users\\jcercal\\Desktop\\comparator\\folder1",
        "C:\\Users\\jcercal\\Desktop\\comparator\\folder2"
    ]
}
```

And as result, you will receive a response like this (that contains the duplicated files that was found grouped by the hash md5):

```json
{
    "deea68e90a44a5a352c711f6551ab4b1":[
        {
            "path":"C:\\Users\\jcercal\\Desktop\\comparator\\folder1\\2.jpg",
            "name":"2.jpg",
            "parent":"C:\\Users\\jcercal\\Desktop\\comparator\\folder1",
            "absolute":true,
            "absoluteFile":"C:\\Users\\jcercal\\Desktop\\comparator\\folder1\\2.jpg",
            "absolutePath":"C:\\Users\\jcercal\\Desktop\\comparator\\folder1\\2.jpg",
            "directory":false,
            "file":true,
            "hidden":false,
            "metadata":{
                "size":"49.94 KB",
                "mime":"image/jpeg",
                "width":"637px",
                "type":"jpg",
                "md5":"deea68e90a44a5a352c711f6551ab4b1",
                "height":"450px"
            }
        },
        {
            "path":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2\\2.jpg",
            "name":"2.jpg",
            "parent":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2",
            "absolute":true,
            "absoluteFile":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2\\2.jpg",
            "absolutePath":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2\\2.jpg",
            "directory":false,
            "file":true,
            "hidden":false,
            "metadata":{
                "size":"49.94 KB",
                "mime":"image/jpeg",
                "width":"637px",
                "type":"jpg",
                "md5":"deea68e90a44a5a352c711f6551ab4b1",
                "height":"450px"
            }
        }
    ]
}
```

#### Delete

Your request must have:

- An endpoint `/api/remove-files/` using the HTTP verb `DELETE`;
- A header `Content-Type: application/json`;
- A body filled with a JSON string, like this (if you are using Windows):

```json
{
    "duplicatedFiles":{
        "deea68e90a44a5a352c711f6551ab4b1":[
            {
                "path":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2\\2.jpg",
                "name":"2.jpg",
                "parent":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2",
                "absolute":true,
                "absoluteFile":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2\\2.jpg",
                "absolutePath":"C:\\Users\\jcercal\\Desktop\\comparator\\folder2\\2.jpg",
                "directory":false,
                "file":true,
                "hidden":false,
                "metadata":{
                    "size":"49.94 KB",
                    "mime":"image/jpeg",
                    "width":"637px",
                    "type":"jpg",
                    "md5":"deea68e90a44a5a352c711f6551ab4b1",
                    "height":"450px"
                }
            }
        ]
    }
}
```

And as result, you will receive a response with HTTP Status Code 204 with no content.

**If you liked of this project, give me a *star =)*.**

Contributing
------------

1. Give me a star **=)**
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request
