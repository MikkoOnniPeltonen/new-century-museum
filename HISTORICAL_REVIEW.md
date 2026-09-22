# Historical content review

Reviewed 15–16 September 2026. Scope: all 20 records in `src/data/persons.json`, including
names, roles, lifespan fields, biographies, featured works, and the meaning of map/century labels.
This is a source-based editorial audit, not a forensic investigation or exhaustive scholarly review.
**Approved text corrections applied on 16 September 2026.** The findings below preserve the rationale
from the original audit; wording such as “current” and “recommended” in those findings refers to the
pre-correction snapshot, not to outstanding implementation work.

**Collection update on 22 September 2026.** The previously reviewed Anton Wilhelm Amo and Wang
Zhenyi entries were retired from the live collection because their displayed portrait/work images
could not be authenticated as presented. They were replaced by Olaudah Equiano and Maria Sibylla
Merian, whose biographies, dates, source references and image provenance notes are now recorded in
`src/data/persons.json`, `src/data/image-provenance.ts` and `IMAGE_REVIEW.md`.

## Implementation record

- Corrected all six priority items below, qualified uncertain dates and revised the additional
  wording identified in the all-person register. Removed unsupported graphics and book-priority claims.
- Removed Liu's head-of-state and Nzinga's activist game tags. Also removed Ieyasu's head-of-state
  tag to distinguish the shogun's military government from the emperor's position.
- Added source references and review dates to all 20 records, accessible in rooms and map/timeline drawers.
- Added lifespan labels and date notes. Amo's death is unknown, explicitly distinct from living status;
  his bar stops at the last documented living year with a visible timeline explanation.
- Retained numeric plotting references for disputed births, with explanatory notes. No speculative
  death year was substituted. No portrait or work image was changed or authenticated.
- Remaining work: image provenance/authenticity and any deeper specialist historical review. The
  source links support text, not the identity or copyright status of the accompanying images.

## Overall finding

All twenty names and central biographical identities correspond to real historical figures.
No textual identity substitution was found. However, there are factual overstatements, uncertain dates
presented as exact, a mistaken game classification, and celebratory language that obscures complexity.
The collection should not yet be described as fully historically verified. Errors do not establish
intentional tampering; establishing that would require a separate provenance/version-history review.

## Priority corrections

1. **İbrahim Müteferrika:** his was not the Ottoman Empire's first Arabic-script press.
   An Arabic-script press operated in Aleppo around 1706, before his Istanbul venture.
   Suggested wording: “An Ottoman diplomat and publisher who co-founded a pioneering Ottoman Turkish
   printing press in Istanbul in 1727. Its first book, the Vankulu dictionary, appeared in 1729.”
   His death year also needs correction: the TDV specialist biography supports **1747**, explaining
   the older 1745 reading and citing Ottoman payroll evidence. Birth is estimated between 1670 and 1674,
   rather than securely 1674. [Library of Congress](https://blogs.loc.gov/law/2023/08/ibrahim-muteferrika-first-muslim-printer-of-the-ottoman-empire/),
   [TDV İslâm Ansiklopedisi](https://islamansiklopedisi.org.tr/ibrahim-muteferrika).

2. **Lech Wałęsa:** “first democratically elected president” erases earlier parliamentary elections.
   Suggested replacement: “Elected president in Poland's 1990 popular presidential election.”
   Gabriel Narutowicz had been elected president by the National Assembly in 1922.
   [Polish presidency](https://www.president.pl/en/archives/andrzej-duda/presidential-residences/belweder),
   [Polish education portal](https://zpe.gov.pl/a/the-presidents-of-the-second-republic-of-poland/D8mDAdXQr).

3. **Franklin D. Roosevelt:** the New Deal caption conflates the 1935 Act with later disability insurance.
   The 1935 law included old-age and unemployment provisions and aid to certain groups, including blind
   people; general disability insurance was added in **1956**, not under FDR. Suggested wording:
   “The Social Security Act (1935) established old-age benefits, unemployment insurance and public-assistance
   programmes. The Fair Labor Standards Act (1938) introduced federal wage, hours and child-labour protections.”
   [SSA disability history](https://www.ssa.gov/policy/docs/ssb/v66n3/v66n3p1.html),
   [SSA legislative history](https://www.ssa.gov/history/law.html),
   [Department of Labor history of the 1938 Act](https://www.dol.gov/general/aboutdol/history/flsa1938).

4. **Liu Mingchuan:** remove the `head of state` trait. The record itself correctly identifies him as
   a Qing provincial governor, not a sovereign national leader. This currently misinforms the games.
   Keep `military leader` and, as an editorial category, `innovator`; focus the biography on Taiwan's
   administration and infrastructure rather than implying he modernized all of China's military.
   [National Tsing Hua University biographical page](https://www.ee.nthu.edu.tw/~sdyang/BioInfo/Bio_Liu_MC.htm),
   [Qing biographical reference](https://en.wikisource.org/wiki/Eminent_Chinese_of_the_Ch%27ing_Period/Liu_Ming-ch%27uan).
   The university page itself overstates a railway “first”; do not copy that claim into the museum.

5. **Anton Wilhelm Amo:** 1703–1759 is too definite. Halle's dedicated research page uses
   **c. 1703–after 1753** and discusses conflicting death dates. Avoid the sweeping “first African
   doctorate in Europe” unless a source establishes its precise scope; “earned a philosophy doctorate
   at Wittenberg in 1734 and taught at German universities” is well supported.
   [University of Halle](https://www.amo.uni-halle.de/?lang=en),
   [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/spr2026/entries/18thGerman-preKant/).

6. **Ada Lovelace:** narrow “first algorithm intended to be carried out by a machine” to her
   **published 1843 Bernoulli-number procedure for Babbage's Analytical Engine**. The Computer History
   Museum acknowledges debate over the respective contributions. The music prediction is supported;
   the current “creating graphics” claim needs its own source or removal.
   [Computer History Museum](https://www.computerhistory.org/babbage/adalovelace).

## All-person register

“Core supported” means the identity and central contribution match the cited material, not that every
adjective, coordinate, date convention or implication is certified.

| Person | Assessment and recommended treatment | Reference |
| --- | --- | --- |
| Sor Juana Inés de la Cruz | Writer and nun in New Spain: supported. Birth is **1648 or 1651**, not securely 1648. Describe her defence of women's learning rather than casually assigning a modern movement label. | [Mexico's INEHRM](https://inehrm.gob.mx/sitios/proceres/index.php?p=sor-juana) |
| Isaac Newton | Core supported: mathematician/natural philosopher, 1687 *Principia*, Cambridge association. 1643 is the Gregorian birth year; 1642 in English Old Style is not a different person or an error. | [Royal Society](https://royalsociety.org/news/2014/astronaut-tim-peake-principia/) |
| Shah Abbas I | Safavid ruler and Isfahan patron: supported. Replace “most beautiful” with specific construction/patronage. A balanced account should also acknowledge forced population transfers, including Armenians; cultural flourishing alone is incomplete. | [Encyclopaedia Iranica biography](https://www.iranicaonline.org/articles/abbas-i/), [Armenian historian and deportations](https://www.iranicaonline.org/articles/arakel-of-tabriz-armenian-historian/) |
| Queen Nzinga | Ndongo/Matamba ruler and resistance leader: supported. “Inclusive leadership” and the `activist` tag risk implying modern egalitarian abolitionism: she also sold captives into slavery. Birth estimates vary; use an approximate date with a note rather than asserting universal agreement. | [South African History Online](https://sahistory.org.za/people/njinga-ana-de-sousa) |
| Tokugawa Ieyasu | Founder/first shogun of the Tokugawa regime: supported. Attribute later Edo-period cultural developments to the period and successors, not his personal initiatives. Replace absolute “peace” with “relative internal stability”; distinguish shogunal power from the emperor's position. | [World History Encyclopedia](https://www.worldhistory.org/Tokugawa_Ieyasu/), [Otsu history resource](https://rekishihyakka.jp/en/culturalheritages/o-h008/) |
| Voltaire | Dates, writer/philosopher identity, and *Candide* (1759): supported. Replace sweeping praise with specific campaigns for religious toleration and against judicial injustice. Paris is an associated place, not his only intellectual base. | [Oxford Voltaire Foundation](https://www.voltaire.ox.ac.uk/who-was-voltaire/) |
| George Washington | First U.S. president and Continental Army commander: supported. His use of enslaved labour deserves acknowledgement in a balanced biography; the current freedom narrative leaves it out. | [Mount Vernon biography](https://www.mountvernon.org/george-washington/biography), [slavery](https://www.mountvernon.org/george-washington/slavery) |
| Wang Zhenyi | 1768–1797 astronomer, mathematical writer and poet: supported. Her lunar-eclipse explanations are documented. “Best-known” and the exact English calculation-book title are not established by the museum source reviewed. Prefer its documented *Explanation of Lunar Eclipses*, or obtain a scholarly bibliographic citation for the current title. | [Hong Kong Space Museum](https://hk.space.museum/en/web/spm/resources/curators-blog/2021/03/wang-zhenyi-an-extraordinary-woman-astronomer-from-the-qing-dynasty.html) |
| Ibrahim Muteferrika | Correct identity; press priority and lifespan need correction. See priority item 1. | [Library of Congress](https://blogs.loc.gov/law/2023/08/ibrahim-muteferrika-first-muslim-printer-of-the-ottoman-empire/), [TDV](https://islamansiklopedisi.org.tr/ibrahim-muteferrika) |
| Anton Wilhelm Amo | Philosopher from present-day Ghana, teaching in Germany, 1738 treatise: supported. Dates and expansive doctorate priority need qualification. See priority item 5. | [Halle](https://www.amo.uni-halle.de/?lang=en), [Stanford](https://plato.stanford.edu/archives/spr2026/entries/18thGerman-preKant/) |
| Napoleon Bonaparte | Military leader/emperor and 1804 coronation: correct identity. The compressed Russia-to-Elba sequence should distinguish 1812 from the 1814 abdication. Replace praise of “brilliance” with events. A fuller account should include authoritarian rule and colonial slavery, not only legal reform. | [Fondation Napoléon biographical resource](https://www.napoleon.org/wp-content/uploads/2019/03/cm1-bio-napoleon-bonaparte-complete-mars-2019-4.pdf), [colonial slavery](https://www.napoleon.org/en/history-of-the-two-empires/articles/bullet-point-9-napoleon-bring-back-slavery/) |
| Bahá'u'lláh | 1817–1892 founder, teachings, exile and *Kitáb-i-Aqdas*: supported. Forty years is a rounded description covering exile and imprisonment, not forty uninterrupted years in a cell. The faith's own sources establish its teachings; religious truth claims should remain attributed. | [Bahá'í historical account](https://news.bahai.org/media-information/brief-history), [reference library](https://www.bahai.org/library/authoritative-texts/bahaullah/kitab-i-aqdas/17) |
| Simón Bolívar | Correct identity and 1815 *Jamaica Letter*. Independence vision supported. “Believing true independence required a just and equitable society” is an interpretive claim, not a documented quotation; qualify it and source individual social-reform claims separately. | [Brown University primary text](https://library.brown.edu/create/modernlatinamerica/chapters/chapter-2-the-colonial-foundations/primary-documents-with-accompanying-discussion-questions/document-2-simon-bolivar-letter-from-jamaica-september-6-1815/), [UNESCO](https://www.unesco.org/en/memory-world/lac/reply-south-american-gentleman-island-jamaica-letter-simon-bolivar-1815) |
| Liu Mingchuan | Correct governor/general identity and Taiwan association. Incorrect `head of state` game trait; modernization language should be geographically specific. See priority item 4. | [National Tsing Hua University](https://www.ee.nthu.edu.tw/~sdyang/BioInfo/Bio_Liu_MC.htm) |
| Ada Lovelace | Correct mathematician/computing pioneer and 1843 notes. Qualify programming priority and unsupported graphics prediction. See priority item 6. | [Computer History Museum](https://www.computerhistory.org/babbage/adalovelace) |
| Albert Einstein | Core supported, including 1879–1955 and the photoelectric explanation associated with the **1921** Nobel Prize (received in 1922). Do not change it to a relativity prize. Berlin is an association, not birthplace. | [Nobel Foundation facts](https://www.nobelprize.org/prizes/physics/1921/einstein/facts/) |
| Lech Wałęsa | 1943 birth, electrician, Solidarity leadership and 1990 election supported. Presidential “first” needs correction. Living status should be rechecked whenever publishing a dated release. | [Nobel Foundation](https://www.nobelprize.org/prizes/peace/1983/walesa/facts/), [Polish presidency](https://www.president.pl/en/archives/andrzej-duda/presidential-residences/belweder) |
| Franklin D. Roosevelt | 1882–1945, presidency and four elections supported. Correct the Social Security disability claim. See priority item 3. | [FDR Library](https://www.fdrlibrary.org/fdr-biography), [SSA](https://www.ssa.gov/policy/docs/ssb/v66n3/v66n3p1.html) |
| Nelson Mandela | Core supported: anti-apartheid leader, presidency, 27-year imprisonment, approximately 18 years on Robben Island. 1964–1982 correctly describes the long imprisonment there, but excludes a brief 1963 stay. His 2013 death does not make a 20th-century exhibition placement wrong. | [Nelson Mandela Foundation](https://www.nelsonmandela.org/biography) |
| Mahatma Gandhi | Correct independence/nonviolent-resistance identity and 1930 Salt March. Clarify that he departed with a small group, commonly counted as **78 companions**, and attracted wider participation. Do not imply thousands accompanied the full route from the start or that independence was his achievement alone. | [Odisha government history article](https://magazines.odisha.gov.in/orissareview/2022/August/engpdf/page25-30.pdf), [NCERT/NRSC teaching resource](https://bhuvan-app1.nrsc.gov.in/mhrd_ncert/help/Dandi_march.pdf) |

## Original data and display recommendations

- Add source references and a review date per person, ideally visible from the exhibit.
- Separate numeric timeline positioning from a human-readable lifespan label. The current schema only
  supports numeric dates and treats `died: null` as living; it cannot truthfully represent Amo's unknown
  death year. Do not replace an unknown death with `null` without changing that behaviour.
- Explain that game “traits” are broad editorial classifications, not personality diagnoses or moral
  endorsements. Do not equate a governor with a head of state.
- The 20th-century map's present-day borders are not necessarily borders at the time of the events.
  City pins are illustrative associations; this review did not geocode every point to a historical site.
- Source and authenticate each portrait and work image separately. Filenames are not provenance.
  This audit does **not** certify that every picture is of the named person or that it dates from their
  lifetime. Modern imagined portraits, monuments and later history paintings must be labelled as such.
- Keep achievements, criticism, disputed evidence and religious beliefs distinct. Replace unsupported
  superlatives with concrete events; do not present either uniformly heroic or uniformly condemnatory
  biographies as neutral history.

## Remaining next step

Undertake a separate image-provenance review before public-facing claims of historical verification.
The approved text revision, date-display support and per-person citations are implemented above.
Preserve this audit as the rationale for edits; further historical corrections should cite evidence.
