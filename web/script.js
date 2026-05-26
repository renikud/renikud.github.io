if (typeof hljs !== 'undefined') {
    hljs.registerLanguage('bibtex', (hljs) => ({
        name: 'BibTeX',
        case_insensitive: true,
        contains: [
            hljs.COMMENT('%', '$'),
            { className: 'keyword', begin: /@[a-z]+(?=\{)/i },
            { className: 'symbol', begin: /(?<=\{)[a-z0-9_-]+(?=,)/i },
            { className: 'attr', begin: /\b[a-z]+\s*(?==)/i },
            {
                className: 'string',
                begin: /=\s*\{/,
                end: /\}/,
                excludeBegin: true,
                excludeEnd: true,
            },
            { className: 'punctuation', begin: /[{},=]/ },
        ],
    }));

    document.querySelectorAll('.cite code.language-bibtex').forEach((el) => {
        hljs.highlightElement(el);
    });
}

document.getElementById('copy-cite')?.addEventListener('click', () => {
    const code = document.querySelector('.cite pre code');
    if (!code) return;

    navigator.clipboard.writeText(code.textContent).then(() => {
        const btn = document.getElementById('copy-cite');
        const prev = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = '#292524';
        setTimeout(() => {
            btn.textContent = prev;
            btn.style.color = '';
        }, 2000);
    });
});
