install:
	npm ci

develop:
	npm run dev

lint:
	npx eslint src --ext .js,.mjs,.cjs

build:
	NODE_ENV=production npm run build

test:
	echo no tests
