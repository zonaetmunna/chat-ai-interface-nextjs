"use client"

import { MessageContent as MessageContentType } from '@/lib/chatContext';
import { CheckCheck, Copy, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface CodeBlockProps {
  content: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content, language }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md overflow-hidden bg-gray-900 my-2">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-400">
        <span>{language || 'code'}</span>
        <button
          onClick={copyToClipboard}
          className="p-1 rounded hover:bg-gray-700 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-300">
        <code>{content}</code>
      </pre>
    </div>
  );
};

interface ImageContentProps {
  url: string;
  caption?: string;
}

const ImageContent: React.FC<ImageContentProps> = ({ url, caption }) => {
  return (
    <div className="my-2">
      <div className="relative rounded-md overflow-hidden bg-gray-100">
        <div className="relative h-48 sm:h-64 md:h-80 w-full">
          <Image 
            src={url} 
            alt={caption || 'Image'} 
            fill 
            className="object-contain" 
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 70vw"
          />
        </div>
      </div>
      {caption && <p className="text-sm text-gray-500 mt-1">{caption}</p>}
    </div>
  );
};

interface VideoContentProps {
  url: string;
  caption?: string;
}

const VideoContent: React.FC<VideoContentProps> = ({ url, caption }) => {
  return (
    <div className="my-2">
      <div className="rounded-md overflow-hidden bg-gray-100">
        <video 
          controls 
          className="w-full max-h-80" 
          src={url}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {caption && <p className="text-sm text-gray-500 mt-1">{caption}</p>}
    </div>
  );
};

interface FileContentProps {
  content: string;
  url?: string;
  caption?: string;
}

const FileContent: React.FC<FileContentProps> = ({ content, url, caption }) => {
  return (
    <div className="my-2 p-3 rounded-md bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{content}</span>
        <div className="flex gap-2">
          {url && (
            <>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Open file"
              >
                <ExternalLink size={16} />
              </a>
              <a 
                href={url} 
                download 
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Download file"
              >
                <Download size={16} />
              </a>
            </>
          )}
        </div>
      </div>
      {caption && <p className="text-xs text-gray-500 mt-1">{caption}</p>}
    </div>
  );
};

interface TextContentProps {
  content: string;
}

const TextContent: React.FC<TextContentProps> = ({ content }) => {
  return <p className="whitespace-pre-wrap">{content}</p>;
};

interface MessageContentProps {
  content: MessageContentType;
}

export const MessageContentRenderer: React.FC<MessageContentProps> = ({ content }) => {
  switch (content.type) {
    case 'code':
      return <CodeBlock content={content.content} language={content.language} />;
    case 'image':
      return <ImageContent url={content.url || ''} caption={content.caption} />;
    case 'video':
      return <VideoContent url={content.url || ''} caption={content.caption} />;
    case 'file':
      return <FileContent content={content.content} url={content.url} caption={content.caption} />;
    case 'text':
    default:
      return <TextContent content={content.content} />;
  }
};

interface MessageContentsProps {
  contents: MessageContentType[];
}

const MessageContents: React.FC<MessageContentsProps> = ({ contents }) => {
  return (
    <div className="space-y-4">
      {contents.map((content, index) => (
        <MessageContentRenderer key={index} content={content} />
      ))}
    </div>
  );
};

export default MessageContents; 