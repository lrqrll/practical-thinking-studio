from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import json,hashlib,pathlib
import sys
root=pathlib.Path(__file__).resolve().parents[2]; src=pathlib.Path(sys.argv[1])
for weight,label in [(400,'Regular'),(700,'Bold')]:
 f=instantiateVariableFont(TTFont(src),{'wght':weight},inplace=True)
 f.recalcTimestamp=False
 for ident,value in [(1,'NEXUS Noto TC'),(2,label),(4,'NEXUS Noto TC '+label),(6,'NEXUSNotoTC-'+label),(16,'NEXUS Noto TC'),(17,label)]:
  f['name'].setName(value,ident,3,1,0x409)
 f['OS/2'].usWeightClass=weight
 f['OS/2'].fsSelection=(f['OS/2'].fsSelection & ~(32|64)) | (32 if weight==700 else 64)
 f['head'].macStyle=(f['head'].macStyle & ~1) | (1 if weight==700 else 0)
 f.save(root/('pdf-noto-tc-'+label.lower()+'.ttf'))
f=TTFont(src); chars=sorted(f.getBestCmap()); (root/'pdf-font-coverage.json').write_text(json.dumps(chars,separators=(',',':')))
(root/'PDF-FONT-OFL.txt').write_bytes(src.with_name('OFL.txt').read_bytes())
