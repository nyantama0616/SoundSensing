run:
	tsc -t ES5 src/index.ts --outFile dest/js/out.js
	node src/js/out.js

tsc:
	tsc -t ES5 src/index.ts --outFile dest/js/out.js

sass:
	npm run sass
