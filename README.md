# Team Prompts VS Code Extension

A powerful VS Code extension that centralizes and streamlines AI prompt management for development teams. Team Prompts provides instant access to curated, reusable prompts through a chat participant interface, enabling consistent AI interactions across your development workflow.

## 🎯 Main Idea and Purpose

**Team Prompts** solves the challenge of sharing and maintaining a centralized library of AI prompts across development teams. Instead of each developer maintaining their own collection of prompts or constantly rewriting similar requests, this extension provides:

- **Centralized Prompt Library**: A single source of truth for team-wide AI prompts
- **Instant Access**: Quick prompt triggering through VS Code's chat interface
- **Contextual Intelligence**: Automatic prompt matching based on keywords
- **Code Integration**: Seamless integration with selected code and editor context
- **Extensible Architecture**: Support for multiple prompt categories and custom configurations

### Key Benefits

- 🚀 **Accelerated Development**: Pre-written, optimized prompts for common tasks
- 🤝 **Team Consistency**: Standardized AI interactions across the team
- 📚 **Knowledge Sharing**: Capture and distribute best practices through prompts
- ⚡ **Reduced Context Switching**: Stay in VS Code while accessing powerful AI prompts
- 🔧 **Customizable**: Flexible prompt organization and categorization

## 🏗️ Implementation Details

### Architecture Overview

The extension follows a modular architecture with clear separation of concerns:

```
📦 Team Prompts Extension
├── 🎮 Extension Host (extension.ts)
│   ├── Chat Participant (@TeamPrompts)
│   └── Commands (Insert Prompt)
├── 📚 Prompts Repository (promptsRepository.ts)
│   ├── File System Loader
│   ├── Caching Layer (5-min TTL)
│   └── Keyword Matching Engine
├── 🎯 Type System (types.ts)
│   ├── TeamPrompt Interface
│   └── PromptsConfig Schema
└── 📁 Prompts Data
    ├── prompts.json (Main Configuration)
    └── categories/ (Organized by Domain)
```

### Core Components

#### 1. Chat Participant (`@TeamPrompts`)
- **Activation**: Triggered by `@TeamPrompts` in VS Code chat
- **Keyword Matching**: Intelligent prompt selection based on user input
- **Context Integration**: Automatically includes selected code or referenced text
- **Language Model Integration**: Direct communication with VS Code's built-in LM

#### 2. Prompts Repository
- **Multi-source Loading**: Supports both unified `prompts.json` and distributed category files
- **Intelligent Path Resolution**: Workspace-aware prompt discovery
- **Caching Strategy**: 5-minute TTL for optimal performance
- **Fallback Mechanism**: Built-in prompts when file loading fails

#### 3. Prompt Structure
Each prompt contains:
- **ID**: Unique identifier
- **Keywords**: Trigger phrases for matching
- **Title**: Human-readable name
- **Prompt**: The actual AI instruction
- **Category**: Organizational grouping
- **Description**: Usage context and purpose

### Technology Stack

- **Runtime**: Node.js with VS Code Extension API
- **Language**: TypeScript with strict type checking
- **Build System**: esbuild for fast bundling
- **Testing**: VS Code Test Framework with Mocha
- **Linting**: ESLint with TypeScript rules
- **Packaging**: VSCE for extension packaging

## 🔨 How to Build

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **VS Code**: Version 1.99.0 or higher

### Development Setup

1. **Clone and Install Dependencies**:
   ```bash
   git clone <repository-url>
   cd team-prompts
   npm install
   ```

2. **Start Development Mode**:
   ```bash
   npm run watch
   ```
   This starts both TypeScript compilation and esbuild bundling in watch mode.

3. **Run Extension in Development**:
   - Press `F5` in VS Code to launch Extension Development Host
   - Or use VS Code's "Run Extension" debug configuration

### Build Commands

| Command | Purpose |
|---------|---------|
| `npm run compile` | One-time build with type checking and linting |
| `npm run watch` | Continuous build for development |
| `npm run package` | Production build with minification |
| `npm run lint` | Run ESLint for code quality |
| `npm run check-types` | TypeScript type checking only |
| `npm run test` | Run extension tests |

### Project Structure

```
team-prompts/
├── src/                          # TypeScript source code
│   ├── extension.ts             # Main extension entry point
│   ├── promptsRepository.ts     # Prompt loading and management
│   ├── types.ts                 # TypeScript type definitions
│   └── test/                    # Test files
├── prompts/                     # Prompt library
│   ├── prompts.json            # Main prompts configuration
│   └── categories/             # Category-specific prompts
├── dist/                       # Built extension code
├── package.json               # Extension manifest and dependencies
├── tsconfig.json             # TypeScript configuration
├── esbuild.js               # Build script
└── .vscode/                # VS Code workspace settings
```

## 📦 How to Install

### Method 1: Install from VSIX (Recommended for Distribution)

1. **Download the VSIX package** (if available):
   ```bash
   # From releases or build locally
   npm run package
   npx @vscode/vsce package
   ```

2. **Install in VS Code**:
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX"
   - Select the `team-prompts-0.0.1.vsix` file

### Method 2: Development Installation

1. **Clone and build**:
   ```bash
   git clone <repository-url>
   cd team-prompts
   npm install
   npm run compile
   ```

2. **Load in VS Code**:
   - Open the extension folder in VS Code
   - Press `F5` to run in Extension Development Host

### Method 3: VS Code Marketplace (Future)

```bash
# When published to marketplace
code --install-extension publisher.team-prompts
```

## 🚀 How to Use

### 1. Chat Participant Interface

The primary way to use Team Prompts is through the VS Code chat interface:

#### Basic Usage
```
@TeamPrompts what is extension
```
→ Triggers the "VS Code Extension Explanation" prompt

```
@TeamPrompts create api
```
→ Triggers the "REST API Endpoint Creation" prompt

```
@TeamPrompts react component
```
→ Triggers the "React Component Development" prompt

#### With Code Context
1. **Select code** in the editor
2. **Open VS Code Chat** (`Ctrl+Shift+I`)
3. **Type**: `@TeamPrompts unit tests`
4. The extension automatically includes your selected code as context

### 2. Available Prompts

The extension comes with built-in prompts across multiple categories:

#### 🔧 VS Code Development
- **Extension Explanation**: What is a VS Code extension
- **Extension Creation**: Step-by-step guide to building extensions

#### ⚙️ Backend Development
- **API Endpoint Creation**: REST API design best practices
- **Microservice Architecture**: Distributed system patterns
- **Database Design**: Schema design and optimization
- **Error Handling**: Robust error management strategies

#### 🎨 Frontend Development
- **React Components**: Modern React development practices
- **Responsive Design**: Mobile-first CSS techniques
- **State Management**: Frontend state patterns comparison

#### 🧪 Testing & Quality
- **Unit Testing**: Testing best practices and strategies
- **Code Review**: Comprehensive review guidelines

### 3. Command Interface

#### Insert Prompt Command
- **Command Palette**: `Team Prompts: Insert`
- **Action**: Inserts formatted prompt text directly into the active editor
- **Use Case**: Documentation, code comments, or manual prompt creation

### 4. Prompt Discovery

When you don't know the exact keywords:

```
@TeamPrompts
```

This displays all available prompts with their keywords and categories, helping you discover what's available.

### 5. Configuration

#### Custom Prompts Path
Configure where the extension looks for prompts:

1. Open VS Code Settings (`Ctrl+,`)
2. Search for "Team Prompts"
3. Set `teamPrompts.promptsPath` to your custom directory

#### Workspace Integration
Place a `prompts/` folder in your workspace root to override default prompts with project-specific ones.

### 6. Extending Prompts

#### Adding New Prompts
1. **Edit `prompts/prompts.json`**:
   ```json
   {
     "id": "my-custom-prompt",
     "keywords": ["custom", "my prompt"],
     "title": "My Custom Prompt",
     "prompt": "Your detailed prompt instruction here...",
     "category": "custom",
     "description": "What this prompt does"
   }
   ```

2. **Or create category files** in `prompts/categories/`:
   ```json
   // prompts/categories/devops.json
   [
     {
       "id": "docker-setup",
       "keywords": ["docker", "container", "setup"],
       "title": "Docker Container Setup",
       "prompt": "Guide me through Docker container setup...",
       "category": "devops"
     }
   ]
   ```

### 7. Best Practices

#### Effective Keyword Usage
- Use **specific terms** related to your task
- Try **multiple variations**: "create api", "new endpoint", "rest api"
- **Combine keywords**: "react component testing"

#### Maximizing Context
- **Select relevant code** before triggering prompts
- **Use descriptive selections** that provide good context
- **Include error messages** or specific code sections when troubleshooting

#### Team Adoption
- **Share prompt library** across team repositories
- **Document custom prompts** with clear descriptions
- **Regular updates** to keep prompts current with team practices

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-prompt-category`
3. **Add prompts** to appropriate category files
4. **Test thoroughly** with the chat participant
5. **Submit pull request** with clear description

## 📋 Requirements

- **VS Code**: Version 1.99.0 or higher
- **Node.js**: For development and building
- **Chat Models**: Access to VS Code's language model features

## ⚙️ Extension Settings

- `teamPrompts.promptsPath`: Custom path to prompts directory (relative to workspace or absolute)

## 🐛 Troubleshooting

### Common Issues

1. **Prompts not loading**: Check console for file path errors
2. **Keywords not matching**: Try different keyword variations
3. **Chat participant not responding**: Ensure VS Code chat is enabled

### Debug Information

Enable extension debugging:
1. Open Developer Tools (`Help > Toggle Developer Tools`)
2. Check Console for "team-prompts" logs
3. Use `@TeamPrompts` without keywords to see available prompts

## 📝 Release Notes

### 0.0.1 (Current)

#### Features
- ✅ Chat participant interface (`@TeamPrompts`)
- ✅ Keyword-based prompt matching
- ✅ Code context integration
- ✅ File system prompt loading
- ✅ Caching for performance
- ✅ Multiple prompt categories
- ✅ Fallback prompt system
- ✅ Insert command for direct text insertion

#### Built-in Prompts
- VS Code extension development guides
- Backend API and architecture patterns
- Frontend React and responsive design
- Testing and code review guidelines

#### Technical Implementation
- TypeScript with strict typing
- esbuild for fast bundling
- Comprehensive error handling
- Workspace-aware configuration
