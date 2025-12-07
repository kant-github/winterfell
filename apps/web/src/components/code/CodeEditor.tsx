'use client';
import { JSX, useCallback } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { LiaServicestack } from 'react-icons/lia';
export default function CodeEditor(): JSX.Element {
    const { currentCode, currentFile, collapseFileTree, setCurrentCursorPosition } =
        useCodeEditor();
    const handleEditorWillMount = useCallback((monaco: Monaco) => {
        monaco.editor.defineTheme('clean-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // Default text color and background
                { token: '', foreground: 'D9D9D9', background: '0d0e10' },

                // General identifiers (variable names, function names)
                { token: 'identifier', foreground: 'EAEAEA' },

                // Delimiters like semicolons, commas
                { token: 'delimiter', foreground: '9CA3AF' },

                // Whitespace
                { token: 'white', foreground: 'EAEAEA' },

                // Comments (// or /* */)
                { token: 'comment', foreground: '7D8590', fontStyle: 'italic' },
                { token: 'comment.doc', foreground: '7D8590', fontStyle: 'italic' }, // JSDoc comments

                // Keywords (if, else, return, const, let, etc.)
                { token: 'keyword', foreground: '82AAFF', fontStyle: 'bold' },
                { token: 'keyword.control', foreground: '82AAFF' }, // Control flow keywords
                { token: 'keyword.operator', foreground: 'F78C6C' }, // new, typeof, instanceof

                // Storage keywords (const, let, var, function, class)
                { token: 'storage', foreground: '82AAFF', fontStyle: 'bold' },

                // Modifiers (public, private, static, async)
                { token: 'modifier', foreground: '7B9EFF' },

                // Variables
                { token: 'variable', foreground: 'FAD069' }, // Variable names
                { token: 'variable.name', foreground: 'FAD069' }, // Variable names (specific)
                { token: 'variable.other', foreground: 'FAD069' }, // Other variables
                { token: 'variable.predefined', foreground: 'FAD069' }, // Built-in variables (this, window, etc.)
                { token: 'variable.parameter', foreground: 'FAD069' }, // Function parameters

                // Functions
                { token: 'function', foreground: 'EFB080' }, // General function token
                { token: 'function.name', foreground: 'EFB080', fontStyle: 'bold' }, // Function names at declaration
                { token: 'function.call', foreground: 'EFB080' }, // Function names when called
                { token: 'support.function', foreground: 'EFB080' }, // Built-in functions
                { token: 'entity.name.function', foreground: 'EFB080' }, // Function entity names
                { token: 'meta.function-call', foreground: 'EFB080' }, // Function calls (alternative)

                // Types and interfaces
                { token: 'type.identifier', foreground: 'A5D6FF' },
                { token: 'type', foreground: 'B3E5FC' },
                { token: 'class.name', foreground: 'B388FF', fontStyle: 'bold' }, // Class names
                { token: 'interface.name', foreground: '8BE9FD' }, // Interface names
                { token: 'namespace', foreground: 'B39DDB' }, // Namespace names

                // Strings
                { token: 'string', foreground: 'C3E88D' }, // Regular strings
                { token: 'string.key.json', foreground: '82AAFF' }, // JSON keys (blue)
                { token: 'string.value.json', foreground: 'FFB86C' }, // JSON values (orange)
                { token: 'string.template', foreground: 'F1FA8C' }, // Template literals `${}`
                { token: 'string.escape', foreground: 'FFD580' }, // Escape characters (\n, \t)

                // Numbers
                { token: 'number', foreground: 'F78C6C' },
                { token: 'constant.numeric', foreground: 'F78C6C' },

                // Boolean and null values
                { token: 'constant.language.boolean', foreground: 'FF5370' }, // true, false
                { token: 'constant.language.null', foreground: 'FF5370' }, // null, undefined

                // Constants
                { token: 'constant', foreground: 'FFCB6B' },

                // Operators (+, -, *, /, =, ===, etc.)
                { token: 'operator', foreground: 'F78C6C' },

                // Brackets and parentheses
                { token: 'delimiter.bracket', foreground: 'AAB2BF' }, // []
                { token: 'delimiter.parenthesis', foreground: 'AAB2BF' }, // ()
                { token: 'delimiter.square', foreground: 'AAB2BF' }, // []
                { token: 'delimiter.curly', foreground: 'AAB2BF' }, // {}

                // HTML/JSX tags
                { token: 'tag', foreground: 'FF5370' },
                { token: 'tag.name', foreground: 'FF6E6E' }, // Tag names like <div>
                { token: 'meta.tag', foreground: 'FF6E6E' },

                // HTML/JSX attributes
                { token: 'attribute.name', foreground: 'FFB86C' }, // Attribute names (className, id)
                { token: 'attribute.value', foreground: 'C3E88D' }, // Attribute values

                // Object keys and properties
                { token: 'key', foreground: 'FFCB6B' }, // Object keys
                { token: 'property.name', foreground: '82AAFF' }, // Property names (JSON keys)
                { token: 'support.type.property-name', foreground: 'B4E1FF' }, // CSS property names

                // CSS specific
                { token: 'support.constant.color', foreground: 'F78C6C' }, // CSS color values
                { token: 'entity.name.tag.css', foreground: '82AAFF' }, // CSS selectors
                { token: 'keyword.other.unit', foreground: 'FFCB6B' }, // CSS units (px, em, rem)

                // Errors and warnings
                { token: 'invalid', foreground: 'FFFFFF', background: 'FF5555' }, // Invalid code
                { token: 'error', foreground: 'FF5555' }, // Errors
                { token: 'warning', foreground: 'F1FA8C' }, // Warnings
            ],
            colors: {
                // Main editor colors
                'editor.background': '#0d0e10', // Main editor background (dark charcoal)
                'editor.foreground': '#EAEAEA', // Default text color (light gray)
                'editorCursor.foreground': '#FFFFFF', // Cursor color (white)

                // Line highlighting
                'editor.lineHighlightBackground': '#1a1b1e', // Background of current line

                // Line numbers
                'editorLineNumber.foreground': '#3a3b3e', // Inactive line numbers (dark gray)
                'editorLineNumber.activeForeground': '#B0B0B0', // Active line number (light gray)

                // Selection colors
                'editor.selectionBackground': '#2a2d33', // Selected text background
                'editor.inactiveSelectionBackground': '#1a1b1e', // Selection when editor not focused

                // Indent guides (vertical lines showing indentation)
                'editorIndentGuide.background': '#1a1b1d', // Inactive indent guides
                'editorIndentGuide.activeBackground': '#3B3B3B', // Active indent guide

                // Gutter (area with line numbers)
                'editorGutter.background': '#0d0e10', // Gutter background

                // Whitespace characters (spaces, tabs)
                'editorWhitespace.foreground': '#1a1b1e', // Whitespace dots/symbols

                // Scrollbar colors
                'scrollbarSlider.background': '#1a1b1e', // Scrollbar when not hovering
                'scrollbarSlider.hoverBackground': '#2a2b2f', // Scrollbar on hover
                'scrollbarSlider.activeBackground': '#3a3b3f', // Scrollbar when clicking/dragging
            },
        });
    }, []);
    const handleEditorDidMount = useCallback(
        (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
                const event = new CustomEvent('open-search-bar');
                window.dispatchEvent(event);
            });
            editorInstance.onDidChangeCursorPosition((e) => {
                const { lineNumber, column } = e.position;
                setCurrentCursorPosition({ ln: lineNumber, col: column });
            });
        },
        [],
    );
    function filePathModifier(filePath: string | undefined) {
        return filePath ? filePath.replaceAll('/', ' / ') : '';
    }
    return (
        <div className="flex flex-col w-full h-full grow-0 relative">
            <div className="flex-1 min-w-0 h-full">
                {currentFile ? (
                    <>
                        <div className="w-full flex px-4 py-1 bg-[#0d0e10] text-gray-300 text-sm ">
                            {filePathModifier(currentFile?.id)}
                        </div>
                        <Editor
                            key={collapseFileTree ? 'tree-collapsed' : 'tree-expanded'}
                            height="100%"
                            language="rust"
                            beforeMount={handleEditorWillMount}
                            onMount={(editor, monaco) => {
                                monaco.editor.setTheme('clean-dark');
                                handleEditorDidMount(editor, monaco);
                            }}
                            theme="clean-dark"
                            options={{
                                readOnly: true,
                                readOnlyMessage: {
                                    value: 'This feature will be available on the next version.',
                                },
                                minimap: {
                                    enabled: true,
                                },
                            }}
                            value={currentCode}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex justify-center items-center bg-[#0d0e10]">
                        <LiaServicestack size={200} className="text-neutral-800" />
                    </div>
                )}
            </div>
        </div>
    );
}
