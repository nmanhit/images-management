# Photos Management
###### A tool for upload and restore your photo.

## How to build
### Requirement
```
* Git
* Node.js
```
```
$ git clone https://github.com/nmanhit/images-management.git
$ cd images-management
$ npm install
```

### Change config for application
* You have to find config.example.ts file on root project and rename to config.ts
* 2 special variable config must be change:
	* API_TOKEN
	* ROOT_ID


### Build
```
$ npm run build
```

### Development
```
$ npm run dev
```

### Output
```
./dist/bundle.css
./dist/bundle.js
```
When you build complete, in folder `dist/` will be visible 2 file : bundle.css and bundle.js
You go to `JavaScript and CSS Customization` on your app and upload 2 file.

## License
MIT License

## Copyright
Copyright(c) Cybozu, Inc.