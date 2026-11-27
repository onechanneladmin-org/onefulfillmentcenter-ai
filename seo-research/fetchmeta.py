import sys,re,json,urllib.request
out=[]
for u in open('research/live-sitemap.txt').read().split():
    try:
        req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (SEO audit)'})
        r=urllib.request.urlopen(req,timeout=20); h=r.read().decode('utf8','ignore'); code=r.status; final=r.geturl()
    except Exception as e:
        out.append(dict(url=u,status=str(e)[:60])); continue
    g=lambda p:(re.search(p,h,re.S) or [None,None])[1]
    h1=[re.sub('<[^>]+>','',x).strip() for x in re.findall(r'<h1[^>]*>(.*?)</h1>',h,re.S)]
    h2=len(re.findall(r'<h2',h))
    words=len(re.sub(r'<script.*?</script>|<style.*?</style>|<[^>]+>',' ',h,flags=re.S).split())
    out.append(dict(url=u,status=code,final=final,title=g(r'<title>(.*?)</title>'),desc=g(r'<meta name="description" content="([^"]*)'),
      h1=' | '.join(h1),h1_count=len(h1),h2_count=h2,words=words,canonical=g(r'rel="canonical" href="([^"]*)'),
      robots=g(r'<meta name="robots" content="([^"]*)'),schema=sorted(set(re.findall(r'"@type":"(\w+)"',h)))))
json.dump(out,open('research/site-inventory.json','w'),indent=1)
for o in out: print(o.get('status'),o['url'].replace('https://onefulfillcenter.com',''),'|',(o.get('title') or '')[:70],'|H1:',(o.get('h1') or '')[:50],'|w',o.get('words'))
