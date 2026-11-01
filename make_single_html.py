import base64
import re
from pathlib import Path

root=Path(__file__).resolve().parent
dist=root/'dist'
source=(dist/'index.html').read_text(encoding='utf-8')
js_name=re.search(r'<script type="module" crossorigin src="([^"]+)"',source).group(1)
css_name=re.search(r'<link rel="stylesheet" crossorigin href="([^"]+)"',source).group(1)
js=(dist/js_name.lstrip('/')).read_text(encoding='utf-8')
css=(dist/css_name.lstrip('/')).read_text(encoding='utf-8')

for img in sorted((dist/'assets').glob('manual-*')):
    mime='image/jpeg' if img.suffix.lower() in ('.jpg','.jpeg') else 'image/png'
    data='data:'+mime+';base64,'+base64.b64encode(img.read_bytes()).decode('ascii')
    asset='/assets/'+img.name
    if asset not in js:print('Note, asset path not in JS',asset)
    js=js.replace(asset,data)

source=re.sub(r'\s*<link rel="manifest"[^>]*>', '',source)
source=re.sub(r'\s*<link rel="apple-touch-icon"[^>]*>', '',source)
source=re.sub(r'\s*<script type="module" crossorigin src="[^"]+"></script>', '',source)
source=re.sub(r'\s*<link rel="stylesheet" crossorigin href="[^"]+">', '',source)
source=source.replace('</head>','<style>'+css+'</style></head>')
source=source.replace('</body>','<script type="module">'+js.replace('</script','<\\/script')+'</script></body>')
out=root.parent/'output'/'SportTrek_STT343VBH_iPhone_React_Guide.html'
out.parent.mkdir(exist_ok=True)
out.write_text(source,encoding='utf-8')
print('Saved',out,'size',out.stat().st_size,'bytes','image data URLs',source.count('data:image/'))
