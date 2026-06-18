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

const clearAlignmentHighlights = () => {
    document.querySelectorAll('.is-linked').forEach((el) => {
        el.classList.remove('is-linked');
    });
};

const setAlignmentHighlight = (targets) => {
    clearAlignmentHighlights();
    targets.forEach((target) => {
        const [col] = target.split('-');
        document.querySelector(`[data-align-col="${col}"]`)?.classList.add('is-linked');
        document.querySelectorAll(`[data-align-part~="${target}"], [data-align-target="${target}"]`).forEach((el) => {
            el.classList.add('is-linked');
            el.closest('.align-pair')?.classList.add('is-linked');
        });
    });
};

document.querySelectorAll('[data-align-target]').forEach((cell) => {
    const targets = cell.dataset.alignTarget.split(/\s+/).filter(Boolean);
    cell.addEventListener('mouseenter', () => setAlignmentHighlight(targets));
    cell.addEventListener('focus', () => setAlignmentHighlight(targets));
    cell.addEventListener('mouseleave', clearAlignmentHighlights);
    cell.addEventListener('blur', clearAlignmentHighlights);
});

document.querySelectorAll('[data-align-col]').forEach((pair) => {
    const col = pair.dataset.alignCol;
    const targets = [`${col}-c`, `${col}-v`, `${col}-s`];
    pair.addEventListener('mouseenter', () => setAlignmentHighlight(targets));
    pair.addEventListener('focusin', () => setAlignmentHighlight(targets));
    pair.addEventListener('mouseleave', clearAlignmentHighlights);
    pair.addEventListener('focusout', clearAlignmentHighlights);
});

document.querySelectorAll('[data-align-part]').forEach((part) => {
    const targets = part.dataset.alignPart.split(/\s+/).filter(Boolean);
    const pair = part.closest('[data-align-col]');

    part.addEventListener('mouseenter', () => setAlignmentHighlight(targets));
    part.addEventListener('mouseleave', () => {
        if (pair?.matches(':hover')) {
            const col = pair.dataset.alignCol;
            setAlignmentHighlight([`${col}-c`, `${col}-v`, `${col}-s`]);
        } else {
            clearAlignmentHighlights();
        }
    });
});

const playIcon = '<svg class="audio-play-icon" viewBox="0 0 12 14" aria-hidden="true"><path fill="currentColor" d="M1 1.5v11l10-5.5L1 1.5z"/></svg>';
const pauseIcon = '<svg class="audio-play-icon" viewBox="0 0 12 14" aria-hidden="true"><path fill="currentColor" d="M1.5 1.5h3v11h-3v-11zm6 0h3v11h-3v-11z"/></svg>';

document.querySelectorAll('.audio-play-btn').forEach((btn) => {
    const audio = btn.parentElement?.querySelector('audio');
    if (!audio) return;

    btn.addEventListener('click', () => {
        if (audio.paused) {
            document.querySelectorAll('audio, video').forEach((otherMedia) => {
                if (otherMedia !== audio) {
                    otherMedia.pause();
                    otherMedia.currentTime = 0;
                }
            });

            audio.currentTime = 0;
            audio.play().catch(() => {
                btn.classList.remove('is-playing');
                btn.innerHTML = playIcon;
            });
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

// Clamp chip tooltips to stay within the viewport horizontally.
document.querySelectorAll('.chip--tip').forEach(chip => {
    const showTip = () => {
        const tip = chip.querySelector('.chip-tip');
        if (!tip) return;
        tip.style.left = '';
        tip.style.transform = '';
        const r = tip.getBoundingClientRect();
        const pad = 8;
        let shift = 0;
        if (r.right > window.innerWidth - pad) shift = window.innerWidth - pad - r.right;
        if (r.left + shift < pad) shift = pad - r.left;
        if (shift !== 0) {
            tip.style.left = `calc(50% + ${shift}px)`;
            const caret = tip.querySelector('::after');
            tip.style.setProperty('--caret-shift', `${-shift}px`);
        }
    };
    const resetTip = () => {
        const tip = chip.querySelector('.chip-tip');
        if (!tip) return;
        tip.style.left = '';
        tip.style.removeProperty('--caret-shift');
    };
    chip.addEventListener('mouseenter', showTip);
    chip.addEventListener('focusin', showTip);
    chip.addEventListener('mouseleave', resetTip);
    chip.addEventListener('focusout', resetTip);
});
