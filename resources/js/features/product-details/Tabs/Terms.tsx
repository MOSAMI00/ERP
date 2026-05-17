interface TabTermsProps {
  terms?: string | null;
}

export function TabTerms({ terms }: TabTermsProps) {
  const lines = (terms ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">شروط وسياسات المنصة</h3>
      {lines.length > 0 ? (
        <ul className="space-y-2 text-muted-foreground">
          {lines.map((line, index) => (
            <li key={`${line}-${index}`} className="flex gap-2">
              <span>•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">لم يتم ضبط شروط المنصة بعد.</p>
      )}
    </div>
  );
}
