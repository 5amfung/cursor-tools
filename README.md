# cursor-tools

Enhance your Dev Agent / AI powered IDE with *even more AI*

AI-compatible AI-powered web queries and codebase understanding. `cursor-tools` seamlessly integrates with Cursor (and other agents) to provide intelligent responses using Perplexity AI for web searches and Google Gemini for whole-repository-aware assistance.

cursor-tools is an npm package that you can install in your project and provides a CLI that your AI agent can use to expand its capabilities.

## Examples

Early examples from when the tools were called ask_perplexity and ask_gemini (new example screenshots and videos coming soon)

| web example | repo example |
|-------------------|--------------------------|
| <img src="https://github.com/user-attachments/assets/6af1af2e-ab8d-4b02-915c-3ff5ded14507" width="400"/><br/><img src="https://github.com/user-attachments/assets/f9051238-d14d-4db3-8847-b4acc90edd0a" width="400"/> | <img src="https://github.com/user-attachments/assets/3cb1a805-bef9-4957-9950-cd37d2bef8d3" width="400"/> |

## Requirements

- Node.js 18 or later
- Perplexity API key
- Google Gemini API key

cursor-tools uses Gemini because it is the only good LLM with a context window that goes up to 2 million tokens - enough to handle and entire codebase in one shot.

cursor-tools uses Perplexity because it has the best web search api that does not hallucinate. Support for Google search grounding is coming soon but testing has shown it still frequently hallucinates things like APIs and libraries that don't exist.

## Installation

Run the interactive setup:
```bash
npx cursor-tools@latest install .
```

This command will:

1. Add `cursor-tools` as a dev dependency in your package.json
2. Guide you through API key configuration
3. Update your `.cursorrules` file for Cursor integration

## Cursor Usage

Use cursor in agent mode with command execution (not sure what this means, see section below on Cursor Agent configuration). If you have installed the cursor-tools prompt to your .cursorrules (or equivalent) just ask your AI coding agent/assistant to use "cursor-tools" to do things.

Examples usages:

### Use web search
"Please implement country specific stripe payment pages for the USA, UK, France and Germany. Use cursor-tools web to check the available stripe payment methods in each country."

Note: in most cases you can say "ask Perplexity" instead of "use cursor-tools web" and it will work the same.

### Use repo search
"Let's refactor our User class to allow multiple email aliases per user. Use cursor-tools repo to ask for a plan including a list of all files that need to be changed."

Note: in most cases you can say "ask Gemini" instead of "use cursor-tools repo" and it will work the same.

### Use doc generation
"Use cursor-tools to generate documentation for the Github repo https://github.com/kait-http/kaito" and write it to docs/kaito.md"

Note: in most cases you can say "generate documentation" instead of "use cursor-tools doc" and it will work the same.

### Use github integration
"Use cursor-tools github to fetch issue 123 and suggest a solution to the user's problem"

"Use cursor-tools github to fetch PR 321 and see if you can fix Andy's latest comment"

Note: in most cases you can say "fetch issue 123" or "fetch PR 321" instead of "use cursor-tools github" and it will work the same.

## Authentication and API Keys
`cursor-tools` requires API keys for both Perplexity AI and Google Gemini. These can be configured in two ways:

1. **Interactive Setup**: Run `cursor-tools install` and follow the prompts
2. **Manual Setup**: Create `~/.cursor-tools/.env` in your home directory or `.cursor-tools.env` in your project root:
   ```env
   PERPLEXITY_API_KEY="your-perplexity-api-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```


## Core Features

### Web Search
Use Perplexity AI to get up-to-date information directly within Cursor:
```bash
cursor-tools web "What's new in TypeScript 5.7?"
```

### Repository Context
Leverage Google Gemini for codebase-aware assistance:
```bash
cursor-tools repo "Explain the authentication flow in this project, which files are involved?"
```

### Documentation Generation
Generate comprehensive documentation for your repository or any GitHub repository:
```bash
# Document local repository
cursor-tools doc

# Document remote GitHub repository
cursor-tools doc --from-github=username/repo-name
cursor-tools doc --from-github=username/repo-name@branch  # Specify branch
cursor-tools doc --from-github=https://github.com/username/repo-name@branch  # HTTPS URL format

# Save documentation to file
# This is really useful to generate local documentation for libraries and dependencies
cursor-tools doc --from-github=eastlondoner/cursor-tools --save-to=docs/CURSOR-TOOLS.md
cursor-tools doc --from-github=eastlondoner/cursor-tools --save-to=docs/CURSOR-TOOLS.md --hint="only information about the doc command"
```


### GitHub Integration
Access GitHub issues and pull requests directly from the command line:
```bash
# List recent PRs
cursor-tools github pr

# View specific PR with full discussion and code review comments
cursor-tools github pr 123

# List recent issues
cursor-tools github issue

# View specific issue with full discussion thread
cursor-tools github issue 456

# Access other repositories using --from-github or --repo
cursor-tools github pr --from-github microsoft/vscode
cursor-tools github issue 789 --from-github microsoft/vscode
```

The GitHub commands provide:
- If no PR/Issue number is specified, view of 10 most recent open PRs or issues
- If a PR/Issue number is specified, detailed view of specific PR or issue including:
  - PR/Issue description and metadata
  - Code review comments grouped by file (PRs only)
  - Full Discussion thread
  - Labels, assignees, milestones and reviewers as appropriate
- Support for both local repositories and remote GitHub repositories
- Markdown-formatted output for readability


## Configuration

### Default Settings
Customize `cursor-tools` behavior by creating a `cursor-tools.config.json` file:
```json
{
  "perplexity": {
    "model": "sonar-pro",
    "maxTokens": 8000
  },
  "gemini": {
    "model": "gemini-2.0-flash-thinking-exp-01-21",
    "maxTokens": 10000
  }
}
```

### GitHub Authentication
The GitHub commands support several authentication methods:

1. **Environment Variable**: Set `GITHUB_TOKEN` in your environment:
   ```env
   GITHUB_TOKEN=your_token_here
   ```

2. **GitHub CLI**: If you have the GitHub CLI (`gh`) installed and are logged in, cursor-tools will automatically use it to generate tokens with the necessary scopes.

3. **Git Credentials**: If you have authenticated git with GitHub (via HTTPS), cursor-tools will automatically:
   - Use your stored GitHub token if available (credentials starting with `ghp_` or `gho_`)
   - Fall back to using Basic Auth with your git credentials

To set up git credentials:
1. Configure git to use HTTPS instead of SSH:
   ```bash
   git config --global url."https://github.com/".insteadOf git@github.com:
   ```
2. Store your credentials:
   ```bash
   git config --global credential.helper store  # Permanent storage
   # Or for macOS keychain:
   git config --global credential.helper osxkeychain
   ```
3. The next time you perform a git operation requiring authentication, your credentials will be stored

Authentication Status:
- Without authentication:
  - Public repositories: Limited to 60 requests per hour
  - Private repositories: Not accessible
  - Some features may be restricted

- With authentication (any method):
  - Public repositories: 5,000 requests per hour
  - Private repositories: Full access (if token has required scopes)
  - Access to all features

cursor-tools will automatically try these authentication methods in order:
1. `GITHUB_TOKEN` environment variable
2. GitHub CLI token (if `gh` is installed and logged in)
3. Git credentials (stored token or Basic Auth)

If no authentication is available, it will fall back to unauthenticated access with rate limits.


### Repomix Configuration

When generating documentation, cursor-tools uses Repomix to analyze your repository. By default, it excludes certain files and directories that are typically not relevant for documentation:
- Node modules and package directories (`node_modules/`, `packages/`, etc.)
- Build output directories (`dist/`, `build/`, etc.)
- Version control directories (`.git/`)
- Test files and directories (`test/`, `tests/`, `__tests__/`, etc.)
- Configuration files (`.env`, `.config`, etc.)
- Log files and temporary files
- Binary files and media files

This ensures that the documentation focuses on your actual source code and documentation files.
Support to customize the input files to include is coming soon - open an issue if you run into problems here.


### Cursor Configuration
`cursor-tools` automatically configures Cursor by updating your `.cursorrules` file during installation. This provides:
- Command suggestions
- Usage examples
- Context-aware assistance

#### Cursor Agent Configuration:

To get the benefits of cursor-tools you should use Cursor agent in "yolo mode". Ideal settings:

![image](https://github.com/user-attachments/assets/783e26cf-c339-4cae-9629-857da0359cef)


## cursor-tools cli

In general you do not need to use the cli directly, your AI coding agent will call the CLI but it is useful to know it exists and this is how it works.

### Command Options
All commands support these general options:
- `--model`: Specify an alternative model
- `--max-tokens`: Control response length
- `--save-to`: Save command output to a file (in *addition* to displaying it, like tee)
- `--help`: View all available options (help has not been implemented for all commands yet)

Documentation command specific options:
- `--from-github`: Generate documentation for a remote GitHub repository (supports @branch syntax)

GitHub command specific options:
- `--from-github`: Access PRs/issues from a specific GitHub repository (format: owner/repo)
- `--repo`: Alternative to --from-github, does the same thing (format: owner/repo)

### Execution Methods
Execute commands in several ways:
```bash
# Global installation
cursor-tools web "query"

# without global installation
npx -y cursor-tools@latest web "query"
```

## Troubleshooting

### Common Issues

1. **Command Not Found**
   - Ensure `cursor-tools` is installed (globally or as a dev dependency)
   - Check your PATH if installed globally

2. **API Key Errors**
   - Verify `.cursor-tools.env` exists and contains valid API keys
   - Run `cursor-tools install` to reconfigure API keys
   - Check that your API keys have the necessary permissions
   - For GitHub operations, ensure your token has the required scopes (repo, read:user)

3. **Model Errors**
   - Check your internet connection
   - Verify API key permissions
   - Ensure the specified model is available for your API tier

4. **GitHub API Rate Limits**
   - GitHub API has rate limits for unauthenticated requests. For higher limits you must be authenticated.
   - If you have the gh cli installed and logged in cursor-tools will use that to obtain a short lived auth token. Otherwise you can add a GitHub token to your environment:
     ```env
     GITHUB_TOKEN=your_token_here
     ```
   - Private repositories always require authentication

5. **Documentation Generation Issues**
   - Repository too large: Try using `--hint` to focus on specific parts
   - Token limit exceeded: The tool will automatically switch to a larger model
   - Network timeouts: The tool includes automatic retries
   - For very large repositories, consider documenting specific directories or files

6. **Cursor Integration**
   - If .cursorrules is outdated, run `cursor-tools install .` to update
   - Ensure Cursor is configured to allow command execution
   - Check that your Cursor version supports AI commands

### Examples

#### Web Search Examples
```bash
# Get information about new technologies
cursor-tools web "What are the key features of Bun.js?"

# Check API documentation
cursor-tools web "How to implement OAuth2 in Express.js?"

# Compare technologies
cursor-tools web "Compare Vite vs Webpack for modern web development"
```

#### Repository Context Examples
```bash
# Architecture understanding
cursor-tools repo "Explain the overall architecture of this project"

# Find usage examples
cursor-tools repo "Show me examples of error handling in this codebase"

# Debugging help
cursor-tools repo "Why might the authentication be failing in the login flow?"
```

#### Documentation Examples
```bash
# Document specific aspects
cursor-tools doc --hint="Focus on the API endpoints and their usage"

# Document with custom output
cursor-tools doc --save-to=docs/architecture.md --hint="Focus on system architecture"

# Document dependencies
cursor-tools doc --from-github=expressjs/express --save-to=docs/EXPRESS.md
```

#### GitHub Integration Examples
```bash
# List PRs with specific labels
cursor-tools github pr --from-github facebook/react

# Check recent issues in a specific repository
cursor-tools github issue --from-github vercel/next.js

# View PR with code review comments
cursor-tools github pr 123 --from-github microsoft/typescript

# Track issue discussions
cursor-tools github issue 456 --from-github golang/go
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.