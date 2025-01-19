'use client';

import { useEffect, useRef, useState } from 'react';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ColorfulEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');

  const processText = (text: string) => {
    return text
      .split(/(\s+)/)
      .map((word, index) => {
        if (word.trim() === '') return word; // Keep spaces as-is
        return `<span style="color: ${getRandomColor()}">${word}</span>`;
      })
      .join('');
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    
    const currentText = editorRef.current.innerText;
    if (currentText === content) return;

    // Only process the text if space or paste event occurred
    if (currentText.endsWith(' ') || currentText.length - content.length > 1) {
      const processedHtml = processText(currentText);
      editorRef.current.innerHTML = processedHtml;
      
      // Move cursor to end
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    
    setContent(currentText);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const processedHtml = processText(text);
    
    document.execCommand('insertHTML', false, processedHtml);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[200px] p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
};

export default ColorfulEditor; 