# Solivan Dev Justfile
# Common development tasks

# Create a new blog post
blog title:
    pnpm blog "{{title}}"

# Start development server
dev:
    pnpm dev

# Build for production
build:
    pnpm build

# Run tests
test:
    pnpm test

# Format code
format:
    pnpm format

# Lint code
lint:
    pnpm lint

# Syndicate a blog post to social media
syndicate post:
    npm run syndicate -- --post="{{post}}"

# Install dependencies
install:
    pnpm install

# Update dependencies
update:
    pnpm update

# Preview production build
preview:
    pnpm preview