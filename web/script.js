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

const playIcon = '<svg class="audio-play-icon" viewBox="0 0 12 14" aria-hidden="true"><path fill="currentColor" d="M1 1.5v11l10-5.5L1 1.5z"/></svg>';
const pauseIcon = '<svg class="audio-play-icon" viewBox="0 0 12 14" aria-hidden="true"><path fill="currentColor" d="M1.5 1.5h3v11h-3v-11zm6 0h3v11h-3v-11z"/></svg>';

document.querySelectorAll('.audio-play-btn').forEach((btn) => {
    const audio = btn.parentElement?.querySelector('audio');
    if (!audio) return;

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    audio.addEventListener('play', () => {
        btn.classList.add('is-playing');
        btn.innerHTML = pauseIcon;
    });

    const resetButton = () => {
        btn.classList.remove('is-playing');
        btn.innerHTML = playIcon;
    };

    audio.addEventListener('pause', resetButton);
    audio.addEventListener('ended', resetButton);
});
