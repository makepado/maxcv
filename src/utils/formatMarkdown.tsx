import React from 'react';

/**
 * 인라인 서식 파서:
 * - **볼드** 또는 <b>볼드</b> -> <strong>볼드</strong>
 * - *기울임* 또는 <i>기울임</i> -> <em>기울임</em>
 * - <u>밑줄</u> 또는 __밑줄__ -> <u>밑줄</u>
 */
export function renderInlineFormattedText(text: string): React.ReactNode {
  if (!text) return text;

  // 정규식 매칭:
  // 1) **bold**
  // 2) __underline__
  // 3) <u>underline</u>
  // 4) <b>bold</b>
  // 5) *italic*
  // 6) <i>italic</i>
  const regex = /(\*\*[^\*]+?\*\*|__[^\_]+?__|<u>[\s\S]+?<\/u>|<b>[\s\S]+?<\/b>|\*[^\*]+?\*|<i>[\s\S]+?<\/i>)/g;
  const parts = text.split(regex);

  if (parts.length <= 1) {
    return text;
  }

  return parts.map((part, index) => {
    if (!part) return null;

    // **bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold">
          {renderInlineFormattedText(inner)}
        </strong>
      );
    }

    // <b>bold</b>
    if (part.startsWith('<b>') && part.endsWith('</b>') && part.length >= 7) {
      const inner = part.slice(3, -4);
      return (
        <strong key={index} className="font-bold">
          {renderInlineFormattedText(inner)}
        </strong>
      );
    }

    // __underline__
    if (part.startsWith('__') && part.endsWith('__') && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <u key={index} className="underline underline-offset-2">
          {renderInlineFormattedText(inner)}
        </u>
      );
    }

    // <u>underline</u>
    if (part.startsWith('<u>') && part.endsWith('</u>') && part.length >= 7) {
      const inner = part.slice(3, -4);
      return (
        <u key={index} className="underline underline-offset-2">
          {renderInlineFormattedText(inner)}
        </u>
      );
    }

    // *italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {renderInlineFormattedText(inner)}
        </em>
      );
    }

    // <i>italic</i>
    if (part.startsWith('<i>') && part.endsWith('</i>') && part.length >= 7) {
      const inner = part.slice(3, -4);
      return (
        <em key={index} className="italic">
          {renderInlineFormattedText(inner)}
        </em>
      );
    }

    return part;
  });
}
