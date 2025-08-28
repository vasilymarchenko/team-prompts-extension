// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PromptsRepository } from './promptsRepository';
import { TeamPrompt } from './types';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "team-prompts" is now active!');

	// ----- Command: Team Prompts: Insert
  const insertCmd = vscode.commands.registerCommand('teamPrompts.insert', async () => {
    const items: vscode.QuickPickItem[] = [
      { label: 'Integration Tests — Dummy', description: 'Hardcoded prompt' }
    ];
    const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Pick a prompt' }); // Quick Pick UX
    if (!picked) { return; }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Open a file to insert the prompt.');
      return;
    }

    const selectionText = editor.document.getText(editor.selection);
    const rendered = [
      '### Integration Tests — Dummy',
      '',
      'Please generate integration tests using our Arrange/Act/Assert style.',
      selectionText ? 'Context:\n```text\n' + selectionText + '\n```' : '(No selection)',
      ''
    ].join('\n');

    await editor.edit(edit => {
      const pos = editor.selection.active;
      edit.insert(pos, rendered);
    });
  });

  // ----- Chat Participant: @TeamPrompts
  
  // Initialize prompts repository
  const promptsRepository = new PromptsRepository(context);

  const handler: vscode.ChatRequestHandler = async (request, context, stream, token) => {
    const userMessage = request.prompt.toLowerCase();
    
    try {
      // Load prompts from file system
      stream.progress('Loading team prompts...');
      const teamPrompts = await promptsRepository.loadPrompts();
      
      // Find matching predefined prompt
      const matchedPrompt = promptsRepository.findPromptByKeywords(userMessage, teamPrompts);

      if (matchedPrompt) {
        stream.progress(`Processing ${matchedPrompt.title}...`);
        
        // Build the prompt with any referenced text/selection
        const sel = request.references.find(ref => typeof ref.value === 'string')?.value as string | undefined;
        
        let finalPrompt = matchedPrompt.prompt;
        if (sel) {
          finalPrompt += `\n\nContext/Referenced Code:\n\`\`\`\n${sel}\n\`\`\``;
        }
        
        try {
          // Create messages array for the language model
          const messages = [
            vscode.LanguageModelChatMessage.User(finalPrompt)
          ];

          // Send request to the language model
          const chatResponse = await request.model.sendRequest(messages, {}, token);
          
          // Stream the response from the language model
          for await (const fragment of chatResponse.text) {
            stream.markdown(fragment);
          }
          
          return { metadata: { promptId: matchedPrompt.id } };
        } catch (error) {
          stream.markdown(`❌ Error: Unable to process request. ${error instanceof Error ? error.message : 'Unknown error'}`);
          return { metadata: { promptId: 'error' } };
        }
      }

      // Fallback: Show available prompts if no match found
      stream.progress('Available team prompts...');
      const availablePrompts = teamPrompts
        .map(prompt => `• **${prompt.title}** - Keywords: "${prompt.keywords.join('", "')}" ${prompt.category ? `[${prompt.category}]` : ''}`)
        .join('\n');
      
      stream.markdown([
        '### 📝 Team Prompts Library',
        '',
        `Found ${teamPrompts.length} prompts:`,
        '',
        availablePrompts,
        '',
        '**Usage:** Type `@TeamPrompts` followed by keywords to trigger the corresponding prompt.',
        '',
        '**Example:** `@TeamPrompts what is extension` → executes VS Code extension explanation prompt'
      ].join('\n'));
      
      return { metadata: { promptId: 'help' } };
      
    } catch (error) {
      stream.markdown(`❌ Error loading prompts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { metadata: { promptId: 'error' } };
    }
  };  

  const participant = vscode.chat.createChatParticipant('team-prompts.participant', handler);
  participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png');

  context.subscriptions.push(insertCmd, participant);
}

// This method is called when your extension is deactivated
export function deactivate() {}
