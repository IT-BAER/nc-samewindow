# Makefile for building the samewindow app
app_name=samewindow
app_version=$(shell grep -o '<version>.*</version>' appinfo/info.xml | sed 's/<version>//g' | sed 's/<\/version>//g')
project_dir=$(CURDIR)
build_dir=$(project_dir)/build
dist_dir=$(build_dir)/dist
sign_dir=$(build_dir)/sign
appstore_dir=$(build_dir)/appstore
source_dir=$(build_dir)/source
package_name=$(app_name)

all: clean build

# Clean the build directory
clean:
	rm -rf $(build_dir)
	rm -rf ./js/*.js.map

# Create a source tarball
build: clean
	mkdir -p $(source_dir)
	mkdir -p $(dist_dir)
	
	# Copy all necessary files
	rsync -av \
		--exclude='*.git*' \
		--exclude='build' \
		--exclude='tests' \
		--exclude='Makefile' \
		--exclude='*.log' \
		--exclude='phpunit*xml' \
		--exclude='composer*' \
		--exclude='node_modules' \
		--exclude='js/node_modules' \
		--exclude='js/.gitignore' \
		--exclude='package*.json' \
		--exclude='js/package*.json' \
		--exclude='webpack*' \
		--exclude='stylelint*' \
		--exclude='eslint*' \
		--exclude='.php_cs*' \
		--exclude='psalm.xml' \
		--exclude='.github' \
		--exclude='.vscode' \
		--exclude='*.md' \
		$(project_dir)/ $(source_dir)/$(app_name)
	
	# Create source tarball
	cd $(source_dir) && tar -czf $(dist_dir)/$(app_name)-$(app_version).tar.gz $(app_name)
	
	# Create appstore package
	mkdir -p $(appstore_dir)
	cp $(dist_dir)/$(app_name)-$(app_version).tar.gz $(appstore_dir)/

# Install dependencies
install-deps:
	@echo "No dependencies to install for this app"

# Test the app
test:
	@echo "No tests configured yet"

# Release target
release: build
	@echo "Built $(app_name) version $(app_version)"
	@echo "Source package: $(dist_dir)/$(app_name)-$(app_version).tar.gz"

.PHONY: all clean build install-deps test release
