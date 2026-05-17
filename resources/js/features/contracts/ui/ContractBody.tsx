import React from 'react';

const cleanText = (text: string) => text
  .replace(/`/g, '')
  .replace(/\*\*/g, '')
  .trim();

const isTableSeparator = (line: string) => /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);

function parseTable(lines: string[]) {
  const rows = lines
    .filter((line) => !isTableSeparator(line))
    .map((line) => line.split('|').map(cleanText).filter(Boolean));

  return rows;
}

export function ContractBody({ body }: { body?: string | null }) {
  if (!body) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        لا يوجد نص عقد متاح.
      </div>
    );
  }

  const lines = body.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line || line === '---') {
      index += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      const rows = parseTable(tableLines);
      if (rows.length > 0) {
        const [head, ...bodyRows] = rows;
        blocks.push(
          <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-muted/70">
                <tr>
                  {head.map((cell, cellIndex) => (
                    <th key={cellIndex} className="border-b border-border px-3 py-2 text-right font-bold">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="odd:bg-white even:bg-muted/30">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-b border-border px-3 py-2 last:border-b-0">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(<h4 key={index} className="mt-5 text-base font-bold text-foreground">{cleanText(line.slice(4))}</h4>);
      index += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(<h3 key={index} className="mt-6 border-b border-border pb-2 text-lg font-bold text-primary">{cleanText(line.slice(3))}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(<h2 key={index} className="text-center text-xl font-bold text-foreground">{cleanText(line.slice(2))}</h2>);
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(cleanText(lines[index].trim().slice(2)));
        index += 1;
      }

      blocks.push(
        <ul key={`list-${index}`} className="space-y-2 pr-5 text-sm leading-7 text-muted-foreground">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="list-disc">{item}</li>
          ))}
        </ul>,
      );
      continue;
    }

    blocks.push(
      <p key={index} className="text-sm leading-8 text-muted-foreground">
        {cleanText(line)}
      </p>,
    );
    index += 1;
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-5">
      {blocks}
    </div>
  );
}
