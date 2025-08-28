import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TeamPrompt, PromptsConfig } from './types';

export class PromptsRepository {
  private cache: TeamPrompt[] = [];
  private lastFetch = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_PROMPTS_PATH = 'prompts';

  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Load prompts from file system with caching
   */
  async loadPrompts(): Promise<TeamPrompt[]> {
    // Check cache first
    if (Date.now() - this.lastFetch < this.CACHE_TTL && this.cache.length > 0) {
      return this.cache;
    }

    try {
      const prompts = await this.loadPromptsFromFilesystem();
      this.cache = prompts;
      this.lastFetch = Date.now();
      return prompts;
    } catch (error) {
      console.error('Failed to load team prompts:', error);
      // Return cached version or fallback prompts on error
      return this.cache.length > 0 ? this.cache : this.getFallbackPrompts();
    }
  }

  /**
   * Load prompts from the file system
   */
  private async loadPromptsFromFilesystem(): Promise<TeamPrompt[]> {
    const promptsPath = this.getPromptsPath();
    
    try {
      // Try to load from prompts.json first
      const mainConfigPath = path.join(promptsPath, 'prompts.json');
      if (fs.existsSync(mainConfigPath)) {
        const configContent = fs.readFileSync(mainConfigPath, 'utf8');
        const config: PromptsConfig = JSON.parse(configContent);
        return config.prompts;
      }

      // Fallback: load from individual category files
      return await this.loadFromCategoryFiles(promptsPath);
    } catch (error) {
      console.error('Error loading prompts from filesystem:', error);
      throw error;
    }
  }

  /**
   * Load prompts from individual category files
   */
  private async loadFromCategoryFiles(promptsPath: string): Promise<TeamPrompt[]> {
    const prompts: TeamPrompt[] = [];
    const categoriesPath = path.join(promptsPath, 'categories');

    if (!fs.existsSync(categoriesPath)) {
      return prompts;
    }

    const categoryFiles = fs.readdirSync(categoriesPath)
      .filter(file => file.endsWith('.json'));

    for (const file of categoryFiles) {
      try {
        const categoryPath = path.join(categoriesPath, file);
        const categoryContent = fs.readFileSync(categoryPath, 'utf8');
        const categoryPrompts: TeamPrompt[] = JSON.parse(categoryContent);
        
        // Add category info to each prompt
        const category = path.basename(file, '.json');
        const promptsWithCategory = categoryPrompts.map(prompt => ({
          ...prompt,
          category
        }));
        
        prompts.push(...promptsWithCategory);
      } catch (error) {
        console.error(`Error loading category file ${file}:`, error);
      }
    }

    return prompts;
  }

  /**
   * Get the prompts directory path
   */
  private getPromptsPath(): string {
    // Check VS Code settings for custom path
    const config = vscode.workspace.getConfiguration('teamPrompts');
    const customPath = config.get<string>('promptsPath');
    
    if (customPath) {
      if (path.isAbsolute(customPath)) {
        return customPath;
      }
      // Relative to workspace
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        return path.join(workspaceFolder.uri.fsPath, customPath);
      }
    }

    // Default: look in workspace root, then extension directory
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      const workspacePromptsPath = path.join(workspaceFolder.uri.fsPath, this.DEFAULT_PROMPTS_PATH);
      if (fs.existsSync(workspacePromptsPath)) {
        return workspacePromptsPath;
      }
    }

    // Fallback to extension directory
    return path.join(this.context.extensionPath, this.DEFAULT_PROMPTS_PATH);
  }

  /**
   * Get fallback prompts if file loading fails
   */
  private getFallbackPrompts(): TeamPrompt[] {
    return [
      {
        id: 'what-is-extension',
        keywords: ['what is', 'explain extension', 'vs code extension'],
        title: 'VS Code Extension Explanation',
        prompt: 'Explain what is a VS Code Extension. Include its key features, architecture components (activation events, contribution points, extension API), and common types of extensions (themes, language support, tools, etc.). Provide a comprehensive overview suitable for someone new to VS Code extension development.',
        category: 'vscode'
      },
      {
        id: 'create-extension',
        keywords: ['create', 'how to create', 'build extension', 'make extension'],
        title: 'Create VS Code Extension Guide',
        prompt: 'Provide a step-by-step guide on how to create a simple VS Code extension. Include prerequisites (Node.js, Yeoman), the scaffolding process using generator-code, explanation of key files (package.json, extension.ts), basic development workflow, testing in Extension Development Host, and publishing steps. Include code examples and best practices.',
        category: 'vscode'
      }
    ];
  }

  /**
   * Refresh prompts cache
   */
  async refreshPrompts(): Promise<TeamPrompt[]> {
    this.lastFetch = 0; // Force refresh
    return await this.loadPrompts();
  }

  /**
   * Find prompt by keywords
   */
  findPromptByKeywords(keywords: string, prompts: TeamPrompt[]): TeamPrompt | undefined {
    const lowerKeywords = keywords.toLowerCase();
    return prompts.find(prompt => 
      prompt.keywords.some(keyword => lowerKeywords.includes(keyword.toLowerCase()))
    );
  }
}