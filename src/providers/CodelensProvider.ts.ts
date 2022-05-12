import * as vscode from 'vscode';
import { httpRegex, localRex } from '../const';

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private localRex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  constructor() {
    this.regex = httpRegex;
    this.localRex = localRex;
    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    this.codeLenses = [];
    // const httpRegex = new RegExp(this.regex);
    const localRegex = new RegExp(this.localRex);
    const text = document.getText();
    let matches;
    while ((matches = localRegex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[1]);
      const position = new vscode.Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(
        position,
        new RegExp(this.localRex)
      );
      if (range) {
        this.codeLenses.push(new vscode.CodeLens(range));
      }
    }
    return this.codeLenses;
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ) {
    const match = vscode.window.activeTextEditor?.document
      .getText(codeLens.range)
      .slice(1, -1);

    codeLens.command = {
      title: 'upload image',
      tooltip: 'upload your image ',
      command: 'upload-image',
      arguments: [true, match, codeLens.range],
    };
    return codeLens;
  }
}
