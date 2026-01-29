// Markdown "simples" (MVP): headings, bold, italic, blockquote e quebras de linha.
// NÃO é um parser completo, mas atende ao requisito de "markdown simples".
export function renderMarkdownToHtml(md: string): string {
  let html = md
    .replace(/\r\n/g, "\n")
    .replace(/^### (.*)$/gm, "<h3 class='text-lg font-semibold mt-3 mb-2'>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1 class='text-2xl font-black mt-4 mb-2'>$1</h1>")
    .replace(/^> (.*)$/gm, "<blockquote class='border-l-4 pl-3 italic opacity-90 my-2'>$1</blockquote>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)$/gm, "<li class='ml-5 list-disc'>$1</li>");

  // Agrupa listas (<li>) em <ul>
  html = html.replace(/(<li[\s\S]*?<\/li>)/g, "<ul class='my-2'>$1</ul>");

  // Parágrafos e quebras
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<ul") || trimmed.startsWith("<blockquote")) {
        return trimmed.replace(/\n/g, "<br/>");
      }
      return `<p class="my-2 leading-relaxed">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");

  return html;
}
