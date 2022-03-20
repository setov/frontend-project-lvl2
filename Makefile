install:
				npm ci

lint:
				npx eslint .

lint-fix:
				npx eslint --fix .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
				npm publish --dry-run

.PHONY: test
