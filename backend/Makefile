.PHONY: start
.SILENT: start
start:
	bin/rails server

config/initializers/version.rb:
	bin/rake update:version

.PHONY: test-watch
.SILENT: test-watch
test-watch:
	bundle exec guard