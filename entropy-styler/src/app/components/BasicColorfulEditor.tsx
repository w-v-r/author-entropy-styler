'use client';

import { useEffect, useRef, useState } from 'react';

// This will be replaced with actual LLM API call
const mockGetTokenProbability = async (word: string): Promise<number> => {
  // Temporary mock function that returns random probability between 0 and 1
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random());
    }, 100);
  });
};

const probabilityToColor = (probability: number): string => {
  // Convert probability to a color
  // Low probability (surprising) -> Red (hot)
  // High probability (expected) -> Blue (cold)
  const hue = probability * 240; // 0 (red) to 240 (blue)
  return `hsl(${hue}, 80%, 50%)`;
};

const ColorfulEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');
  const [processing, setProcessing] = useState(false);

  const processWord = async (word: string) => {
    if (word.trim() === '') return word;
    const probability = await mockGetTokenProbability(word);
    const color = probabilityToColor(probability);
    return `<span style="color: ${color}" title="probability: ${probability.toFixed(3)}">${word}</span>`;
  };

  const processText = async (text: string) => {
    const words = text.split(/(\s+)/);
    const processedWords = await Promise.all(
      words.map(async (word) => {
        if (word.trim() === '') return word;
        return processWord(word);
      })
    );
    return processedWords.join('');
  };

  const handleInput = async () => {
    if (!editorRef.current || processing) return;
    
    const currentText = editorRef.current.innerText;
    if (currentText === content) return;

    // Only process the text if space or paste event occurred
    if (currentText.endsWith(' ') || currentText.length - content.length > 1) {
      setProcessing(true);
      const processedHtml = await processText(currentText);
      if (editorRef.current) {
        editorRef.current.innerHTML = processedHtml;
        
        // Move cursor to end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setProcessing(false);
    }
    
    setContent(currentText);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    setProcessing(true);
    const processedHtml = await processText(text);
    document.execCommand('insertHTML', false, processedHtml);
    setProcessing(false);
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
      {processing && (
        <div className="text-sm text-gray-500 mt-2">
          Processing text...
        </div>
      )}
    </div>
  );
};

export default ColorfulEditor; 