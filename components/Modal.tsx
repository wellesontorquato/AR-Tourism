// Função auxiliar para evitar XSS (Cross-Site Scripting)
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function renderMarkdownToHtml(md: string): string {
  if (!md) return "";

  // 1. Sanitizar entrada para segurança (impede scripts maliciosos)
  // Nota: Isso impede HTML puro no markdown. Se precisar de HTML, use uma lib real (DOMPurify).
  let clean = escapeHtml(md);

  // Normalizar quebras de linha
  clean = clean.replace(/\r\n/g, "\n");

  // 2. Parse de Elementos de Bloco (Headers, Blockquotes, Lists)
  
  // Headers (H1-H3)
  // Adiciona ids para acessibilidade/links futuros se precisar
  clean = clean
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-5 mb-3 border-b border-white/10 pb-1">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-black text-white mt-6 mb-4">$1</h1>');

  // Blockquotes
  clean = clean.replace(
    /^> (.*$)/gm,
    '<blockquote class="border-l-4 border-emerald-500 pl-4 py-1 my-4 bg-white/5 text-white/80 italic rounded-r">$1</blockquote>'
  );

  // Listas não ordenadas
  // A Regex anterior podia falhar com múltiplas listas. Esta é um pouco mais segura para MVP.
  // Transformamos linhas "- item" em "<li>item</li>"
  clean = clean.replace(/^- (.*$)/gm, '<li class="ml-4 list-disc marker:text-emerald-400 pl-1">$1</li>');
  
  // Envelopar sequências de <li> em <ul>
  // O truque aqui é pegar grupos consecutivos de <li> e quebras de linha
  clean = clean.replace(/((<li.*<\/li>\n?)+)/g, '<ul class="my-3 space-y-1 text-white/90">$1</ul>');

  // 3. Parse de Elementos Inline (Bold, Italic, Link, Code)
  
  // Bold (**text**)
  clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  
  // Italic (*text*)
  clean = clean.replace(/\*(.*?)\*/g, '<em class="text-white/90">$1</em>');

  // Inline Code (`text`) - Adicionado pois é comum
  clean = clean.replace(/`([^`]+)`/g, '<code class="bg-black/30 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono border border-white/10">$1</code>');

  // Links básicos [text](url) - Regex simplificada
  clean = clean.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline hover:text-emerald-300 transition-colors">$1</a>'
  );

  // 4. Tratamento de Parágrafos
  // Divide por quebra de linha dupla para criar parágrafos, ignorando o que já é tag de bloco
  return clean
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      
      // Se já começa com tag de bloco HTML que criamos, não envolve em <p>
      if (
        trimmed.startsWith("<h") || 
        trimmed.startsWith("<ul") || 
        trimmed.startsWith("<blockquote")
      ) {
        return trimmed;
      }
      
      // Caso contrário, é parágrafo. Converte newlines simples em <br>
      return `<p class="text-white/80 leading-relaxed my-2">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}