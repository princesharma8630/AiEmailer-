
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SignatureEditorProps {
  signatureName: string;
  signatureContent: string;
  onNameChange: (name: string) => void;
  onContentChange: (content: string) => void;
}

export const SignatureEditor: React.FC<SignatureEditorProps> = ({
  signatureName,
  signatureContent,
  onNameChange,
  onContentChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && signatureContent) {
      editorRef.current.innerHTML = signatureContent;
    }
  }, [signatureContent]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Signature Name
        </label>
        <input
          type="text"
          placeholder="Enter an identification name"
          value={signatureName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Signature
        </label>
        
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50 flex-wrap">
          <button onClick={() => execCommand('undo')} className="p-2 hover:bg-gray-200 rounded" title="Undo">
            ↶
          </button>
          <button onClick={() => execCommand('redo')} className="p-2 hover:bg-gray-200 rounded" title="Redo">
            ↷
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <select 
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="p">Normal text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <select 
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="3">Normal</option>
            <option value="1">Small</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>

          <input 
            type="color" 
            onChange={(e) => execCommand('foreColor', e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Text Color"
          />

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded font-bold" title="Bold">
            B
          </button>
          <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded italic" title="Italic">
            I
          </button>
          <button onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded underline" title="Underline">
            U
          </button>
          <button onClick={() => execCommand('strikeThrough')} className="p-2 hover:bg-gray-200 rounded line-through" title="Strikethrough">
            S
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
            ☰
          </button>
          <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
            ≡
          </button>

          <button 
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Insert Link"
          >
            🔗
          </button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          className="w-full min-h-[200px] p-4 border border-t-0 border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          style={{ whiteSpace: 'pre-wrap' }}
          suppressContentEditableWarning
        >
          {!signatureContent && (
            <span className="text-gray-400">Create your signature here...</span>
          )}
        </div>
      </div>
    </div>
  );
};

