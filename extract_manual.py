import json
from pathlib import Path
from shutil import copyfileobj
from zipfile import ZipFile
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parent
DOC=ROOT.parent/'output/word/2019_SportTrek_STT343VBH_Verified_Owner_Manual_and_Repair_Guide.docx'
ASSETS=ROOT/'public/assets';ASSETS.mkdir(exist_ok=True,parents=True)
d=Document(DOC)
image_map={}
with ZipFile(DOC) as z:
    for i,name in enumerate(sorted(n for n in z.namelist() if n.startswith('word/media/')),1):
        out=f'manual-{i:02d}{Path(name).suffix.lower()}'
        with z.open(name) as src,(ASSETS/out).open('wb') as dst:copyfileobj(src,dst)
        image_map['/'+name]='/assets/'+out

volumes=[];volume=None;chapter=None;section=None
for el in d.element.body.iterchildren():
    if el.tag==qn('w:sectPr'):continue
    if el.tag==qn('w:p'):
        p=Paragraph(el,d._body)
        style=p.style.name
        text=p.text.strip()
        if style=='Heading 1' and text.startswith('Volume '):
            volume={'title':text,'chapters':[]};volumes.append(volume);chapter=None;section=None
        elif style=='Heading 2' and volume is not None:
            chapter={'id':f'chapter-{sum(len(v["chapters"]) for v in volumes)}','title':text,'volume':len(volumes),'blocks':[]}
            volume['chapters'].append(chapter);section=None
        elif chapter is not None:
            if style in ('Heading 3','Heading 4'):
                chapter['blocks'].append({'type':'heading','level':3 if style=='Heading 3' else 4,'text':text})
            elif text:
                chapter['blocks'].append({'type':'text','text':text,'style':style})
            for blip in el.iter(qn('a:blip')):
                rid=blip.get(qn('r:embed'))
                if rid and rid in d.part.rels:
                    path=d.part.rels[rid].target_part.partname
                    asset=image_map.get(str(path))
                    if asset:chapter['blocks'].append({'type':'image','src':asset,'alt':text or 'Manual drawing or manufacturer illustration'})
    elif el.tag==qn('w:tbl') and chapter is not None:
        t=Table(el,d._body)
        rows=[[c.text.strip() for c in r.cells] for r in t.rows]
        if rows:chapter['blocks'].append({'type':'table','headers':rows[0],'rows':rows[1:]})

assert len(volumes)==3,(len(volumes),[v['title'] for v in volumes])
assert sum(len(v['chapters']) for v in volumes)==38
payload={'title':'SportTrek STT343VBH','version':'5','vin':'4EZT13421K8076305','volumes':volumes}
(ROOT/'src/manual.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('volumes',len(volumes),'chapters',sum(len(v['chapters']) for v in volumes),'images',len(image_map),'data KiB',(ROOT/'src/manual.json').stat().st_size//1024)
