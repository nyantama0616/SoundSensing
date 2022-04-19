run:
	tsc src/index.ts --outFile src/js/out.js
	node src/js/out.js

tsc:
	tsc src/index.ts --outFile src/js/out.js
