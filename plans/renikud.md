# ReNikud: Audio-Supervised Hebrew Grapheme-to-Phoneme Conversion

Maxim Melichov

Yakov Kolani

Morris Alper

*Reichman University*

*Independent Researcher*

*Carnegie Mellon University*

***Abstract*****—Grapheme-to-phoneme** **(G2P)** **conversion** **for** **Mod-** everyday spoken Hebrew. For instance, the word ⁧ךרדבו⁩is for-

**ern** **Hebrew** **is** **needed** **for** **applications** **like** **text-to-speech** **(TTS),**mally vocalized and pronounced asubadˈeʁeχ/, but in natural

**but** **is** **challenging** **due** **to** **the** **language’s** **abjad** **writing** **system,**speech, it is pronounced vebadˈeʁeχ/. Similarly,

םילשוריב

**which** **leaves** **vowels** **largely** **unwritten,** **creating** **widespread** **ambi-** is formally /biʁuʃalˈajim/, but native speakers typically say

**guity.** **Standard** **approaches** **first** **predict** **vowel** **diacritics** **(nikud)** bejeʁuʃalˈajim/ [4], [5].

**to** **produce** **International** **Phonetic** **Alphabet** **(IPA)** **transcriptions,**

**but** **this** **is** **limited:** **vocalization** **data** **is** **scarce** **and** **laborious** **to** Another issue is a lack of scalable data sources for directly

**produce,** **it** **does** **not** **specify** **features** **such** **as** **lexical** **stress,** **and**learning G2P. Vocalization models [6], [7] learn from Hebrew

**it** **reflects** **formal** **grammatical** **rules** **rather** **than** **everyday** **spo-** text with manually annotated vowel diacritics, data which

**ken** **pronunciation.** **Direct** **sequence-to-sequence** **IPA** **prediction,** is scarce and laborious to produce. Similarly, methods such

**meanwhile,** **struggles** **on** **limited** **data** **and** **fails** **to** **exploit** **the** as [3], [8] that learn from IPA annotations are bottlenecked

**character-level** **alignment** **characteristic** **of** **abjads.** **Our** **method,**

**ReNikud,** **overcomes** **these** **limitations** **with** **two** **key** **insights:** **(1)**by data availability. Conversely, another abundant source of

**Weak** **audio** **supervision** **via** **a** **phoneme-based** **automatic** **speech**data on pronunciation exists—unlabelled Hebrew audio—but

**recognition** **(ASR)** **pseudo-labeling** **pipeline** **on** **thousands** **of** **hours** existing methods can only learn from text.

**of** **unlabeled** **Hebrew** **audio,** **yielding** **phonemic** **transcriptions** **that** Finally, while methods using vocalization poorly reflect

**reflect** **natural** **spoken** **norms** **without** **manual** **annotation.** **(2)** **A**

**pseudo-vocalization** **architecture** **that** **predicts** **IPA** **phonemes** **at** spoken pronunciation, they have been shown to outperform

**each** **character** **position,** **enforcing** **character-level** **alignment** **as** **an**direct sequence-to-sequence (seq2seq) prediction of IPA [3],

**inductive** **bias.** **Results** **on** **existing** **Hebrew** **G2P** **benchmarks** **and**the latter of which struggles to learn on limited data while

**new** **targeted** **test** **suites** **for** **spoken** **Hebrew** **show** **that** **ReNikud** failing to use character-level alignment with the input transcript

**surpasses** **previous** **state-of-the-art** **methods.** **We** **will** **release** **our** as an inductive bias.

**code** **and** **trained** **models** **to** **support** **further** **work** **on** **Hebrew**

2

**TTS** **and** **speech** **technologies.**

Our method, *ReNikud* , directly addresses these challenges.

***Index*** ***Terms*****—Grapheme-to-Phoneme,** **Text-to-Speech,** **Modern** To reflect spoken norms and unlock abundant training data, we

**Hebrew,** **Weakly** **Supervised** **Learning,** **Automatic** **Speech** **Recog-** propose a novel pipeline to train G2P with*weak supervision*

**nition,** **Lexical** **Stress**

*from unlabeled Hebrew audio*. By applying an automatic

speech recognition (ASR)-based pseudo-labeling pipeline, we

I. Introduction

are able to extract pronunciation information and train on

thousands of hours of recordings, a scalable approach that

With increasing interest in text-to-speech (TTS) systems for effectively learns spoken Hebrew norms. To enforce character-

low-resource languages, the modern Hebrew language poses level alignment between Hebrew characters and phonemes, we

particular challenges. Hebrew is written as an*abjad*—a writ- introduce a *pseudo-vocalization* architecture. Like traditional

ing system that normally does not indicate vowel sounds [1]. vocalization, this predicts phonetic content aligned with each

Consequently, many words are homographs and require seman- character position, but rather than predicting traditional*nikud*

tic context for correct pronunciation. For example, the word 1

symbols it directly predicts character-aligned IPA phonemes.

םירפסמ⁦can be read as mispaʁˈim *numbers*), /mispaʁˈajim By using the orthographic structure of Hebrew text, this⁩

*scissors*), or mesapʁˈim/ ( *telling*). As this ambiguity con- increases data efficiency relative to seq2seq baselines, as we

founds TTS generations, leading open-source approaches first demonstrate.

predict *nikud* (vocalization, i.e., conventional vowel diacritics)

to condition synthesis [2], [3].

Our results on existing Hebrew G2P benchmarks show

that ReNikud succeeds in leveraging audio data and better

One issue is the mismatch between written and spoken reflecting Hebrew speech. In addition, we propose additional

Hebrew. Firstly, nikud does not fully specify phonetic features test suites and targeted evaluations to show improvements on

such as lexical stress, e.g., ⁧הריב⁩may be pronounced as b'iʁa difficult phonetic cases reflecting spoken language.

*beer*) or /biʁ'a/ ( *capital city* ). Secondly, nikud convention-

ally reflects traditional grammatical rules that do not match We will release our code, data and trained models to spur

work on Hebrew speech technologies.

Equal contribution 1We place the IPA stress mark directly before the stressed vowel, following 2

TTS conventions.

Rethinking Nikud


---

Figure 1: **System** **overview.** We first pseudo-label audio (left)

by creating a many-to-one FST alignment between unvocalized Hebrew text and IPA phonemes derived from two parallel

ASR runs applied to Hebrew audio. We then train a pseudo- vocalization architecture (right) where unvocalized Hebrew

characters are passed through a character encoder to predict a phonetic triplet (consonant, stress, and vowel) at each position via parallel classification heads.

II. Method

The ReNikud pipeline consists of two stages, shown in Fig- ure 1: audio pseudo-labeling (Section II-A), and our pseudo- vocalization architecture trained on this data (Section II-B).

*A. Audio Pseudo-Labeling*

To learn pronunciation from unlabeled audio at scale, we

construct a pipeline that extracts character-aligned IPA anno- tations using two parallel ASR systems, as shown in Figure 1 (upper left). We extract Hebrew orthographic transcripts with a standard pretrained Hebrew ASR model, and IPA transcripts with a custom ASR model trained to output IPA when applied to Hebrew audio. By applying both ASR systems to a large- scale, unlabeled Hebrew audio corpus, we extract parallel

Hebrew text and IPA transcriptions that serve*pseudo-labels* as

providing weak supervision for our downstream G2P model. To find character-level correspondences between ortho-

graphic and IPA transcripts, we perform a string alignment process based on the Hebrew orthography’s abjad structure. In general, abjads encode consonants linearly with interleaved, unwritten vowels, meaning that graphemes map monotonically to (consonant, vowel) pairs. As Hebrew also has unwritten lexical stress, each grapheme maps to *phonetic*a* triplet* en-

coding such a pair and a binary stress indicator. We find this alignment with a simple finite state transducer (FST) handling known consonant values, including one-to-many (e.g.,⁧ב ⁩b,

v/) and many-to-one (e.g., ⁧ט ת ⁩t/) mappings, as well as

orthographic complexities such as:

- **Digraphs:** Loanwords in Modern Hebrew frequently useone IPA symbol

an apostrophe (*geresh*) to denote non-native phonemes

(e.g., ⁧׳ז⁩for /ʒ/; the base letter⁧ז ⁩normally represents /z/).

The FST assigns the digraph phoneme to the base letter and passes over the*geresh*

- Word-final⁧ח ⁩χ/) may occur with an additional*preced-*

*ing* a/ vowel (*patah gnuva*), e.g., ⁧חול⁩l'uaχ/. We handle

this reordering with a special combinedaχ / value for the

vowel slot.

- **Silent** **letters** : The Hebrew letters⁧ו, י ה א ⁩may either

indicate consonant sounds or may be silent*matres lectio-*

*nis*). We handle the latter case with a null) consonant

class. An example of the resulting alignment between Hebrew

characters and phonetic triplets is shown in Table I.

**Word** **Char**

| םולש(/⁦ʃal'om/) ⁩ש | /⁦ʃ/ / | a/ 0 |⁩
|---|---|---|
| ל | /⁦l/ / | o/ 1 |⁩
| ו | ∅ ∅ | 0 |
| ם | /⁦m/ | ∅ 0 |⁩

ספי׳צ⁦tʃ'ips⁩

צ

**Consonant** **Vowel**

tʃ/ /

i/ 1

**Stress**

י פ ס

| חופת(/⁦tap'uaχ/) ⁩ת | /⁦t/ / | a/ 0 |⁩
|---|---|---|
| פ | /⁦p/ / | u/ 1 |⁩
| ו | ∅ ∅ | 0 |
| ח | ∅ | /⁦aχ/ 0 |⁩

Table I: **Examples** **of** **FST-derived**

Hebrew characters and phonetic

stress).

Importantly, we retain only pairs where the Hebrew and

IPA transcripts strictly agree on word count and successfully pass this alignment procedure. Rather than discarding an entire sentence upon encountering an alignment error, our pipeline using a greedy sub-sequence extraction, scanning the original 474K sentences to extract contiguous, perfectly aligned sub- sentences. While this word-level filtering eliminates approxi- mately 40% of the total words (from 10.9M down to 6.5M), the process successfully fragments the original 474K source texts into 1.52M valid utterances, consisting of both whole sentences and shorter extracted sub-sentences. understand the last part]

*B. Pseudo-Vocalization Architecture* Our goal is to create

unvocalized Hebrew text directly to IPA strings. Because He-

brew is an abjad, there is a strong, local relationship between individual written letters and their phonetic realizations, which standard sequence-to-sequence models inductive bias. To mitigate this, we

strained, per-character classification problem—a method we term *Pseudo-Vocalization*, illustrated in Figure 1 (right). While

a single Hebrew character typically corresponds to more than (e.g., a

we resolve this by having every Hebrew letter independently predict exactly one phonetic triplet, as defined in Section II-A.

∅ ∅ ∅ ∅ p s

triplets 0 0

0 0

**alignment** between (consonant, vowel,

[Morris: I don’t

a Hebrew G2P model that maps

fail to exploit as an

frame the G2P task as a con-

consonant followed by a vowel),


---

The core model is a character-level transformer encoder, with three parallel, independent classification heads that si- multaneously predict the phonetic attributes for each character directly from the encoder’s hidden states:

- **Consonant** **Head:** Selects from 25 IPA consonants or

null (

- **Vowel** **Head:** Selects from 5 vowels, null ), or the

special /aχ/ token (see Section II-A).

- **Stress** **Head:** Binary classifier for lexical stress.

At inference time, realizations are predicted by taking(right). [Max: should i add the name Gemini-3.1-pro? in the

the argmax of logits for each head. In addition, we apply

*constrained decoding* to enforce hard constraints on Hebrew It should be a gray dotted line, not solid black, and in caption

letters and phonetic realizations: the argmax is calculated only over possible consonantal realizations of a letter (e.g.,⁧ב ⁩can

only be realized as b/ or /v/). We also enforce a word-level

constraint that exactly one lexical stress is predicted.[Morris:

do we ablate the effect of constrained decoding?]

III. Experiments and Results

*A. Experimental Setup*

As our ASR model for outputting orthographic transcripts, we employ the Whisper Large v3 Turbo checkpoint fine-

tuned on Hebrew by ivrit.ai [9]. For ASR prediction of IPA, we adapt this model with two fine-tuning stages: (A) We

first train on IPA pseudo-labels produced by Phonikud [3]

3

applied to transcripts from the*SASpeech* [10] ( 18h ) and

*Recital* [11] ( 50h) audio corpora. (B) We then fine-tune on

the train split of the*ILSpeech* [3] ( 2h) audio corpus, con-

taining expert-annotated gold IPA transcripts. After training until convergence, this model achieves strong performance on held-out data (e.g., 2.4% Character Error Rate on the test

set of ILSpeech) and in qualitative inspection of predictions, supporting its use in our pipeline. Our G2P model is initialized with a dicta-

il/dictabert-large-char encoder with three added

classification heads as described in Section II-B. For training data, we apply our pseudo-labeling pipeline (Section II-A) to Knesset Vox [12], a corpus of 1.7K hours of parliamentary

recordings. We re-segment the raw audio into 5–15 second clips, as ASR quality degrades on longer inputs, and process each clip through both orthographic and IPA ASR models to obtain parallel transcripts. After FST alignment and filtering for transcript agreement and length outliers 1 5 IQR),

the pipeline yields 1.52M aligned Hebrew-to-IPA sentences. Models are trained until convergence on a held-out validation set.

*B. MILIM Benchmark* 4

We introduce the MILIM benchmark, a corpus of Hebrew

sentences with paired IPA annotations for targeted words in context. This is designed to assess Hebrew G2P models’ ability to perform complex phonetic disambiguation in challenging

3Filtered from the original 26h to remove segments with filler words. 4Meaning “words” in Hebrew; this benchmark evaluates pronunciation at the word level.

Figure 2: Word accuracy rate (left) and character accuracy rate

graph or in caption?][Morris: in caption or paper text is fine.

we should say that it provides an upper bound]

Hebrew contexts, such as spoken norms differing from formal language. The benchmark contains eleven categories each

consisting of [Morris: about?] [Max: there 3 categories with

151 1653/150=11] 150 sentences containing one or more

targeted words [Morris: are final totals 1,653 sentences and

3,110 words?] . These were produced with a semi-manual

procedure including manual production as well as verification and correction of items produced by Gemini-3.1-pro when

shown existing items as in-context seeds. MILIM also includes the test split of ILSpeech as an additional control category (using version 2, with minor orthographic fixes from the

original ILSpeech release). Examples from MILIM are shown in Table II. The cate- gories test the following challenges:

- **Gender:** Pronouns and suffixes whose pronunciation de-

pends on the gender of the referent.

- **Homographs:** Identically spelled words with different

meanings and pronunciations (excluding minimal stress pairs, a separate category).

- **Slang:** Informal vocabulary absent from standard dictio-

naries.

- **Colloquial:** Words where everyday spoken pronunciation

diverges from prescriptive norms.

- **Rare** **Phonemes:** Words with rare or non-native

phonemes marked by geresh diacritics.

- **foreign:** category covers loanwords and non-native vo-

cabulary in Hebrew script like Instagram, Telegram etc.

- **Acronyms:** Hebrew acronyms requiring correct stress and

vowel resolution.

- **Penultimate** **Stress:** Words stressed on the penultimate

syllable, unlike Hebrew’s default final stress.

- **Minimal** **Stress** **Pairs:** Word pairs distinguished only by

stress placement.

- **Names:** Proper nouns, which often have non-standard

pronunciation patterns.

- **ILSpeech-v2:** Control from the existing ILSpeech bench-

mark.

*C. G2P Evaluation* We evaluate all models on MILIM using word-level WER

and CER against gold IPA annotations, micro-averaged across


---

**Cat.** **Input**

Gender Acronyms

**Target**

ךתיארדסבלכה

ן״מאב

**IPA** **Cat.** **Input**

ידיגת ךתיא⁦ʔitˈaχ/ Names⁩

ן״מאבתרישאוה⁦beʔamˈan/ Homogr.⁩

**Target**

**IPA**

ילשהלוחכההצלוחההפיאיהיליהיל⁦lˈihi⁩

בשיאוהשןמזבןיינעמרפסארקאוהרפס⁦sˈefeʁ/~/sapˈaʁ⁩

םישנרפסלצא

Penult.

Rare Ph.

Foreign

Table II: Selected examples from MILIM, split by category (Cat.). Abbreviated category names are penultimate stress (Penult.),

rare phonemes (Rare Ph.), homographs (Homogr.), and minimal stress pairs (Min. [Morris: maybe also ILSpeech example?]

םחל ירטםחליתינק⁦lˈeχem/ Min. Str.⁩

רהמלכאת

ךליבשבספי׳ציתאבהספי׳צ⁦tʃˈips/ Slang⁩

ביוו

הפשיבוטביווהזיא⁦vˈajb⁩

וידלילשםיגשיההמחורתחנולהיהתחנ⁦nˈaχat/~/naχˈat⁩

לולסמהלעםולשבתחנסוטמה ירמגלבונגםדאןבאוהבונג⁦ɡanˈuv⁩

Str.). add new category (colloquial),

categories (Table III, Figure 2). ReNikud outperforms all baselines overall, with the largest gains on categories reflecting spoken Hebrew norms.[Mor-

ris: should we add qual examples? or point to same ones

as ablations?] On colloquial items, ReNikud correctly

predicts spoken forms such as

החפשמו⁦vemiʃpaχˈa⁩

where both Phonikud and Gemini default to the prescriptive umiʃpaxˈa/—reflecting the well-known divergence between

the formal “bumaf” conjunction rule and everyday speech.

On slang, ReNikud correctly resolves items like ⁧החידאפ⁩

fadˈiχa/ (Phonikud: */padiχˈa/). On foreign items, ReNikud

maps non-native phonemes correctly, e.g., ⁧רניוו ⁩wˈineʁ (Phonikud: */vinˈeʁ/).

We also report Gemini 3.1 Pro as an upper bound; however,

as Gemini generated the test sentences (excluding ILSpeech), its scores may reflect upward bias. Moreover, LLMs are

impractical for G2P in applications like real-time TTS that require low latency and open, reproducible models.

*D. Transfer to Diacritization*

Diacritization (*nikud* prediction) is closely related to G2P,

as both require resolving per-character phonetic ambiguities. However, diacritic annotation requires specialist linguistic

knowledge that most native speakers lack, making labeled data

scarce and difficult to scale—unlike unlabeled audio, which is abundant. We hypothesize that phonetic representations

learned from audio supervision can transfer to diacritization. We retain the pre-trained ReNikud encoder and replace the phonetic classification heads with a nikud prediction head,

following the per-character methodology of DictaBERT [7].

We fine-tune on subsets of 10k, 25k, 50k, and 100k

sentences from the Knesset corpus (processed via the Dicta Nakdan API), with 10k held out for validation. We evaluate on 100 manually corrected sentences from the Nakdimon test set [6] (originally consisting of automatic pseudo-labels with frequent inaccuracies), comparing against a DictaBERT base- line trained with identical hyperparameters and early stopping. As shown in Figure 3, the ReNikud-initialized encoder con- verges faster at small data sizes (10k: 13.4% vs. 15.7% WER,

p < 0 001), suggesting that audio-supervised pretraining

provides useful representations for diacritization. Both modelsfrom encoder choice.] reach statistical parity by 100k sentences (10.7% vs. 10.9% WER, p > 0 8; bootstrap 95% CI: 0 013 0 011]), per-

Figure 3: Diacritization performance on test set over the

different number of sentences in the training 5

forming comparably to the fully-trained DictaBERT-Menaked (Table IV). [Max: how do we want to show the qualitative results? the models results are almost 1 to 1.][Max: really unsure about

this part] [Max: do we even want to compare it to DictaBERT- Menaked?]

*E. Ablations*

We ablate both architecture and data source choices; per-

category qualitative examples are in Table V. **Architecture.** We compare our pseudo-vocalization heads

against ByT5-Small (seq2seq) and a CTC network on the same DictaBERT encoder, all trained on identical Knesset Vox data (Table VI). Our method outperforms both overall. Without

character-level alignment as an inductive bias, the seq2seq

baseline frequently mispredicts vowels, stress placement, and other underspecified phonetic features—e.g., inserting a glottal stop in ⁧הפאל⁩lˈafa leʔapˈa/) or defaulting to final stress

on penultimate-stressed words ( ⁧הלחא⁩ʔˈaχla ʔaχlˈa/). The

CTC baseline shares our encoder but still underperforms,

particularly on stress and vowel accuracy.[Morris: TODO:

test seq2seq with DictaBERT encoder to isolate architecture

5dicta-il/dictabert-large-char-menaked


---

Stress

Homog.

Phonemes

Gender Acronyms Penult. Rare

Foreign Names Stress

Slang Colloquial

| ReNikud | (Ours) | 47.4 | **14.3/ 34.2** | / 8.9 | **19.9** / **3.6** | **58.3** / | **17.0** 46.5 / 11.1 | **29.3** / **9.5** | **18.2** / **9.8 37.8** | / **11.2 53.6** | / **9.3 27.3** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CTC | Loss | Network 62.5 | / 20.7 | 34.9 **8.7/** | 21.2 / | 3.8 63.6 | / 17.2 **44.5** / **10.6** | 31.3 / 10.4 | 22.7 / 10.8 | 38.5 / 11.6 | 57.6 / 10.1 30.0 |
| ReNikud |  | (Phonikud Data) | **45.4** / 15.0 76.3 | / 25.9 | 29.8 | / 6.3 82.1 | / 29.1 47.1 | / 12.6 32.7 | / 11.0 21.2 | / 10.5 43.6 | / 15.1 90.1 |
| Renikud | w/Vox | labeled with Phonikud | 64.5 / 20.7 | 80.3 / | 26.3 33.1 | / 7.0 84.1 | / 27.0 57.4 | / 15.9 34.0 | / 11.1 23.7 | / 10.9 55.1 | / 19.7 92.1 |
| Seq2Seq | (ByT5) | 61.2 | / 24.0 43.4 | / 10.9 | 27.8 | / 6.7 69.5 | / 20.1 55.5 | / 15.8 36.7 | / 13.4 29.1 | / 15.7 51.9 | / 20.3 55.6 |
| Phonikud |  | (Baseline) 61.2 | / 20.0 64.5 | / 23.6 | 42.4 | / 9.1 82.8 | / 27.9 65.8 | / 18.2 34.7 | / 11.1 23.2 | / 10.0 59.0 | / 20.6 91.4 |

Table III: Detailed evaluation on the Hebrew G2P challenge suite (WER / CER, [Morris:

all (for supplementary material? also duplicates some ablation results)]

**Model** **Train**

/ 17.2

/ 6.3 82.1

/ 24.0 43.4 / 20.0 64.5

**Size** **WER**

/ 10.9 27.8 / 23.6 42.4

/ 6.7 69.5 / 9.1 82.8

/ 29.1 47.1 / 12.6 32.7

/ 20.1 55.5 / 15.8 36.7

/ 27.9 65.8 / 18.2 34.7

in %). not sure we need this table at

**(Corpus)** **CER**

/ 13.4 29.1 / 11.1 23.2

**(Corpus)** **EM**

/ 10.5 43.6

/ 15.7 51.9 / 10.0 59.0

/ 15.1 90.1

/ 20.3 55.6 / 20.6 91.4

| DictaBERT-Menaked | (pretrained [Max: i dont think the | training info is public]) 10.21 1.68 | 29 |
|---|---|---|---|
| **VReNikud** | **(Ours)** 100k 10.74 | 1.83 | 29 |
| Dicta 100k | 10.86 | 1.84 | 31 |

Table IV: Diacritization performance on the test set (in 10.86

[Morris: do we need this table?]

1.83 1.84

**Cat.** **Word**

Gender Homogr. Colloq. Slang Acronym

**Target** **Ours**

ךלצא ⁦ʔetslˈeχ/ /⁩

לצב2 / ⁦betsˈel/, /batsˈal⁩

םיקרבו⁦vebʁakˈim/ /⁩

הרפכ⁦kapˈaʁa/ /⁩

א״דמב⁦bemˈada/ /⁩

**Phonikud**

ʔetslˈeχ X

X X vebʁakˈim X

kapˈaʁa X

bemˈada X

**ByT5**

**Method**

ʔˈetslχ/ / ʔetslˈχa

btsˈel/, /bˈatsal

uvʁakˈim/ /

kapaʁˈa/ /

bemadˈa/ /

/ —

| *Architecture* | *comparison* | *(all trained on* | *Knesset Vox,* | *audio-derived IPA):* |
|---|---|---|---|---|
|  | †Seq2Seq(ByT5-Small) |  | 24.1 4.9 32.1 | 11.0 |
| CTC | (DictaBERT encoder) | 21.2 | 3.8 27.9 | 8.9 |
| **Ours** | **(DictaBERT** | **encoder) 13.7** | **2.7 26.7** | **8.5** |

ubʁakˈim

kapeʁˈa bemˈadˈa 29 29 31

**Val.** **(250)** **Test**

WER CER WER

**(1,500)**

CER 11.0

Penult. Rare Ph.

טפסנוק⁦kˈonsept/ /⁩

רנא’ז⁦haʒˈaneʁ/ /⁩

kˈonsept X

haʒˈaneʁ X

konsˈept/ /

haʒanˈeʁ/ —

konsˈept *Data source comparison (all using our architecture):*

Foreign ⁧רקאה⁩hˈakeʁ/ /

hˈakeʁ X hakˈeʁ/ / haʔakˈeʁ Phonikud text corpus 23.4 6.8 32.6 11.0

Knesset Vox, Phonikud-labeled IPA 20.7 4.5 33.0 9.9

**Knesset** **Vox,** **ASR-derived** **IPA** **(Ours)** **13.7** **2.7** **26.7** **8.5**

Table V: Qualitative examples from MILIM. X = matches Uses ByT5 encoder; see text.

target. Common error patterns include stress misplacement

(Phonikud, ByT5), formal conjunction defaults (Phonikud), Table VI: Performance comparison of generation methods.

and phoneme insertion (ByT5).[Morris: clean and add miss- Error rates are reported as percentages for Word Error Rate

ing; add CTC?]

(WER) and Character Error Rate (CER), evaluated on both a curated validation set of 250 sentences and the full held-out test set of 1,500 sentences.

**Data** **source.** We compare three data conditions with the

same architecture: audio-derived IPA from Knesset Vox (our full pipeline), text-derived IPA from Phonikud applied to theEnglish [13], [14] or in multilingual settings [15]. However,

same Knesset Vox transcripts, and training on Phonikud’sthese works train on labeled audio as a supplementary signal

original text corpus. Audio-derived labels outperform text- to labelled text, while we use large-scale unlabeled audio as

derived labels across all MILIM categories (Table III), withour primary training signal. Additionally, we operate on the

the largest gains on colloquial and slang items where spokenHebrew language which has a high degree of orthographic

and written norms diverge most.

ambiguity and phonetic features unspecified in text (stress,

spoken norms, etc.), and our pseudo-vocalization architecture

IV. Related Work

uses abjad-style alignment as an inductive bias.

Explicit G2P conversion for Hebrew was recently introduced(2) **Audio-guided** methods also take audio along with text at

by Kolani et al. [3], following prior works on Hebrew dia-inference time for G2P [16]–[18] or abjad diacritization [19],

critization [6], [7]. These approaches are bottlenecked by the[20]. While adding audio as an additional input can provide a

availability of annotated textual data, while we use audio as aricher signal, we focus on the case where only text is available

scalable source of pronunciation information.

at inference time.

Among prior works learning pronunciation from audio

V. Conclusion

in other language settings, we distinguish between two ap- proaches:

We introduced ReNikud, a framework for Hebrew G2P

(1) **Audio-supervised** methods such as ours use audio duringconversion that encompasses both a*Pseudo-Vocalization* ar-

training to improve pronunciation knowledge. Most similarchitecture and a methodology for leveraging audio data. By re-

ReNikud (Ours) 47.4 CTC Loss Network 62.5 ReNikud (Phonikud Data) Renikud w/Vox labeled with Phonikud 64.5 Seq2Seq (ByT5) 61.2 Phonikud (Baseline) 61.2  / 20.7 34.9 21.2 / 3.8 63.6  / 25.9 29.8  / 20.7 80.3  / 26.3 33.1 31.3 / 10.4 22.7  / 10.8 38.5  / 11.6 57.6 [Max: i dont think the training info is public]  comparison (all trained on Knesset Vox, audio-derived IPA): Seq2Seq (ByT5-Small) CTC (DictaBERT encoder) 21.2to our work, a few studies use audio to improve G2P forframing the unconstrained sequence-to-sequence problem into


---

a per-character phonetic triplet classification task (Consonant, Vowel, Stress), our approach introduces an inductive bias

matching the abjad structure of Hebrew orthography, unlike existing approaches and baselines. To train this architecture, we developed a weak-supervision

pipeline utilizing a monotonic FST to align continuous IPA transcriptions from an adapted Whisper ASR model with

unvocalized Hebrew graphemes. We also propose the MILIM

becnmark, on which evaluations show that ReNikud outper- forms prior methods on Hebrew G2P—particular in chal-

lenging cases such as colloquial slang, rare phonemes, and penultimate stress. Finally, we demonstrate the broader utility of our character-level encoder by adapting it to traditional

Hebrew text diacritization, achieving competitive accuracy

with substantially less training data than standard approaches.

**Limitations** **and** **Future** **Work:** A primary limitation of our

methodology is its reliance on ASR-generated pseudo-labels, as inherent transcription errors from the ASR model naturally propagate into the G2P training data. Furthermore, because our FST alignment mechanism enforces a strict character-

to-phoneme mapping, the aligner tends to discard highly

informal spoken variants that deviate significantly from the written orthography (for example, when a speaker colloquially pronounces the first-person ⁧בותכא⁩as /jixtov/).

Additionally, since the Knesset Vox dataset consists entirely

of parliamentary speeches, the training corpus is skewed

toward formal discourse. This lack of casual, second-person

dialogue likely contributes to the model’s occasional difficul- ties in resolving gendered morphology compared to legacy

models trained on diverse literary texts.[Morris: not sure that

last part is true]Future work will focus on expanding our weak-

supervision pipeline to incorporate unstructured conversational audio corpora to address these domain-specific biases. Finally, because the challenge of unwritten vowels is shared across other abjad writing systems, such as Arabic, we plan to extend the *Pseudo-Vocalization* architecture to evaluate its cross-

lingual generalizability.

References

[1] P. T. Daniels and W. Bright, *The world’s writing systems*. Oxford

University Press, 1996.

[2] V. Pratap, A. Tjandra, B. Shi, P. Tomasello, A. Babu, S. Kundu,

A. Elkahky, Z. Ni, A. Vyas, M. Fazel-Zarandi*et al.* , “Scaling speech

technology to 1,000+ languages,” *Journal of Machine Learning Re-*

*search*, vol. 25, no. 97, pp. 1–52, 2024.

[3] Y. Kolani, M. Melichov, C. Calev, and M. Alper, “Phonikud: Hebrew grapheme-to-phoneme conversion for real-time text-to-speech,”*arXiv*

*preprint arXiv:2506.12311*, 2025.

[4] A. Aharoni, “Vocalization of modern hebrew,” in*Encyclopedia of*

*Hebrew Language and Linguistics*, G. Khan, S. Bolozky, S. E. Fassberg,

G. A. Rendsburg, A. D. Rubin, O. Schwarzwald, and T. Zewi, Eds. Leiden: Brill, 2013, vol. 3, pp. 944–951. [5] H. Neudecker, “Vocalization of modern hebrew and colloquial pro- nunciation,” in *Encyclopedia of Hebrew Language and Linguistics*

G. Khan, S. Bolozky, S. E. Fassberg, G. A. Rendsburg, A. D. Rubin,
O. Schwarzwald, and T. Zewi, Eds. Leiden: Brill, 2013, vol. 3, pp.

951–953. [6] E. Gershuni and Y. Pinter, “Restoring hebrew diacritics without a dic- tionary,” in *Findings of the Association for Computational Linguistics:*

*NAACL 2022*, 2022, pp. 1010–1018.

[7] S. Shmidman, A. Shmidman, and M. Koppel, “Dictabert: A state-of- the-art bert suite for modern hebrew,” 2023. [8] J. Zhu, C. Zhang, and D. Jurgens, “Byt5 model for massively multi- lingual grapheme-to-phoneme conversion,” in*Proc. Interspeech 2022*

2022, pp. 446–450. [9] ivrit.ai, “ivrit-ai/whisper-large-v3-turbo,” [https://huggingface.co/ivrit-ai/](https://huggingface.co/ivrit-ai/) whisper-large-v3-turbo, 2025.

[10] O. Sharoni, R. Shenberg, and E. Cooper, “Saspeech: A hebrew single speaker dataset for text to speech and voice conversion,” *Proc.* in

*Interspeech*, 2023.

[11] ivrit.ai, “ivrit-ai/crowd-recital,” [https://huggingface.co/datasets/ivrit-ai/](https://huggingface.co/datasets/ivrit-ai/) crowd-recital, 2025.

[12] Y. Marmor, A. Zulti, D. Krongauz, A. Gabet, Y. Snapir, Y. Lifshitz, and E. Segal, “Voxknesset: A large-scale longitudinal hebrew speech dataset for aging speaker modeling,” 2026. [Online]. Available:

[https://arxiv.org/abs/2603.01270](https://arxiv.org/abs/2603.01270)

[13] S. Sun, K. Richmond, and H. Tang, “Improving seq2seq tts frontends with transcribed speech audio,” *IEEE/ACM Transactions on Audio,*

*Speech, and Language Processing*, vol. 31, pp. 1940–1952, 2023.

[14] S. Sun and K. Richmond, “Acquiring pronunciation knowledge from transcribed speech audio via multi-task learning,” 2024. [Online].

Available: [https://arxiv.org/abs/2409.09891](https://arxiv.org/abs/2409.09891)

[15] M. S. Ribeiro, G. Comini, and J. Lorenzo-Trueba, “Improving grapheme- to-phoneme conversion by learning pronunciations from speech record- ings,” *arXiv preprint arXiv:2307.16643*, 2023.

[16] J. Route, S. Hillis, I. C. Etinger, H. Zhang, and A. W. Black, “Multi- modal, multilingual grapheme-to-phoneme conversion for low-resource languages,” in *Proceedings of the 2nd Workshop on Deep Learning*

*Approaches for Low-Resource NLP (DeepLo 2019)*, 2019, pp. 192–201.

[17] H. Gao, M. Hasegawa-Johnson, and C. D. Yoo, “G2pu: grapheme-to- phoneme transducer with speech units,” in*ICASSP 2024-2024 IEEE*

*International Conference on Acoustics, Speech and Signal Processing* *(ICASSP)*. IEEE, 2024, pp. 10 061–10 065.

[18] C.-J. Li, K. Chang, S. Bharadwaj, E. Yeo, K. Choi, J. Zhu, D. Mortensen, and S. Watanabe, “Powsm: A phonetic open whisper-style speech

foundation model,” *arXiv preprint arXiv:2510.24992*, 2025.

[19] S. Shatnawi, S. Alqahtani, and H. Aldarmaki, “Automatic restoration of diacritics for speech data sets,” 2024. [Online]. Available:

[https://arxiv.org/abs/2311.10771](https://arxiv.org/abs/2311.10771)

[20] A. Ghannam, N. Alharthi, F. Alasmary, K. Al Tabash, S. Sadah, and

L. Ghouti, “Abjad ai at nadi 2025: Catt-whisper: Multimodal diacritic restoration using text and speech representations,” pp. 757–761, 2025.
